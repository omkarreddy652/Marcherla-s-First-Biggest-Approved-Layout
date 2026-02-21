import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { generatePlots, Plot } from "@/data/plots";

const POLL_INTERVAL = 5000; // 5 seconds

export const usePlots = () => {
  const [plots, setPlots] = useState<Plot[]>(() => {
    const saved = localStorage.getItem("marcherla-plots");
    if (saved) return JSON.parse(saved);
    return generatePlots();
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch plots from backend
  const fetchPlots = useCallback(async () => {
    try {
      const remote = await apiFetch<Plot[]>("/api/plots");
      if (Array.isArray(remote)) {
        setPlots(remote);
        localStorage.setItem("marcherla-plots", JSON.stringify(remote));
      }
    } catch {
      // keep local data on error
    }
  }, []);

  // Initial fetch + polling every 5 seconds
  useEffect(() => {
    // Initial fetch
    fetchPlots();

    // Set up polling
    intervalRef.current = setInterval(fetchPlots, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchPlots]);

  const togglePlot = useCallback(
    async (id: number) => {
      const token = localStorage.getItem("admin-token");
      if (!token) {
        console.warn("No admin token found. Toggle requires admin login.");
        return;
      }

      try {
        const updated = await apiFetch<Plot>("/api/plots/toggle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": token,
          },
          body: JSON.stringify({ id }),
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
      }
    },
    []
  );

  return { plots, setPlots, togglePlot, fetchPlots } as const;
};
