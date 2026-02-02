import React from "react";

export default function Dashboard({ operators, standards }) {
  const totalOperators = operators.length;
  const totalStandards = standards.length;
  const activeOperators = operators.filter((op) => op.status === "active").length;
  const avgCompetences = (
    operators.reduce((sum, op) => sum + op.competences.length, 0) / totalOperators
  ).toFixed(1);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="grid-2">
        <div className="card">
          <div className="card-header">Total Operators</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#3498db" }}>
            {totalOperators}
          </div>
          <div style={{ color: "#666", marginTop: "5px" }}>
            {activeOperators} active
          </div>
        </div>
        <div className="card">
          <div className="card-header">Total Standards</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#2ecc71" }}>
            {totalStandards}
          </div>
        </div>
        <div className="card">
          <div className="card-header">Avg. Competences per Operator</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#e74c3c" }}>
            {avgCompetences}
          </div>
        </div>
        <div className="card">
          <div className="card-header">System Status</div>
          <div style={{ fontSize: "18px", color: "#27ae60", fontWeight: "600" }}>
            ✓ Operational
          </div>
          <div style={{ color: "#666", marginTop: "5px" }}>All systems normal</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Recent Operators</div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Team</th>
              <th>Status</th>
              <th>Competences</th>
            </tr>
          </thead>
          <tbody>
            {operators.slice(0, 5).map((op) => (
              <tr key={op._id}>
                <td>{op.name}</td>
                <td>{op.team}</td>
                <td>
                  <span
                    className={`badge ${op.status === "active" ? "active" : "inactive"}`}
                  >
                    {op.status}
                  </span>
                </td>
                <td>{op.competences.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
