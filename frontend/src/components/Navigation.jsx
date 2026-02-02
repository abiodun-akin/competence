import React from "react";

export default function Navigation({
  currentPage,
  setCurrentPage,
  currentUser,
  onLogout,
}) {
  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "operators", label: "Operators" },
    { id: "planning", label: "Planning" },
    { id: "rotation", label: "Rotation" },
    { id: "analytics", label: "Analytics" },
    { id: "setup", label: "Setup" },
  ];

  return (
    <nav className="navbar modern-navbar">
      <div className="navbar-brand modern-navbar-brand">
        <h1 className="brand-title">Competence Planning Tool</h1>
        <p className="brand-subtitle">
          Workforce Allocation & Rotation Management
        </p>
      </div>
      <ul className="nav-menu modern-nav-menu">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              className={`nav-link modern-nav-link ${currentPage === item.id ? "active" : ""}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <span className="label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="navbar-user modern-navbar-user">
        <span className="user-info">{currentUser?.username}</span>
        <button onClick={onLogout} className="btn-logout modern-btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}
