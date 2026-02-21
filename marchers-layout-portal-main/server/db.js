const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "plots.json");

/**
 * Simple JSON-file-based storage for plots.
 * Each plot has: { id, label, status } where status is "available" | "sold" | "hold"
 */

function loadPlots() {
    if (!fs.existsSync(DB_PATH)) {
        // Seed 183 plots on first run
        console.log("🌱 Seeding 183 plots...");
        const plots = Array.from({ length: 183 }, (_, i) => ({
            id: i + 1,
            label: `Plot ${i + 1}`,
            status: "available",
        }));
        fs.writeFileSync(DB_PATH, JSON.stringify(plots, null, 2), "utf-8");
        console.log("✅ Seeded 183 plots successfully.");
        return plots;
    }

    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const plots = JSON.parse(raw);

    // Migrate old format (boolean "sold") to new format (string "status")
    let needsMigration = false;
    const migrated = plots.map((p) => {
        if (typeof p.sold === "boolean" && !p.status) {
            needsMigration = true;
            return { id: p.id, label: p.label, status: p.sold ? "sold" : "available" };
        }
        return p;
    });

    if (needsMigration) {
        console.log("🔄 Migrating plots from old format to new status format...");
        fs.writeFileSync(DB_PATH, JSON.stringify(migrated, null, 2), "utf-8");
    }

    return migrated;
}

function savePlots(plots) {
    fs.writeFileSync(DB_PATH, JSON.stringify(plots, null, 2), "utf-8");
}

function getPlots() {
    return loadPlots();
}

function getPlotById(id) {
    const plots = loadPlots();
    return plots.find((p) => p.id === id) || null;
}

function setPlotStatus(id, status) {
    const plots = loadPlots();
    const plot = plots.find((p) => p.id === id);
    if (!plot) return null;

    plot.status = status;
    savePlots(plots);
    return plot;
}

module.exports = { getPlots, getPlotById, setPlotStatus };
