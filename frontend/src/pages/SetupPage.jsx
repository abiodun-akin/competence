import React, { useState, useEffect } from "react";

export default function SetupPage() {
  const [tab, setTab] = useState("competencies");
  const [competencies, setCompetencies] = useState([]);
  const [teams, setTeams] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [tab]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [compRes, teamRes, qualRes] = await Promise.all([
        fetch("http://localhost:3000/api/setup/competencies"),
        fetch("http://localhost:3000/api/setup/teams"),
        fetch("http://localhost:3000/api/setup/qualifications"),
      ]);
      const compData = await compRes.json();
      const teamData = await teamRes.json();
      const qualData = await qualRes.json();
      setCompetencies(compData);
      setTeams(teamData);
      setQualifications(qualData);
    } catch (err) {
      alert("Error fetching setup data: " + err.message);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newItem.trim()) return;

    const endpoint =
      tab === "competencies"
        ? "http://localhost:3000/api/setup/competencies"
        : tab === "teams"
          ? "http://localhost:3000/api/setup/teams"
          : "http://localhost:3000/api/setup/qualifications";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newItem }),
      });
      if (response.ok) {
        setNewItem("");
        fetchAllData();
      }
    } catch (err) {
      alert("Error adding item: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    const endpoint =
      tab === "competencies"
        ? `http://localhost:3000/api/setup/competencies/${id}`
        : tab === "teams"
          ? `http://localhost:3000/api/setup/teams/${id}`
          : `http://localhost:3000/api/setup/qualifications/${id}`;

    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      if (response.ok) {
        fetchAllData();
      }
    } catch (err) {
      alert("Error deleting item: " + err.message);
    }
  };

  const currentData =
    tab === "competencies" ? competencies : tab === "teams" ? teams : qualifications;

  return (
    <div className="setup-page">
      <h1>System Setup</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          borderBottom: "2px solid #eee",
        }}
      >
        <button
          onClick={() => setTab("competencies")}
          style={{
            backgroundColor: tab === "competencies" ? "#3498db" : "#95a5a6",
            borderRadius: "0",
          }}
        >
          Competencies
        </button>
        <button
          onClick={() => setTab("teams")}
          style={{
            backgroundColor: tab === "teams" ? "#3498db" : "#95a5a6",
            borderRadius: "0",
          }}
        >
          Teams
        </button>
        <button
          onClick={() => setTab("qualifications")}
          style={{
            backgroundColor: tab === "qualifications" ? "#3498db" : "#95a5a6",
            borderRadius: "0",
          }}
        >
          Qualifications
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="card">
          <div className="card-header">
            {tab === "competencies"
              ? "Competencies Management"
              : tab === "teams"
                ? "Teams Management"
                : "Qualifications Management"}
          </div>

          <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder={`Add new ${tab}...`}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
              style={{ flex: 1 }}
            />
            <button onClick={handleAdd}>Add</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <button
                      className="danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
