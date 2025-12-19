import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { getUserLists, addItemToList, getListItems } from '../../api/firestore';

export default function AddToListModal({ item, onClose }) {
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const [selected, setSelected] = useState({});
  const [existing, setExisting] = useState({});

  useEffect(() => {
    async function load() {
      const listsData = await getUserLists(user.uid);
      setLists(listsData);

      const map = {};
      for (const list of listsData) {
        const items = await getListItems(user.uid, list.id);
        map[list.id] = items.some(i => i.tmdbId === item.tmdbId);
      }
      setExisting(map);
    }
    load();
  }, [user, item]);

  async function handleSave() {
    const chosen = Object.keys(selected).filter((k) => selected[k]);
    for (const listId of chosen) {
      await addItemToList(user.uid, listId, {
        tmdbId: item.tmdbId,
        note: item.title,
      });
    }
    onClose();
  }

  return (
    <div>
      <h3>Add to list</h3>

      {lists.map((list) => (
        <label key={list.id} style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={!!selected[list.id]}
            disabled={existing[list.id]}
            onChange={(e) =>
              setSelected((s) => ({
                ...s,
                [list.id]: e.target.checked,
              }))
            }
          />
          {existing[list.id] && <span style={{ marginLeft: 6 }}>(already added)</span>}
          {list.name}
        </label>
      ))}

      <div style={{ marginTop: 12 }}>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}
