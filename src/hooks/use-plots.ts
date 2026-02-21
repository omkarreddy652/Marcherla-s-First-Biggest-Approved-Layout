import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch, getApiBase } from "@/lib/api";
import { generatePlots, Plot } from "@/data/plots";

const POLL_INTERVAL = 5000; // 5 seconds

export const usePlots = () => {
  const [plots, setPlots] = useState<Plot[]>(() => {
    const saved = localStorage.getItem("marcherla-plots");
    if (saved) return JSON.parse(saved);
    return generatePlots();
  });

  const apiBase = getApiBase();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleLocally = useCallback((id: number) => {
    setPlots((prev) => {
      const cycle = { available: "sold", sold: "hold", hold: "not-for-sale", "not-for-sale": "available" } as const;
      const updated = prev.map((p) =>
        p.id === id ? { ...p, status: cycle[p.status] || "available" } : p
      ) as Plot[];
      localStorage.setItem("marcherla-plots", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Fetch plots from backend
  const fetchPlots = useCallback(async () => {
    if (!apiBase) return;
    try {
      const remote = await apiFetch<Plot[]>("/plots");
      if (Array.isArray(remote)) {
        setPlots(remote);
        localStorage.setItem("marcherla-plots", JSON.stringify(remote));
      }
    } catch {
      // keep local data on error
    }
  }, [apiBase]);

  // Initial fetch + polling every 5 seconds
  useEffect(() => {
    if (!apiBase) return;

    // Initial fetch
    fetchPlots();

    // Set up polling
    intervalRef.current = setInterval(fetchPlots, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [apiBase, fetchPlots]);

  const togglePlot = useCallback(
    async (id: number) => {
      if (!apiBase) {
        // Offline mode: cycle locally
        toggleLocally(id);
        return;
      }

      // Online mode: call backend with admin token
      const token = localStorage.getItem("admin-token");
      if (!token) {
        console.warn("No admin token found. Toggle requires admin login.");
        return;
      }

      // Logged in via local fallback mode.
      if (token === "local-admin") {
        toggleLocally(id);
        return;
      }

      try {
        const updated = await apiFetch<Plot>(`/plots/${id}/toggle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": token,
          },
        });

        // Update local state immediately
        setPlots((prev) => {
          const newPlots = prev.map((p) =>
            p.id === updated.id ? updated : p
          );
          localStorage.setItem("marcherla-plots", JSON.stringify(newPlots));
          return newPlots;
        });
      } catch (e) {
        console.error("Failed to toggle plot:", e);
        // If backend call fails, keep admin panel usable in local mode.
        toggleLocally(id);
      }
    },
    [apiBase, toggleLocally]
  );

  return { plots, setPlots, togglePlot, fetchPlots } as const;
};
