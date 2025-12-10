// src/components/common/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="nav-shell" aria-label="Main navigation">
      <div className="nav-brand">
        <Link to="/">TMDB App</Link>
      </div>
      <div className="nav-links">
        <Link to="/search">Search</Link>
        {user && <Link to="/favourites">Favourites</Link>}
      </div>
    </nav>
  );
}
