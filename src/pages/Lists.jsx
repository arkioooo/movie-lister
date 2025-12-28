import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
  getUserLists,
  deleteList,
  getListPreviewItems,
} from '../api/firestore';

import Modal from '../components/common/Modal';
import ConfirmModal from '../components/common/ConfirmModal';
import Toast from '../components/common/Toast';
import Skeleton from '../components/common/Skeleton';
import Spinner from '../components/common/Spinner';
import CreateListModal from '../components/lists/CreateListModal';

export default function Lists() {
  const { user, loading } = useAuth();

  const [lists, setLists] = useState([]);
  const [previews, setPreviews] = useState({});
  const [loadingLists, setLoadingLists] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user) return;

    async function load() {
      setLoadingLists(true);

      const data = await getUserLists(user.uid);
      const sorted = data
        .filter(l => l.createdAt)
        .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

      setLists(sorted);

      const previewMap = {};
      await Promise.all(
        sorted.map(async (list) => {
          previewMap[list.id] = await getListPreviewItems(
            user.uid,
            list.id,
            2
          );
        })
      );

      setPreviews(previewMap);
      setLoadingLists(false);
    }

    load();
  }, [user]);

  if (loading) return <div className="container">Loading…</div>;
  if (!user) return <div className="container">Please log in.</div>;

  return (
    <div className="container">
      {/* ===== Header ===== */}
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
            setLists(prev =>
              [list, ...prev].sort(
                (a, b) => b.createdAt.seconds - a.createdAt.seconds
              )
            )
          }
          onClose={() => setShowCreate(false)}
        />
      </Modal>

      {/* ===== Skeletons ===== */}
      {loadingLists && (
        <div className="lists-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="list-card">
              <Skeleton width="60%" height={18} />
              <Skeleton width="80%" height={14} />
              <Skeleton width="70%" height={14} />
            </div>
          ))}
        </div>
      )}

      {/* ===== Empty State ===== */}
      {!loadingLists && lists.length === 0 && (
        <div className="empty-state">
          <h3>No lists yet</h3>
          <p className="muted">
            Create lists to organize movies and shows you love.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreate(true)}
          >
            Create your first list
          </button>
        </div>
      )}

      {/* ===== Lists ===== */}
      {!loadingLists && lists.length > 0 && (
        <div className="lists-grid">
          {lists.map((list) => {
            const items = previews[list.id] || [];

            return (
              <div key={list.id} className="list-card">
                <Link
                  to={`/lists/${list.id}`}
                  className="list-card-main"
                >
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
                  disabled={deletingId === list.id}
                  onClick={() => setConfirmDelete(list)}
                >
                  {deletingId === list.id ? (
                    <Spinner size={14} />
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== Delete Confirmation ===== */}
      {confirmDelete && (
        <Modal open onClose={() => setConfirmDelete(null)}>
          <ConfirmModal
            title="Delete list?"
            message={`"${confirmDelete.name}" will be permanently deleted.`}
            danger
            confirmText="Delete list"
            onCancel={() => setConfirmDelete(null)}
            onConfirm={async () => {
              const deleted = confirmDelete;
              setConfirmDelete(null);
              setDeletingId(deleted.id);

              setLists(prev =>
                prev.filter(l => l.id !== deleted.id)
              );

              await deleteList(user.uid, deleted.id);

              setDeletingId(null);
              setToast({
                message: `List "${deleted.name}" deleted`,
                actionLabel: 'Undo',
                action: () =>
                  setLists(prev => [deleted, ...prev]),
              });
            }}
          />
        </Modal>
      )}

      {/* ===== Undo Toast ===== */}
      {toast && (
        <Toast
          message={toast.message}
          actionLabel={toast.actionLabel}
          onAction={toast.action}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
