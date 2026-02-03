import React, { useState, useEffect } from "react";

// Use the environment variable for the API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function OperatorsPage({ operators, standards, onDataChange }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    team: "",
    competences: [],
  });
  const [teamOptions, setTeamOptions] = useState([]);
  const [competencyOptions, setCompetencyOptions] = useState([]);

  useEffect(() => {
    fetchSetupOptions();
  }, []);

  const fetchSetupOptions = async () => {
    try {
      // Replaced localhost with API_BASE_URL
      const [teamsRes, compsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/setup/teams`),
        fetch(`${API_BASE_URL}/api/setup/competencies`),
      ]);
      const teams = await teamsRes.json();
      const comps = await compsRes.json();
      setTeamOptions(teams);
      setCompetencyOptions(comps);
    } catch (err) {
      // fallback: do nothing
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ name: "", team: "", competences: [] });
    setShowForm(true);
  };

  const handleEditClick = (operator) => {
    setEditingId(operator._id);
    setFormData({
      name: operator.name,
      team: operator.team,
      competences: operator.competences || [],
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    // Replaced localhost with API_BASE_URL
    const url = editingId
      ? `${API_BASE_URL}/api/operators/${editingId}`
      : `${API_BASE_URL}/api/operators`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowForm(false);
        onDataChange();
      }
    } catch (err) {
      alert("Error saving operator: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this operator?")) return;
    try {
      // Replaced localhost with API_BASE_URL
      const response = await fetch(
        `${API_BASE_URL}/api/operators/${id}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        onDataChange();
      }
    } catch (err) {
      alert("Error deleting operator: " + err.message);
    }
  };

  return (
    <div className="operators-page">
      <h1>Operators Management</h1>
      <button onClick={handleAddClick}>+ Add Operator</button>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              {editingId ? "Edit Operator" : "Add Operator"}
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  style={{ width: "100%", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Team:</label>
                <select
                  value={formData.team}
                  onChange={(e) =>
                    setFormData({ ...formData, team: e.target.value })
                  }
                  required
                  style={{ width: "100%", marginTop: "5px" }}
                >
                  <option value="">Select team...</option>
                  {teamOptions.map((team) => (
                    <option key={team.id} value={team.name}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Competences:</label>
                <select
                  multiple
                  value={formData.competences.map((c) => c.standard)}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map(
                      (opt) => opt.value,
                    );
                    setFormData({
                      ...formData,
                      competences: selected.map((std) => ({ standard: std })),
                    });
                  }}
                  style={{ width: "100%", marginTop: "5px", height: "80px" }}
                >
                  {competencyOptions.map((comp) => (
                    <option key={comp.id} value={comp.name}>
                      {comp.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Team</th>
              <th>Competences</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {operators.map((op) => (
              <tr key={op._id