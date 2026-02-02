import express from "express";
import cors from "cors";

const app = express();

// CORS - using wildcard temporarily to rule out origin issues
app.use(cors({
  origin: '*',                          // ← TEMPORARY for testing! Change back to 'https://competence-frontend.onrender.com' later
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Explicitly handle OPTIONS preflight requests (helps some browsers/Render setups)
app.options('*', cors());

// Log every incoming request (very useful for Render logs)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Body: ${JSON.stringify(req.body)} - ${new Date().toISOString()}`);
  next();
});

app.use(express.json());

// ===== In-memory data stores =====
let operators = [
  {
    _id: "1",
    name: "John Smith",
    team: "Team A",
    competences: [
      { standard: "Welding", level: "expert", yearsExperience: 8 },
      { standard: "Assembly", level: "qualified", yearsExperience: 3 },
    ],
    status: "active",
    totalAssignments: 12,
  },
  {
    _id: "2",
    name: "Jane Doe",
    team: "Team B",
    competences: [
      { standard: "Assembly", level: "expert", yearsExperience: 6 },
      { standard: "Testing", level: "qualified", yearsExperience: 4 },
      { standard: "Welding", level: "basic", yearsExperience: 1 },
    ],
    status: "active",
    totalAssignments: 15,
  },
  {
    _id: "3",
    name: "Michael Chen",
    team: "Team A",
    competences: [
      { standard: "Testing", level: "expert", yearsExperience: 7 },
      { standard: "Assembly", level: "basic", yearsExperience: 2 },
    ],
    status: "active",
    totalAssignments: 10,
  },
];

let standards = [
  {
    _id: "welding",
    name: "Welding",
    department: "Production",
    criticality: "high",
  },
  {
    _id: "assembly",
    name: "Assembly",
    department: "Production",
    criticality: "medium",
  },
  {
    _id: "testing",
    name: "Testing",
    department: "Quality",
    criticality: "high",
  },
  {
    _id: "packaging",
    name: "Packaging",
    department: "Logistics",
    criticality: "low",
  },
];

let weeklyAssignments = [
  {
    _id: "w1",
    week: 1,
    year: 2026,
    date: "2026-01-06",
    assignments: [
      { operatorId: "1", standard: "Welding", days: 5, rotationScore: 0.2 },
      { operatorId: "2", standard: "Assembly", days: 3, rotationScore: 0.1 },
      { operatorId: "3", standard: "Testing", days: 5, rotationScore: 0.3 },
    ],
  },
];

let competencies = [
  { id: "1", name: "Welding" },
  { id: "2", name: "Assembly" },
  { id: "3", name: "Testing" },
  { id: "4", name: "Packaging" },
];

let teams = [
  { id: "1", name: "Team A" },
  { id: "2", name: "Team B" },
  { id: "3", name: "Team C" },
];

let qualifications = [
  { id: "1", name: "Basic" },
  { id: "2", name: "Qualified" },
  { id: "3", name: "Expert" },
];

let users = [
  { id: "1", username: "admin", password: "admin123", role: "admin" },
  { id: "2", username: "manager", password: "manager123", role: "manager" },
  { id: "3", username: "operator", password: "operator123", role: "operator" },
];

let rotations = [
  {
    _id: "r1",
    fromOperatorId: "2",
    toOperatorId: "1",
    standard: "Assembly",
    reason: "Workload balancing - High utilization detected",
    scheduledDate: "2026-02-10",
    isAutomatic: true,
    status: "pending",
    createdAt: "2026-02-01T10:00:00.000Z",
  },
  {
    _id: "r2",
    fromOperatorId: "2",
    toOperatorId: "3",
    standard: "Testing",
    reason: "Workload balancing - High utilization detected",
    scheduledDate: "2026-02-11",
    isAutomatic: true,
    status: "pending",
    createdAt: "2026-02-01T10:05:00.000Z",
  },
];

// ===== Authentication =====
app.post("/api/auth/login", (req, res) => {
  console.log("Login attempt:", req.body); // Debug log
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = Buffer.from(
    JSON.stringify({ id: user.id, username: user.username, role: user.role })
  ).toString("base64");

  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role },
  });
});

app.post("/api/auth/logout", (req, res) => {
  res.json({ success: true });
});

