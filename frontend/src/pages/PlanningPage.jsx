import React, { useState, useEffect } from "react";

// Use the environment variable for the API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function PlanningPage({ operators, standards }) {
  const [week, setWeek] = useState(1);
  const [year, setYear] = useState(2026);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teamOptions, setTeamOptions] = useState([]);
  const [standardOptions, setStandardOptions] = useState([]);

  useEffect(() => {
    fetchSetupOptions();
  }, []);

  const fetchSetupOptions = async () => {
    try {
      // Replaced localhost with API_BASE_URL
      const [teamsRes, standardsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/setup/teams`),
        fetch(`${API_BASE_URL}/api/setup/standards`),
      ]);
      setTeamOptions(await teamsRes.json());
      setStandardOptions(await standardsRes.json());
    } catch (err) {}
  };

  useEffect(() => {
    fetchWeekAssignments();
  }, [week, year]);

  const fetchWeekAssignments = async () => {
    setLoading(true);
    try {
      // Replaced localhost with API_BASE_URL
      const response = await fetch(
        `${API_BASE_URL}/api/planning/weeks/${week}/${year}`,
      );
      const data = await response.json();
      setAssignments(data.assignments || []);
    } catch (err) {
      alert("Error fetching assignments: " + err.message);
    }
    setLoading(false);
  };

  const handleAddAssignment = () => {
    const newAssignment = {
      operatorId: operators[0]?._id,
      standard: standardOptions[0]?.name || "",
      days: 1,
      rotationScore: 0,
    };
    setAssignments([...assignments, newAssignment]);
  };

  const handleUpdateAssignment = (idx, field, value) => {
    const updated = [...assignments];
    updated[idx][field] = value;
    setAssignments(updated);
  };

  const handleRemoveAssignment = (idx) => {
    setAssignments(assignments.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Replaced localhost with API_BASE_URL
      const response = await fetch(
        `${API_BASE_URL}/api/planning/weeks/${week}/${year}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignments }),
        },
      );
      if (response.ok) {
        alert("Assignments saved successfully");
      }
    } catch (err) {
      alert("Error saving assignments: " + err.message);
    }
    setLoading(false);
  };

  const getOperatorName = (id) =>
    operators.find((op) => op._id === id)?.name || "Unknown";
  const getStandardName = (id) =>
    standardOptions.find((std) => std.id === id)?.name || "Unknown";

  return (
    <div className="planning-page">
      <h1>Weekly Planning</h1>

      <div
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr auto",
          gap: "10px",
          alignItems: "end",
        }}
      >
        <div>
          <label>Week:</label>
          <input
            type="number"
            min="1"
            max="52"
            value={week}
            onChange={(e) => setWeek(parseInt(e.target.value))}
            style={{ width: "100%", marginTop: "5px" }}
          />
        </div>
        <div>
          <label>Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            style={{ width: "100%", marginTop: "5px" }}
          />
        </div>
        <div></div>
        <button onClick={fetchWeekAssignments}>Refresh</button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="card">
            <h2 style={{ marginBottom: "15px" }}>
              Assignments for Week {week}, {year}
            </h2>
            <table>
              <thead>
                <tr>
                  <th>Operator</th>
                  <th>Standard</th>
                  <th>Days</th>
                  <th>Rotation Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assign, idx) => (
                  <tr key={idx}>
                    <td>
                      <select
                        value={assign.operatorId}
                        onChange={(e) =>
                          handleUpdateAssignment(
                            idx,
                            "operatorId",
                            e.target.value,
                          )
                        }
                      >
                        {operators.map((op) => (
                          <option key={op._id} value={op._id}>
                            {op.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={assign.standard}
                        onChange={(e) =>
                          handleUpdateAssignment(
                            idx,
                            "standard",
                            e.target.value,
                          )
                        }
                      >
                        <option value="">Select standard...</option>
                        {standardOptions.map((std) => (
                          <option key={std.id} value={std.name}>
                            {std.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={assign.days}
                        onChange={(e) =>
                          handleUpdateAssignment(
                            idx,
                            "days",
                            parseInt(e.target.value),
                          )
                        }
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.1"
                        value={assign.rotationScore}
                        onChange={(e) =>
                          handleUpdateAssignment(
                            idx,
                            "rotationScore",
                            parseFloat(e.target.value),
                          )
                        }
                        style={{ width: "80px" }}
                      />
                    </td>
                    <td>
                      <button
                        className="danger"
                        onClick={() => handleRemoveAssignment(idx)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: "15px" }}>
              <button
                onClick={handleAddAssignment}
                style={{ marginRight: "10px" }}
              >
                + Add Assignment
              </button>
              <button onClick={handleSave}>Save Assignments</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}