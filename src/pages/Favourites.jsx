// src/pages/Favourites.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getFavourites } from '../api/firestore';
import MovieGrid from '../components/movies/MovieGrid';

export default function Favourites() {
  const { user, loading } = useAuth();
  const [favs, setFavs] = useState([]);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

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
  if (!user) return <div style={{ padding: 20 }}>Please <a href="/login">log in</a> to see your favourites.</div>;

  return (
    <div style={{ maxWidth: 1100, margin: '1.5rem auto' }}>
      <h2>Your favourites</h2>
      {busy && <div>Loading...</div>}
      {err && <div style={{ color: 'red' }}>{err}</div>}
      {!busy && favs.length === 0 && <div>You have no favourites yet — add some from a movie or TV page.</div>}
      {!busy && favs.length > 0 && <MovieGrid items={favs} />}
    </div>
  );
}
