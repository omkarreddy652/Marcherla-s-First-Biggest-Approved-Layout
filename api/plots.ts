import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getOrInitPlots } from "./_store.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const plots = await getOrInitPlots();
    return res.status(200).json(plots);
  } catch (error) {
    console.error("GET /api/plots failed:", error);
    return res.status(500).json({ error: "Failed to load plots" });
  }
}
