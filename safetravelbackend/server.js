// backend/server.js
const express = require("express");
const path = require("path");
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../safetravelfrontend")));

// Mock alerts
const alerts = [
  { id: 1, type: "Flood", severity: "High", lat: 22.57, lon: 88.36, message: "River overflow detected" },
  { id: 2, type: "Cyclone", severity: "Moderate", lat: 19.07, lon: 72.87, message: "Strong winds reported" },
  { id: 3, type: "Earthquake", severity: "Moderate", lat: 28.70, lon: 77.10, message: "Minor tremors felt" },
  { id: 4, type: "Landslide", severity: "High", lat: 11.01, lon: 76.95, message: "Road blockage near hilly region" },
];

// API: Get alerts
app.get("/api/alerts", (req, res) => {
  res.json(alerts);
});

// API: Get risk
app.get("/api/risk", (req, res) => {
  const { lat, lon } = req.query;
  let risk = "Safe";
  for (const alert of alerts) {
    const dist = Math.sqrt((alert.lat - lat) ** 2 + (alert.lon - lon) ** 2);
    if (dist < 1.5 && alert.severity === "High") {
      risk = "High";
      break;
    } else if (dist < 3) {
      risk = "Moderate";
    }
  }
  res.json({
    risk,
    description:
      risk === "High"
        ? "High-risk zone! Avoid travel if possible."
        : risk === "Moderate"
        ? "Nearby hazards detected — stay cautious."
        : "Safe for travel.",
  });
});

// API: Get routes
app.get("/api/routes", (req, res) => {
  const { origin, destination } = req.query;
  res.json([
    {
      id: "A",
      summary: `${origin} → ${destination} (Direct Route)`,
      duration: "2h 15m",
      risk: "Moderate",
    },
    {
      id: "B",
      summary: `${origin} → ${destination} (Alternate Route)`,
      duration: "2h 40m",
      risk: "Safe",
    },
  ]);
});

// Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../safetravelfrontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ DATS running at http://localhost:${PORT}`);
});