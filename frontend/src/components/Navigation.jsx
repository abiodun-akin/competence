import React from "react";

export default function Navigation({
  currentPage,
  setCurrentPage,
  currentUser,
  onLogout,
}) {
  const navItems = [
    { id: "dashboard", label: "📊 Dashboard", icon: "📊" },
    { id: "operators", label: "👥 Operators", icon: "👥" },
    { id: "planning", label: "📅 Planning", icon: "📅" },
    { id: "rotation", label: "🔄 Rotation", icon: "🔄" },
    { id: "analytics", label: "📈 Analytics", icon: "📈" },
    { id: "setup", label: "⚙️ Setup", icon: "⚙️" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1 className="brand-title">🔧 Competence Planning Tool</h1>
        <p className="brand-subtitle">
          Workforce Allocation & Rotation Management
        </p>
      </div>
      <ul className="nav-menu">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              className={`nav-link ${currentPage === item.id ? "active" : ""}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="navbar-user">
        <span className="user-info">👤 {currentUser?.username}</span>
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}
