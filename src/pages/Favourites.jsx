// src/pages/Favourites.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getFavourites } from '../api/firestore';
import MovieGrid from '../components/movies/MovieGrid';
import Modal from '../components/common/Modal';
import AddToListModal from '../components/lists/AddToListModal';
import { Link } from 'react-router-dom';

export default function Favourites() {
  const { user, loading } = useAuth();
  const [favs, setFavs] = useState([]);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const [addItem, setAddItem] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) {
        if (mounted) setFavs([]);
        return;
      }
      setBusy(true);
      setErr(null);
      try {
        const data = await getFavourites(user.uid);
        if (mounted) setFavs(data);
      } catch (e) {
        console.error('Failed to load favourites', e);
        if (mounted) setErr('Failed to load favourites');
      } finally {
        if (mounted) setBusy(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user]);



  if (loading) return <div style={{ padding: 20 }}>Checking authentication...</div>;
  if (!user) return <div style={{ padding: 20 }}>Please <Link to="/login">log in</Link> to see your favourites.</div>;

  return (
    <div className='container'>
      <h2>Your favourites</h2>
      {busy && <div>Loading...</div>}
      {err && <div style={{ color: 'red' }}>{err}</div>}
      {!busy && favs.length === 0 && <div className="empty-state">
          <h3>No favourites yet</h3>
          <p className="muted">
            Tap the heart icon on any movie or TV show to save it here.
          </p>
        </div>
      }
      {!busy && favs.length > 0 && (
        <>
          <MovieGrid
            items={favs}
            onAddToList={(item) => setAddItem(item)}
          />

          {addItem && (
            <Modal onClose={() => setAddItem(null)}>
              <AddToListModal
                item={addItem}
                onClose={() => setAddItem(null)}
              />
            </Modal>
          )}
        </>
      )}
    </div>
  );
}
