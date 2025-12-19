import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getListItems } from '../api/firestore';
import MovieGrid from '../components/movies/MovieGrid';

export default function ListDetails() {
  const { listId } = useParams();
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const data = await getListItems(user.uid, listId);
      setItems(data);
    }

    load();
  }, [user, listId]);

  if (!user) return <div className="container">Please log in.</div>;

  return (
    <div className="container">
      <h1>List</h1>

      {items.length === 0 && <p>This list is empty.</p>}

      <MovieGrid
        items={items}
        onRemoveFromList={(itemId) =>
          setItems((i) => i.filter((x) => x.id !== itemId))
        }
      />
    </div>
  );
}
