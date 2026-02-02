import express from "express";
import cors from "cors";

const app = express();

// 1. CORS CONFIGURATION
app.use(cors({
  origin: '*', // Allows all origins - safest for initial Render deployment
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // Must be false if origin is '*'
}));

app.options('*', cors());
app.use(express.json());

// 2. DEBUG LOGGING
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ===== DATA (Condensed for brevity) =====
let operators = [
  { _id: "1", name: "John Smith", team: "Team A", competences: [{ standard: "Welding", level: "expert", yearsExperience: 8 }], status: "active", totalAssignments: 12 },
  { _id: "2", name: "Jane Doe", team: "Team B", competences: [{ standard: "Assembly", level: "expert", yearsExperience: 6 }], status: "active", totalAssignments: 15 }
];

let standards = [
  { _id: "welding", name: "Welding", department: "Production", criticality: "high" },
  { _id: "assembly", name: "Assembly", department: "Production", criticality: "medium" }
];

// ===== ROUTES =====

// Health Check (Crucial for Render monitoring)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/operators", (req, res) => res.json(operators));
app.get("/api/standards", (req, res) => res.json(standards));

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  // Simple mock login
  if (username && password) {
    const token = btoa(JSON.stringify({ username }));
    res.json({ token, user: { username, role: "admin" } });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// ===== SERVER START =====
// Render injects the PORT environment variable automatically
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server is live on port ${PORT}`);
});