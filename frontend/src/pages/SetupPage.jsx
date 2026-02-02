import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function SetupPage() {
  const [tab, setTab] = useState("standards");
  const [competencies, setCompetencies] = useState([]);
  const [teams, setTeams] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [standards, setStandards] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [tab]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [compRes, teamRes, qualRes, stdRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/setup/competencies`),
        fetch(`${API_BASE_URL}/api/setup/teams`),
        fetch(`${API_BASE_URL}/api/setup/qualifications`),
        fetch(`${API_BASE_URL}/api/standards`),
      ]);
      const compData = await compRes.json();
      const teamData = await teamRes.json();
      const qualData = await qualRes.json();
      const stdData = await stdRes.json();
      setCompetencies(compData);
      setTeams(teamData);
      setQualifications(qualData);
      setStandards(stdData);
    } catch (err) {
      alert("Error fetching setup data: " + err.message);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newItem.trim()) return;

    let endpoint = "";
    if (tab === "competencies")
      endpoint = `${API_BASE_URL}/api/setup/competencies`;
    else if (tab === "teams")
      endpoint = `${API_BASE_URL}/api/setup/teams`;
    else if (tab === "standards")
      endpoint = `${API_BASE_URL}/api/standards`;
    else endpoint = `${API_BASE_URL}/api/setup/qualifications`;

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
    let endpoint = "";
    if (tab === "competencies")
      endpoint = `${API_BASE_URL}/api/setup/competencies/${id}`;
    else if (tab === "teams")
      endpoint = `${API_BASE_URL}/api/setup/teams/${id}`;
    else if (tab === "standards")
      endpoint = `${API_BASE_URL}/api/standards/${id}`;
    else endpoint = `${API_BASE_URL}/api/setup/qualifications/${id}`;

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
    tab === "competencies"
      ? competencies
      : tab === "teams"
        ? teams
        : tab === "standards"
          ? standards
          : qualifications;

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
        {["competencies", "teams", "standards", "qualifications"].map(
          (tabName) => (
            <button
              key={tabName}
              onClick={() => setTab(tabName)}
              style={{
                backgroundColor: tab === tabName ? "#3498db" : "#95a5a6",
                borderRadius: "0",
              }}
            >
              {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
            </button>
          ),
        )}
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
                : tab === "standards"
                  ? "Standards Management"
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
                <tr key={item._id || item.id}>
                  <td>{item.name}</td>
                  <td>
                    <button
                      className="danger"
                      onClick={() => handleDelete(item._id || item.id)}
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