// ===== Operators =====
app.get("/api/operators", (req, res) => res.json(operators));
app.get("/api/operators/:id", (req, res) => {
  const op = operators.find((o) => o._id === req.params.id);
  if (!op) return res.status(404).json({ error: "Operator not found" });
  res.json(op);
});
app.post("/api/operators", (req, res) => {
  const newOperator = {
    _id: Date.now().toString(),
    ...req.body,
    status: "active",
    totalAssignments: 0,
  };
  operators.push(newOperator);
  res.json(newOperator);
});
app.put("/api/operators/:id", (req, res) => {
  const op = operators.find((o) => o._id === req.params.id);
  if (!op) return res.status(404).json({ error: "Operator not found" });
  Object.assign(op, req.body);
  res.json(op);
});
app.delete("/api/operators/:id", (req, res) => {
  operators = operators.filter((o) => o._id !== req.params.id);
  res.json({ success: true });
});

// ===== Competencies =====
app.get("/api/setup/competencies", (req, res) => res.json(competencies));
app.post("/api/setup/competencies", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  const newItem = { id: Date.now().toString(), name };
  competencies.push(newItem);
  res.json(newItem);
});
app.put("/api/setup/competencies/:id", (req, res) => {
  const item = competencies.find((c) => c.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  Object.assign(item, req.body);
  res.json(item);
});
app.delete("/api/setup/competencies/:id", (req, res) => {
  competencies = competencies.filter((c) => c.id !== req.params.id);
  res.json({ success: true });
});

// ===== Standards =====
app.get("/api/standards", (req, res) => res.json(standards));

app.post("/api/standards", (req, res) => {
  const { name, department, criticality } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  const newStandard = {
    _id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    department: department || "",
    criticality: criticality || "medium",
  };
  standards.push(newStandard);
  res.json(newStandard);
});

app.put("/api/standards/:id", (req, res) => {
  const std = standards.find((s) => s._id === req.params.id);
  if (!std) return res.status(404).json({ error: "Not found" });
  Object.assign(std, req.body);
  res.json(std);
});

app.delete("/api/standards/:id", (req, res) => {
  const index = standards.findIndex((s) => s._id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Not found" });
  standards.splice(index, 1);
  res.json({ success: true });
});

app.get("/api/setup/standards", (req, res) => res.json(standards));

// ===== Teams =====
app.get("/api/setup/teams", (req, res) => res.json(teams));
app.post("/api/setup/teams", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  const newItem = { id: Date.now().toString(), name };
  teams.push(newItem);
  res.json(newItem);
});
app.put("/api/setup/teams/:id", (req, res) => {
  const item = teams.find((t) => t.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  Object.assign(item, req.body);
  res.json(item);
});
app.delete("/api/setup/teams/:id", (req, res) => {
  teams = teams.filter((t) => t.id !== req.params.id);
  res.json({ success: true });
});

// ===== Qualifications =====
app.get("/api/setup/qualifications", (req, res) => res.json(qualifications));
app.post("/api/setup/qualifications", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  const newItem = { id: Date.now().toString(), name };
  qualifications.push(newItem);
  res.json(newItem);
});
app.put("/api/setup/qualifications/:id", (req, res) => {
  const item = qualifications.find((q) => q.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  Object.assign(item, req.body);
  res.json(item);
});
app.delete("/api/setup/qualifications/:id", (req, res) => {
  qualifications = qualifications.filter((q) => q.id !== req.params.id);
  res.json({ success: true });
});

// ===== Planning =====
app.get("/api/planning/weeks/:week/:year", (req, res) => {
  const week = parseInt(req.params.week, 10);
  const year = parseInt(req.params.year, 10);

  let entry = weeklyAssignments.find((w) => w.week === week && w.year === year);

  if (!entry) {
    const approxMonday = new Date(year, 0, 4 + (week - 1) * 7);
    const dateStr = approxMonday.toISOString().split("T")[0];

    entry = {
      _id: `w${year}-${String(week).padStart(2, "0")}`,
      week,
      year,
      date: dateStr,
      assignments: [],
    };
    weeklyAssignments.push(entry);
  }

  res.json(entry);
});

app.put("/api/planning/weeks/:week/:year", (req, res) => {
  const week = parseInt(req.params.week, 10);
  const year = parseInt(req.params.year, 10);

  let entry = weeklyAssignments.find((w) => w.week === week && w.year === year);

  if (!entry) {
    const approxMonday = new Date(year, 0, 4 + (week - 1) * 7);
    const dateStr = approxMonday.toISOString().split("T")[0];

    entry = {
      _id: `w${year}-${String(week).padStart(2, "0")}`,
      week,
      year,
      date: dateStr,
      assignments: [],
    };
    weeklyAssignments.push(entry);
  }

  entry.assignments = Array.isArray(req.body.assignments)
    ? req.body.assignments
    : [];
  res.json(entry);
});

// ===== Analytics =====
app.get("/api/analytics/rotation", (req, res) => {
  const analytics = operators.map((op) => ({
    operatorId: op._id,
    name: op.name,
    totalAssignments: op.totalAssignments,
    utilizationRate: Math.min(100, Math.round(op.totalAssignments * 4.6)),
    competenceCount: op.competences.length,
  }));
  res.json(analytics);
});

app.get("/api/analytics/standards", (req, res) => {
  const standardsAnalytics = standards.map((std) => {
    const operatorCount = operators.filter((op) =>
      op.competences.some((comp) => comp.standard === std.name)
    ).length;

    const totalDays = weeklyAssignments.reduce((sum, week) => {
      return sum + week.assignments.filter((a) => a.standard === std.name)
        .reduce((daySum, a) => daySum + (a.days || 0), 0);
    }, 0);

    return {
      standard: std.name,
      totalDays,
      operatorCount,
      criticality: std.criticality,
    };
  });
  res.json(standardsAnalytics);
});

// ===== Rotations =====
app.get("/api/rotation", (req, res) => res.json(rotations));
app.get("/api/rotation/:id", (req, res) => {
  const rotation = rotations.find((r) => r._id === req.params.id);
  if (!rotation) return res.status(404).json({ error: "Rotation not found" });
  res.json(rotation);
});
app.post("/api/rotation", (req, res) => {
  const {
    fromOperatorId,
    toOperatorId,
    standard,
    reason,
    scheduledDate,
    isAutomatic,
  } = req.body;

  if (!fromOperatorId || !toOperatorId || !standard)
    return res.status(400).json({ error: "Missing required fields" });

  const newRotation = {
    _id: Date.now().toString(),
    fromOperatorId,
    toOperatorId,
    standard,
    reason: reason || "Manual rotation",
    scheduledDate,
    isAutomatic: !!isAutomatic,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  rotations.push(newRotation);
  res.json(newRotation);
});
app.put("/api/rotation/:id", (req, res) => {
  const rotation = rotations.find((r) => r._id === req.params.id);
  if (!rotation) return res.status(404).json({ error: "Rotation not found" });
  Object.assign(rotation, req.body);
  res.json(rotation);
});
app.delete("/api/rotation/:id", (req, res) => {
  rotations = rotations.filter((r) => r._id !== req.params.id);
  res.json({ success: true });
});

// Auto-rotation suggestions
app.post("/api/rotation/auto/generate", (req, res) => {
  const suggestions = [];
  const highUtil = operators.filter((op) => op.totalAssignments >= 14);

  highUtil.forEach((op) => {
    op.competences.forEach((comp) => {
      const candidates = operators.filter(
        (other) =>
          other._id !== op._id &&
          other.competences.some((c) => c.standard === comp.standard) &&
          other.totalAssignments < op.totalAssignments - 2,
      );

      candidates.forEach((target) => {
        suggestions.push({
          fromOperatorId: op._id,
          fromName: op.name,
          toOperatorId: target._id,
          toName: target.name,
          standard: comp.standard,
          reason: "Workload balancing - high utilization detected",
          isAutomatic: true,
          priority:
            op.totalAssignments - target.totalAssignments > 5
              ? "high"
              : "medium",
        });
      });
    });
  });

  res.json(suggestions);
});

// ===== Health check =====
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "backend",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      operators: "/api/operators",
      standards: "/api/standards",
      planning: "/api/planning/weeks",
      analytics: "/api/analytics",
      rotation: "/api/rotation",
    },
  });
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Backend running on port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/health`);
  console.log(`     http://localhost:${PORT}/api/analytics/rotation`);
});