// src/components/common/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (e) {
      console.error('Logout error', e);
    }
  }

  return (
    <header className="app-navbar" role="banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="brand"><Link to="/" style={{ color: 'inherit' }}>TMDB App</Link></div>
        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/discover">Discover</Link>
          <Link to="/search">Search</Link>
          {user && <Link to="/favourites">Favourites</Link>}
        </nav>
      </div>

      <div className="nav-actions" role="region" aria-label="User actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-pressed={theme === 'dark'}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className="knob" aria-hidden="true" />
            <span style={{ opacity: 0.95, fontSize: 13 }}>{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>

          {user ? (
            <>
              <Link to="/profile" style={{ color: 'inherit' }}>{user.displayName || user.email}</Link>
              <button onClick={handleLogout} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
