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

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
        mode: 'cors',                    // Explicitly set CORS mode
        credentials: 'same-origin',      // Safe default
      });

      if (!res.ok) {
        let errorMessage = `${res.status} ${res.statusText}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // Could not parse JSON → fallback to status text
        }
        throw new Error(`Fetch failed for ${url.split('/').pop()}: ${errorMessage}`);
      }

      return await res.json();
    } catch (err) {
      console.error(`Detailed fetch error for ${url}:`, err);
      throw err; // Re-throw so Promise.all can catch it
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
      setError(null);
    } catch (err) {
      const errorMsg = err.message || "Unknown error during data fetch";
      console.error("Data loading failed:", err);
      setError(errorMsg);
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
    setError(null); // Clear any previous errors on logout
  };

  const renderPage = () => {
    if (loading && currentPage !== "setup") {
      return (
        <div className="loading">
          <div className="spinner"></div>
          Loading data...
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-message" style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
          <strong>⚠ Connection / Data Error</strong>
          <br />
          {error}
          <br /><br />
          <small>(Check browser console (F12 → Console) for more details)</small>
          <br />
          <button 
            onClick={() => { setError(null); fetchData(); }} 
            style={{ marginTop: '10px', padding: '8px 16px' }}
          >
            Try Again
          </button>
        </div>
      );
    }

    switch (currentPage) {
      case "dashboard":
        return <Dashboard operators={operators} standards={standards} />;
      case "operators":
        return (
          <OperatorsPage
            operators={operators}
            standards={standards}
            onDataChange={fetchData}
          />
        );
      case "planning":
        return <PlanningPage operators={operators} standards={standards} />;
      case "analytics":
        return <AnalyticsPage operators={operators} standards={standards} />;
      case "rotation":
        return <RotationPage operators={operators} />;
      case "setup":
        return <SetupPage />;
      default:
        return <Dashboard operators={operators} standards={standards} />;
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