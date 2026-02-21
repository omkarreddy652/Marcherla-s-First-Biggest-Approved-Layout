import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const password = req.body?.password;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminPassword || !adminToken) {
    return res.status(500).json({ error: "ADMIN_PASSWORD/ADMIN_TOKEN are not configured" });
  }

  if (password !== adminPassword) {
    return res.status(401).json({ error: "Invalid password" });
  }

  return res.status(200).json({ token: adminToken });
}
