import React, { useState, useEffect } from "react";

export default function RotationPage({ operators }) {
  const [rotations, setRotations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fromOperatorId: "",
    toOperatorId: "",
    standard: "",
    reason: "",
    scheduledDate: "",
  });

  useEffect(() => {
    fetchRotations();
  }, []);

  const fetchRotations = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/rotation");
      const data = await response.json();
      setRotations(data);
    } catch (err) {
      alert("Error fetching rotations: " + err.message);
    }
    setLoading(false);
  };

  const handleGenerateSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/rotation/auto/generate",
        { method: "POST" }
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      alert("Error generating suggestions: " + err.message);
    }
    setLoading(false);
  };

  const handleAcceptSuggestion = (suggestion) => {
    setFormData({
      fromOperatorId: suggestion.fromOperatorId,
      toOperatorId: suggestion.toOperatorId,
      standard: suggestion.standard,
      reason: suggestion.reason,
      scheduledDate: "",
    });
    setSuggestions([]);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/rotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowForm(false);
        setFormData({
          fromOperatorId: "",
          toOperatorId: "",
          standard: "",
          reason: "",
          scheduledDate: "",
        });
        fetchRotations();
      }
    } catch (err) {
      alert("Error saving rotation: " + err.message);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/rotation/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      if (response.ok) {
        fetchRotations();
      }
    } catch (err) {
      alert("Error approving rotation: " + err.message);
    }
  };

  const getOperatorName = (id) =>
    operators.find((op) => op._id === id)?.name || "Unknown";

  if (loading && rotations.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="rotation-page">
      <h1>Operator Rotation</h1>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={handleGenerateSuggestions}>
          🔄 Generate Auto-Suggestions
        </button>
        <button className="secondary" onClick={() => setShowForm(true)}>
          + Manual Rotation
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">Create Rotation</div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label>From Operator:</label>
                <select
                  value={formData.fromOperatorId}
                  onChange={(e) =>
                    setFormData({ ...formData, fromOperatorId: e.target.value })
                  }
                  required
                  style={{ width: "100%", marginTop: "5px" }}
                >
                  <option value="">Select operator...</option>
                  {operators.map((op) => (
                    <option key={op._id} value={op._id}>
                      {op.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>To Operator:</label>
                <select
                  value={formData.toOperatorId}
                  onChange={(e) =>
                    setFormData({ ...formData, toOperatorId: e.target.value })
                  }
                  required
                  style={{ width: "100%", marginTop: "5px" }}
                >
                  <option value="">Select operator...</option>
                  {operators.map((op) => (
                    <option key={op._id} value={op._id}>
                      {op.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Standard:</label>
                <input
                  type="text"
                  value={formData.standard}
                  onChange={(e) =>
                    setFormData({ ...formData, standard: e.target.value })
                  }
                  required
                  style={{ width: "100%", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Reason:</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  style={{ width: "100%", marginTop: "5px", height: "80px" }}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="card">
          <div className="card-header">Auto-Generated Suggestions</div>
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Standard</th>
                <th>Reason</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((sug, idx) => (
                <tr key={idx}>
                  <td>{sug.fromName}</td>
                  <td>{sug.toName}</td>
                  <td>{sug.standard}</td>
                  <td>{sug.reason}</td>
                  <td>{sug.priority}</td>
                  <td>
                    <button onClick={() => handleAcceptSuggestion(sug)}>
                      Accept
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card">
        <div className="card-header">Rotation History</div>
        <table>
          <thead>
            <tr>
              <th>From Operator</th>
              <th>To Operator</th>
              <th>Standard</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rotations.map((rot) => (
              <tr key={rot._id}>
                <td>{getOperatorName(rot.fromOperatorId)}</td>
                <td>{getOperatorName(rot.toOperatorId)}</td>
                <td>{rot.standard}</td>
                <td>{rot.scheduledDate || "Pending"}</td>
                <td>
                  <span
                    className={`badge ${
                      rot.status === "approved"
                        ? "active"
                        : rot.status === "pending"
                          ? "basic"
                          : "inactive"
                    }`}
                  >
                    {rot.status}
                  </span>
                </td>
                <td>
                  {rot.status === "pending" && (
                    <button
                      className="secondary"
                      onClick={() => handleApprove(rot._id)}
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
