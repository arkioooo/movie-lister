import React from 'react';
import useAuth from '../hooks/useAuth';

export default function Lists() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container">
        <h1>Lists</h1>
        <p>Please sign in to manage your lists.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Lists</h1>
        <button className="btn btn-primary" disabled>
          Create list
        </button>
      </div>

      {/* Placeholder */}
      <div className="empty-state">
        <p>You haven’t created any lists yet.</p>
        <p>Create lists to organize movies and shows.</p>
      </div>
    </div>
  );
}
