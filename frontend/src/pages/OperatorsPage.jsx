import React, { useState, useEffect } from "react";

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
      const [teamsRes, compsRes] = await Promise.all([
        fetch("http://localhost:3000/api/setup/teams"),
        fetch("http://localhost:3000/api/setup/competencies"),
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
    const url = editingId
      ? `http://localhost:3000/api/operators/${editingId}`
      : "http://localhost:3000/api/operators";

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
      const response = await fetch(
        `http://localhost:3000/api/operators/${id}`,
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
              <tr key={op._id}>
                <td>{op.name}</td>
                <td>{op.team}</td>
                <td>
                  {op.competences.map((c) => (
                    <span key={c.standard} className="badge expert">
                      {c.standard}
                    </span>
                  ))}
                </td>
                <td>
                  <span
                    className={`badge ${op.status === "active" ? "active" : "inactive"}`}
                  >
                    {op.status}
                  </span>
                </td>
                <td>
                  <button
                    className="secondary"
                    onClick={() => handleEditClick(op)}
                    style={{ marginRight: "5px" }}
                  >
                    Edit
                  </button>
                  <button
                    className="danger"
                    onClick={() => handleDelete(op._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
