import React from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';
import './Navbar.css';

export default function Navbar({ onSearch }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-logo">
        MigrantConnect
      </div>
      
      {/* Center: Search */}
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search services, documents..."
          onChange={e => onSearch && onSearch(e.target.value)}
        />
      </div>
      
      {/* Right: Actions */}
      <div className="navbar-actions">
        <button className="navbar-icon-btn" title="Settings">
          <span className="material-icons">settings</span>
        </button>
        <button className="navbar-icon-btn" title="Profile">
          <span className="material-icons">account_circle</span>
        </button>
        <button className="navbar-icon-btn" title="Logout" onClick={handleLogout}>
          <span className="material-icons">logout</span>
        </button>
      </div>
    </nav>
  );
} 