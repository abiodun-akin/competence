import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AnalyticsPage({ operators, standards }) {
  const [rotationData, setRotationData] = useState([]);
  const [standardsData, setStandardsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [rotRes, stdRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/analytics/rotation`),
        fetch(`${API_BASE_URL}/api/analytics/standards`),
      ]);
      const rotData = await rotRes.json();
      const stdData = await stdRes.json();
      setRotationData(rotData);
      setStandardsData(stdData);
    } catch (err) {
      alert("Error fetching analytics: " + err.message);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics-page">
      <h1>Analytics & Insights</h1>

      <div className="card">
        <div className="card-header">Operator Utilization</div>
        <table>
          <thead>
            <tr>
              <th>Operator</th>
              <th>Total Assignments</th>
              <th>Utilization Rate (%)</th>
              <th>Competences</th>
            </tr>
          </thead>
          <tbody>
            {rotationData.map((item) => (
              <tr key={item.operatorId}>
                <td>{item.name}</td>
                <td>{item.totalAssignments}</td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "100px",
                        height: "8px",
                        backgroundColor: "#eee",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(item.utilizationRate, 100)}%`,
                          height: "100%",
                          backgroundColor:
                            item.utilizationRate > 80
                              ? "#e74c3c"
                              : item.utilizationRate > 50
                                ? "#f39c12"
                                : "#27ae60",
                        }}
                      ></div>
                    </div>
                    <span>{item.utilizationRate.toFixed(0)}%</span>
                  </div>
                </td>
                <td>{item.competenceCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-header">Standard Utilization</div>
        <table>
          <thead>
            <tr>
              <th>Standard</th>
              <th>Total Days Used</th>
              <th>Operators with Skill</th>
              <th>Criticality</th>
            </tr>
          </thead>
          <tbody>
            {standardsData.map((item) => (
              <tr key={item.standard}>
                <td>{item.standard}</td>
                <td>{item.totalDays}</td>
                <td>{item.operatorCount}</td>
                <td>
                  <span
                    className={`badge ${
                      item.criticality === "high"
                        ? "danger"
                        : item.criticality === "medium"
                          ? "secondary"
                          : "info"
                    }`}
                    style={{
                      backgroundColor:
                        item.criticality === "high"
                          ? "#ffe0e0"
                          : item.criticality === "medium"
                            ? "#fff3cd"
                            : "#d1ecf1",
                      color:
                        item.criticality === "high"
                          ? "#721c24"
                          : item.criticality === "medium"
                            ? "#664d03"
                            : "#0c5460",
                    }}
                  >
                    {item.criticality}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={fetchAnalytics}>Refresh Analytics</button>
    </div>
  );
}
