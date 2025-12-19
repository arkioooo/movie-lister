import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getUserLists, deleteList } from '../api/firestore';
import Modal from '../components/common/Modal';
import CreateListModal from '../components/lists/CreateListModal';

export default function Lists() {
  const { user, loading } = useAuth();
  const [lists, setLists] = useState([]);
  const [busy, setBusy] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function load() {
      setBusy(true);
      const data = await getUserLists(user.uid);
      setLists(data);
      setBusy(false);
    }

    load();
  }, [user]);

  if (loading) return <div className="container">Loading…</div>;
  if (!user) return <div className="container">Please log in.</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Lists</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          Create list
        </button>
      </div>
      <Modal open={showCreate} onClose={() => setShowCreate(false)}>
        <CreateListModal
          onCreated={(list) =>
            setLists((prev) => [...prev, list])
          }
          onClose={() => setShowCreate(false)}
        />
      </Modal>

      {busy && <p>Loading lists…</p>}

      {!busy && lists.length === 0 && (
        <p>You haven’t created any lists yet.</p>
      )}

      <div className="lists-grid">
        {lists.map((list) => (
          <div key={list.id} className="list-card">
            <Link to={`/lists/${list.id}`}>
              <h3>{list.name}</h3>
            </Link>

            <button
              className="btn btn-secondary btn-small"
              onClick={async () => {
                await deleteList(user.uid, list.id);
                setLists((l) => l.filter((x) => x.id !== list.id));
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
