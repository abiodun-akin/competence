import React, { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import OperatorsPage from "./pages/OperatorsPage";
import PlanningPage from "./pages/PlanningPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SetupPage from "./pages/SetupPage";
import RotationPage from "./pages/RotationPage";

// Hardcoded production URL
const API_BASE_URL = "https://competence-backend.onrender.com";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [operators, setOperators] = useState([]);
  const [standards, setStandards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("currentUser");
    if (token && user) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(user));
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchWithErrorHandling = async (url) => {
    try {
      const res = await fetch(url, {
        method: 'GET',
        // 'cors' is required for cross-domain Render setups
        mode: 'cors', 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch { /* ignore parse errors */ }
        throw new Error(errorMessage);
      }

      return await res.json();
    } catch (err) {
      // Catch "Failed to fetch" which usually means server is down or CORS failed
      if (err.message === "Failed to fetch") {
        throw new Error("Cannot connect to server. It may be starting up—please wait for 30 seconds and try again.");
      }
      throw err;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [opsData, stdData] = await Promise.all([
        fetchWithErrorHandling(`${API_BASE_URL}/api/operators`),
        fetchWithErrorHandling(`${API_BASE_URL}/api/standards`),
      ]);

      setOperators(opsData);
      setStandards(stdData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    fetchData();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setError(null);
  };

  const renderPage = () => {
    if (loading && currentPage !== "setup") {
      return (
        <div className="loading" style={{ textAlign: 'center', padding: '50px' }}>
          <div className="spinner"></div>
          <p>Connecting to backend... (May take 30s on first load)</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-message" style={{ color: '#d9534f', padding: '40px', textAlign: 'center' }}>
          <h3>⚠ Connection Error</h3>
          <p>{error}</p>
          <button onClick={fetchData} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Retry Connection
          </button>
        </div>
      );
    }

    switch (currentPage) {
      case "dashboard": return <Dashboard operators={operators} standards={standards} />;
      case "operators": return <OperatorsPage operators={operators} standards={standards} onDataChange={fetchData} />;
      case "planning": return <PlanningPage operators={operators} standards={standards} />;
      case "analytics": return <AnalyticsPage operators={operators} standards={standards} />;
      case "rotation": return <RotationPage operators={operators} />;
      case "setup": return <SetupPage />;
      default: return <Dashboard operators={operators} standards={standards} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}