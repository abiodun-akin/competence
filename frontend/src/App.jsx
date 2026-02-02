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

  const fetchData = async () => {
    try {
      const [opsRes, stdRes] = await Promise.all([
        fetch("http://localhost:3000/api/operators"),
        fetch("http://localhost:3000/api/standards"),
      ]);

      if (!opsRes.ok || !stdRes.ok) throw new Error("Failed to fetch data");

      const opsData = await opsRes.json();
      const stdData = await stdRes.json();

      setOperators(opsData);
      setStandards(stdData);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
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
  };

  const renderPage = () => {
    if (loading && currentPage !== "setup")
      return (
        <div className="loading">
          <div className="spinner"></div>Loading...
        </div>
      );
    if (error) return <div className="error-message">⚠ Error: {error}</div>;

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
