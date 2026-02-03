import React, { useState } from "react";

// Use the environment variable for the URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }
      const data = await res.json();
      localStorage.setItem("authToken", data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container modern-login">
        <div className="login-header modern-login-header">
          {/* Scania Branding Added */}
          <img 
            src="https://www.scania.com/etc.clientlibs/scania-clientlibs/clientlibs/clientlib-site/resources/logotype/1.0.0/scania_symbol/scania-symbol.svg" 
            alt="Scania Logo" 
            style={{ height: '60px', marginBottom: '20px' }} 
          />
          <h1 style={{ color: '#041e42' }}>Scania Logistics</h1>
          <p>Competence & Rotation Planning Tool</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form modern-login-form">
          <div className="form-group modern-form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="form-group modern-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
            />
          </div>
          
          {error && <div className="error-message" style={{ color: '#d32f2f' }}>{error}</div>}
          
          <button 
            type="submit" 
            className="btn-login" 
            disabled={loading}
            style={{ backgroundColor: '#041e42', color: 'white' }}
          >
            {loading ? "Verifying..." : "Login"}
          </button>

          <div className="demo-credentials" style={{ borderTop: '1px solid #eee', marginTop: '20px', paddingTop: '10px' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#666' }}>System Access:</h3>
            <p style={{ fontSize: '0.8rem' }}>
              Admin: <code>admin / admin123</code>
            </p>
            <p style={{ fontSize: '0.8rem' }}>
              Manager: <code>manager / manager123</code>
            </p>
            <p style={{ fontSize: '0.8rem' }}>
              Operator: <code>operator / operator123</code>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}