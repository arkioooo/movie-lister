// src/pages/Home.jsx
import React from 'react';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading authentication...</div>;

  return (
    <div>
      <h1>Welcome to the TMDB React App</h1>
      {user ? (
        <div>
          <p>Signed in as <strong>{user.email || user.displayName}</strong></p>
          <p><Link to="/profile">Go to your profile</Link></p>
        </div>
      ) : (
        <div>
          <p>You are browsing as a guest.</p>
          <p><Link to="/login">Login</Link> or <Link to="/signup">Sign up</Link> to save favourites & lists.</p>
        </div>
      )}
    </div>
  );
}
