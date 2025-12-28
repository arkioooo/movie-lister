import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
  getListItems,
  removeItemFromList,
  getUserList,
} from '../api/firestore';

import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../api/firebase';

import Modal from '../components/common/Modal';
import ConfirmModal from '../components/common/ConfirmModal';
import Toast from '../components/common/Toast';
import Skeleton from '../components/common/Skeleton';
import SortableListItemRow from '../components/lists/SortableListItemRow';

export default function ListDetails() {
  const { listId } = useParams();
  const { user } = useAuth();

  const [listMeta, setListMeta] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const [confirmItem, setConfirmItem] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user) return;

    async function load() {
      setLoadingItems(true);

      const [meta, data] = await Promise.all([
        getUserList(user.uid, listId),
        getListItems(user.uid, listId),
      ]);

      setListMeta(meta);
      setItems(data);
      setLoadingItems(false);
    }

    load();
  }, [user, listId]);

  if (!user) {
    return <div className="container">Please log in.</div>;
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex(i => i.tmdbId === active.id);
      const newIndex = prev.findIndex(i => i.tmdbId === over.id);

      const reordered = arrayMove(prev, oldIndex, newIndex);

      reordered.forEach((item, index) => {
        updateDoc(
          doc(
            db,
            'users',
            user.uid,
            'lists',
            listId,
            'items',
            String(item.tmdbId)
          ),
          { position: index }
        ).catch(console.error);
      });

      return reordered;
    });
  }

  return (
    <div className="container">
      {/* ===== Header ===== */}
      <div className="page-header">
        <h1>{listMeta?.name || 'List'}</h1>
      </div>

      {listMeta?.description && (
        <p className="muted">{listMeta.description}</p>
      )}

      {/* ===== Skeletons ===== */}
      {loadingItems && (
        <>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="list-item-row">
              <Skeleton width="55%" />
              <Skeleton width={60} height={28} radius={14} />
            </div>
          ))}
        </>
      )}

      {/* ===== Empty State ===== */}
      {!loadingItems && items.length === 0 && (
        <div className="empty-state">
          <h3>This list is empty</h3>
          <p className="muted">
            Add movies or TV shows from their detail pages.
          </p>
        </div>
      )}

      {/* ===== Items ===== */}
      {!loadingItems && items.length > 0 && (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map(i => i.tmdbId)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableListItemRow
                key={item.tmdbId}
                item={item}
                onRemove={() => setConfirmItem(item)}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {/* ===== Remove Confirmation ===== */}
      {confirmItem && (
        <Modal open onClose={() => setConfirmItem(null)}>
          <ConfirmModal
            title="Remove item?"
            message="This item will be removed from the list."
            danger
            confirmText="Remove"
            onCancel={() => setConfirmItem(null)}
            onConfirm={async () => {
              const removed = confirmItem;
              setConfirmItem(null);

              setItems(prev =>
                prev.filter(i => i.tmdbId !== removed.tmdbId)
              );

              await removeItemFromList(
                user.uid,
                listId,
                removed.tmdbId
              );

              setToast({
                message: 'Item removed from list',
                actionLabel: 'Undo',
                action: () =>
                  setItems(prev => [...prev, removed]),
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
