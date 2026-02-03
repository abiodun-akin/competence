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
      <div className="navbar-brand modern-navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* Scania Logo Integration */}
        <img 
          src="https://www.scania.com/etc.clientlibs/scania-clientlibs/clientlibs/clientlib-site/resources/logotype/1.0.0/scania_symbol/scania-symbol.svg" 
          alt="Scania Logo" 
          style={{ height: '40px', width: 'auto' }} 
        />
        <div>
          <h1 className="brand-title">Scania Logistics</h1>
          <p className="brand-subtitle">
            Competence & Rotation Management
          </p>
        </div>
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '15px' }}>
          <span className="user-info" style={{ fontWeight: 'bold' }}>{currentUser?.username}</span>
          <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'capitalize' }}>{currentUser?.role || 'Staff'}</span>
        </div>
        <button onClick={onLogout} className="btn-logout modern-btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}