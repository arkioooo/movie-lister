import React from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function ListDetails() {
  const { listId } = useParams();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container">
        <p>Please sign in to view this list.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>List</h1>
      <p>List ID: {listId}</p>

      {/* Placeholder */}
      <div className="empty-state">
        <p>This list is currently empty.</p>
      </div>
    </div>
  );
}
