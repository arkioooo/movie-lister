import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { createList } from '../../api/firestore';

export default function CreateListModal({ onCreated, onClose }) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('List name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const listId = await createList(user.uid, {
        name: name.trim(),
        description: desc.trim(),
      });
      onCreated({ id: listId, name: name.trim(), description: desc });
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to create list');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create new list</h3>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="field-group">
        <label className="field-label">List name</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          autoFocus
        />
      </div>

      <div className="field-group">
        <label className="field-label">Description (optional)</label>
        <input
          className="input"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          maxLength={120}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating…' : 'Create'}
        </button>
      </div>
    </form>
  );
}
