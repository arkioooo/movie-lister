// src/components/movies/AddToFavButton.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { addFavourite, removeFavourite, getFavourites } from '../../api/firestore';

export default function AddToFavButton({ tmdbId, type = 'movie', title = '', posterPath = '' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch initial favourite state for signed-in user
  useEffect(() => {
    let mounted = true;
    async function fetch() {
      if (!user) {
        if (mounted) setIsFav(false);
        return;
      }
      try {
        const favs = await getFavourites(user.uid);
        const found = favs.some((f) => String(f.tmdbId) === String(tmdbId));
        if (mounted) setIsFav(found);
      } catch (e) {
        console.error('Failed to fetch favourites', e);
      }
    }
    fetch();
    return () => { mounted = false; };
  }, [user, tmdbId]);

  async function handleToggle() {
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      if (!isFav) {
        await addFavourite(user.uid, { tmdbId, type, title, posterPath });
        setIsFav(true);
      } else {
        await removeFavourite(user.uid, tmdbId);
        setIsFav(false);
      }
    } catch (e) {
      console.error('Fav toggle failed', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleToggle} disabled={loading} aria-pressed={isFav} style={buttonStyle}>
      {loading ? '...' : (isFav ? 'Remove from favourites ❤️' : 'Add to favourites ♡')}
    </button>
  );
}

const buttonStyle = {
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid #ddd',
  background: '#fff',
  cursor: 'pointer',
};
