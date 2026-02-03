import express from "express";
import cors from "cors";

const app = express();

// ===== CORS FIX =====
app.use(cors({
  origin: '*', // For production, replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ===== In-memory Data =====
let operators = [
  { _id: "1", name: "John Smith", team: "Team A", competences: [{ standard: "Welding", level: "expert" }], status: "active", totalAssignments: 12 },
  { _id: "2", name: "Jane Doe", team: "Team B", competences: [{ standard: "Assembly", level: "expert" }], status: "active", totalAssignments: 15 }
];

let standards = [
  { _id: "welding", name: "Welding", department: "Production", criticality: "high" },
  { _id: "assembly", name: "Assembly", department: "Production", criticality: "medium" }
];

let competencies = [{ id: "1", name: "Welding" }];
let teams = [{ id: "1", name: "Team A" }];
let weeklyAssignments = [];
let rotations = [];

// ===== HELPER FUNCTIONS (To prevent "function not defined" errors) =====
const getCollection = async (name, data) => data;
const insertOne = async (name, item, collection) => {
  collection.push(item);
  return item;
};

// ===== FIXED ANALYTICS ENDPOINT =====
// This was likely failing if calculations resulted in NaN or undefined
app.get("/api/analytics/rotation", (req, res) => {
  try {
    const analytics = operators.map((op) => ({
      operatorId: op._id || "unknown",
      name: op.name || "Unnamed",
      totalAssignments: op.totalAssignments || 0,
      utilizationRate: Math.min(100, Math.round((op.totalAssignments || 0) * 4.6)),
      competenceCount: op.competences ? op.competences.length : 0,
    }));
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: "Analytics calculation failed" });
  }
});

// ===== FIXED SETUP ENDPOINTS =====
// Ensure these paths match what your frontend is calling
app.get("/api/setup/competencies", (req, res) => res.json(competencies));
app.get("/api/setup/teams", (req, res) => res.json(teams));

// ===== STANDARDS (Preserved Logic) =====
app.get("/api/standards", async (req, res) => {
  const data = await getCollection('standards', standards);
  res.json(data);
});

app.get("/api/setup/standards", async (req, res) => {
  const data = await getCollection('standards', standards);
  res.json(data);
});

// ===== HEALTH CHECK =====
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is responding with JSON" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});