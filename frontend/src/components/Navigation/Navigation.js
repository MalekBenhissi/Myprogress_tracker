import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/dashboard" className="brand-link">
          <span className="brand-icon">🎯</span>
          MyProgress
        </Link>
      </div>

      <div className="nav-user">
        <span className="username">Bonjour, {user.username}</span>
        <button onClick={handleLogout} className="logout-btn">
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navigation;