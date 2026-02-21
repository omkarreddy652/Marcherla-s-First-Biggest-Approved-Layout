import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";
import { getOrInitPlots, PLOTS_KEY, togglePlotById } from "../_store.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-token");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.headers["x-admin-token"];
  const expectedToken = process.env.ADMIN_TOKEN;
  if (!expectedToken) {
    return res.status(500).json({ error: "ADMIN_TOKEN is not configured" });
  }
  if (token !== expectedToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const id = Number(req.body?.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid plot id" });
  }

  try {
    const plots = await getOrInitPlots();
    const current = plots.find((p) => p.id === id);
    if (!current) {
      return res.status(404).json({ error: "Plot not found" });
    }

    const updatedPlots = togglePlotById(plots, id);
    await kv.set(PLOTS_KEY, updatedPlots);
    const updated = updatedPlots.find((p) => p.id === id)!;
    return res.status(200).json(updated);
  } catch (error) {
    console.error("POST /api/plots/toggle failed:", error);
    return res.status(500).json({ error: "Failed to update plot" });
  }
}
