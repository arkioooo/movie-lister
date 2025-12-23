// src/pages/Lists.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getUserLists, deleteList, getListPreviewItems } from '../api/firestore';
import Modal from '../components/common/Modal';
import CreateListModal from '../components/lists/CreateListModal';

export default function Lists() {
  const { user, loading } = useAuth();
  const [lists, setLists] = useState([]);
  const [previews, setPreviews] = useState({});
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const data = await getUserLists(user.uid);

      const sorted = data
        .filter(l => l.createdAt)
        .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

      setLists(sorted);
      const previewMap = {};

      await Promise.all(
        sorted.map(async (list) => {
          const items = await getListPreviewItems(user.uid, list.id, 2);
          previewMap[list.id] = items;
        })
      );

      setPreviews(previewMap);
    }

    load();
  }, [user]);


  if (loading) return <div className="container">Loading…</div>;
  if (!user) return <div className="container">Please log in.</div>;

  const recentLists = lists.slice(0, 2);

  return (
    <div className="container">
      {/* ===== Page Header ===== */}
      <div className="page-header">
        <h1>My Lists</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreate(true)}
        >
          Create list
        </button>
      </div>

      {/* ===== Create List Modal ===== */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)}>
        <CreateListModal
          onCreated={(list) =>
            setLists((prev) =>
              [list, ...prev].sort(
                (a, b) => b.createdAt.seconds - a.createdAt.seconds
              )
            )
          }
          onClose={() => setShowCreate(false)}
        />
      </Modal>
      {lists.length === 0 && (
        <p className="muted">You haven’t created any lists yet.</p>
      )}

      <div className="lists-grid">
        {lists.map((list) => {
          const items = previews[list.id] || [];

          return (
            <div key={list.id} className="list-card">
              <Link to={`/lists/${list.id}`} className="list-card-main">
                <h3>{list.name}</h3>

                {items.length > 0 ? (
                  <ul className="list-preview-items">
                    {items.map((item, idx) => (
                      <li key={idx}>
                        {item.title || 'Untitled'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">No items yet</p>
                )}
              </Link>

              <button
                className="btn btn-secondary btn-small"
                onClick={async () => {
                  await deleteList(user.uid, list.id);
                  setLists(prev => prev.filter(x => x.id !== list.id));
                }}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}