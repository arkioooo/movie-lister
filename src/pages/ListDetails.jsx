import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getListItems, removeItemFromList, getUserList } from '../api/firestore';
import SortableListItemRow from '../components/lists/SortableListItemRow';
import Modal from '../components/common/Modal';
import ConfirmModal from '../components/common/ConfirmModal';
import Toast from '../components/common/Toast'; // ADD THIS IMPORT

import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../api/firebase';

export default function ListDetails() {
  const { listId } = useParams();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [listMeta, setListMeta] = useState(null);
  const [confirmItem, setConfirmItem] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const [itemsData, meta] = await Promise.all([
        getListItems(user.uid, listId),
        getUserList(user.uid, listId),
      ]);

      setItems(itemsData);
      setListMeta(meta);
    }

    load();
  }, [user, listId]);

  async function handleRemove(item) {
    setConfirmItem(item);
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex(i => i.tmdbId == active.id);
      const newIndex = prev.findIndex(i => i.tmdbId == over.id);

      if (oldIndex < 0 || newIndex < 0) return prev;

      const reordered = (() => {
        const arr = prev.slice();
        const [moved] = arr.splice(oldIndex, 1);
        arr.splice(newIndex, 0, moved);
        return arr;
      })();

      reordered.forEach((item, index) => {
        updateDoc(
          doc(db, 'users', user.uid, 'lists', listId, 'items', String(item.tmdbId)),
          { position: index }
        ).catch(console.error);
      });

      return reordered;
    });
  }

  if (!user) return <div className="container">Please log in.</div>;

  return (
    <>
      <div className="container">
        <h1>{listMeta?.name || 'List'}</h1>
        {listMeta?.description && (
          <p className="muted">{listMeta.description}</p>
        )}

        {items.length === 0 && (
          <p>The list is empty. Go to Discover to add items to this list.</p>
        )}

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
                onRemove={() => handleRemove(item)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* ===== Confirm Remove Item Modal ===== */}
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

              // optimistic UI
              setItems(prev =>
                prev.filter(i => i.tmdbId !== removed.tmdbId)
              );

              try {
                await removeItemFromList(user.uid, listId, removed.tmdbId);
                setToast({
                  message: 'Item removed from list',
                  actionLabel: 'Undo',
                  action: async () => {
                    setItems(prev => [...prev, removed]);
                  },
                });
              } catch (error) {
                // restore on failure
                setItems(prev => [...prev, removed]);
                console.error('Failed to remove item:', error);
              }
            }}
          />
        </Modal>
      )}

      {/* ===== Toast Notification ===== */}
      {toast && (
        <Toast
          message={toast.message}
          actionLabel={toast.actionLabel}
          onAction={toast.action}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
