const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { getPlots, setPlotStatus } = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// In-memory token store (valid until server restarts)
const validTokens = new Set();

// Middleware
app.use(cors());
app.use(express.json());

// Valid statuses
const VALID_STATUSES = ["available", "sold", "hold", "not-for-sale"];

// ─── Auth helpers ────────────────────────────────────────────────
function generateToken() {
    return crypto.randomBytes(32).toString("hex");
}

function requireAdmin(req, res, next) {
    const token = req.headers["x-admin-token"];
    if (!token || !validTokens.has(token)) {
        return res.status(401).json({ error: "Unauthorized. Admin token required." });
    }
    next();
}

// ─── Routes ──────────────────────────────────────────────────────

// Admin login
app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Invalid password." });
    }
    const token = generateToken();
    validTokens.add(token);
    res.json({ token });
});

// Admin logout
app.post("/api/admin/logout", requireAdmin, (req, res) => {
    const token = req.headers["x-admin-token"];
    validTokens.delete(token);
    res.json({ success: true });
});

// Get all plots (public)
app.get("/api/plots", (_req, res) => {
    const plots = getPlots();
    res.json(plots);
});

// Set a plot's status (admin only)
app.post("/api/plots/:id/status", requireAdmin, (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 1 || id > 183) {
        return res.status(400).json({ error: "Invalid plot ID." });
    }

    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` });
    }

    const updated = setPlotStatus(id, status);
    if (!updated) {
        return res.status(404).json({ error: "Plot not found." });
    }

    res.json(updated);
});

// Keep old toggle endpoint for backward compat (cycles: available → sold → hold → available)
app.post("/api/plots/:id/toggle", requireAdmin, (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 1 || id > 183) {
        return res.status(400).json({ error: "Invalid plot ID." });
    }

    const plots = getPlots();
    const plot = plots.find((p) => p.id === id);
    if (!plot) {
        return res.status(404).json({ error: "Plot not found." });
    }

    // Cycle through statuses: available -> sold -> hold -> not-for-sale -> available
    const cycle = { available: "sold", sold: "hold", hold: "not-for-sale", "not-for-sale": "available" };
    const newStatus = cycle[plot.status] || "available";
    const updated = setPlotStatus(id, newStatus);

    res.json(updated);
});

// ─── Start ───────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Marcherla Plots API running on http://localhost:${PORT}`);
    console.log(`   Admin password: ${ADMIN_PASSWORD}`);
});
