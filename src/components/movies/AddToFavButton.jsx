// src/components/movies/AddToFavButton.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { addFavourite, removeFavourite } from '../../api/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';

export default function AddToFavButton({ tmdbId, type = 'movie', title = '', posterPath = '' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function check() {
      setChecking(true);
      if (!user) {
        if (mounted) setIsFav(false);
        setChecking(false);
        return;
      }
      try {
        const docRef = doc(db, 'users', user.uid, 'favourites', String(tmdbId));
        const snap = await getDoc(docRef);
        if (mounted) setIsFav(snap.exists());
      } catch (e) {
        console.error('Failed to check favourite', e);
        if (mounted) setIsFav(false);
      } finally {
        if (mounted) setChecking(false);
      }
    }
    check();
    return () => { mounted = false; };
  }, [user, tmdbId]);

  async function handleToggle() {
    if (!user) {
      // prompt login: navigate to login but preserve current location is optional
      navigate('/login');
      return;
    }

    // optimistic UI
    const prev = isFav;
    setIsFav(!prev);
    setLoading(true);

    try {
      if (!prev) {
        await addFavourite(user.uid, { tmdbId, type, title, posterPath });
      } else {
        await removeFavourite(user.uid, tmdbId);
      }
      // success — do NOT navigate anywhere
    } catch (e) {
      console.error('Fav toggle failed', e);
      // rollback UI on error
      setIsFav(prev);
      // optionally notify user
      alert('Could not update favourites. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // while initial check is in progress, show disabled state
  return (
    <button
      onClick={handleToggle}
      disabled={loading || checking}
      aria-pressed={isFav}
      className={`btn btn-small ${isFav ? 'btn-primary' : 'btn-secondary'}`}
    >
      {checking ? '...' : (loading ? '...' : (isFav ? 'Remove from favourites' : 'Add to favourites'))}
    </button>
  );
}
