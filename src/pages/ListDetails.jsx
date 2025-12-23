import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getListItems, removeItemFromList, getUserList } from '../api/firestore';
import ListItemRow from '../components/lists/ListItemRow';
import SortableListItemRow from '../components/lists/SortableListItemRow';


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


export default function ListDetails() {
  const { listId } = useParams();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [listMeta, setListMeta] = useState(null);

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
    await removeItemFromList(user.uid, listId, item.tmdbId);
    setItems((prev) => prev.filter((i) => i.tmdbId !== item.tmdbId));
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex(i => i.tmdbId == active.id);
      const newIndex = prev.findIndex(i => i.tmdbId == over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);

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
    <div className="container">
      <h1>{listMeta?.name || 'List'}</h1>
      {listMeta?.description && (
      <p className="muted">{listMeta.description}</p>
      )}

      {items.length === 0 && <p>The list is empty. Go to Discover to add items to this list.</p>}

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
  );
}
