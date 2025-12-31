// src/components/movies/AddToFavButton.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { addFavourite, removeFavourite } from '../../api/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';

function HeartIcon({ filled }) {
  return filled ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="#3282B8"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 21s-6.716-4.35-9.5-8.364C.79 9.36 2.17 5.5 6.09 5.5c2.02 0 3.38 1.11 3.91 2.09.53-.98 1.89-2.09 3.91-2.09 3.92 0 5.3 3.86 3.59 7.136C18.716 16.65 12 21 12 21z"/>
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#BBE1FA"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.8 4.6c-1.6-1.6-4.2-1.6-5.8 0L12 7.6l-3-3c-1.6-1.6-4.2-1.6-5.8 0-1.6 1.6-1.6 4.2 0 5.8L12 21l8.8-10.6c1.6-1.6 1.6-4.2 0-5.8z"/>
    </svg>
  );
}


export default function AddToFavButton({
  tmdbId,
  type = 'movie',
  title = '',
  posterPath = '',
  className = '',
  children,
}) {
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
    return () => {
      mounted = false;
    };
  }, [user, tmdbId]);

  async function handleToggle() {
    if (!user) {
      navigate('/login');
      return;
    }

    const prev = isFav;
    setIsFav(!prev);
    setLoading(true);

    try {
      if (!prev) {
        await addFavourite(user.uid, {
          tmdbId,
          type,
          title,
          posterPath,
        });
      } else {
        await removeFavourite(user.uid, tmdbId);
      }
    } catch (e) {
      console.error('Fav toggle failed', e);
      setIsFav(prev);
      alert('Could not update favourites. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const finalClassName = `
    btn
    btn-small
    ${isFav ? 'btn-primary' : 'btn-secondary'}
    ${className}
  `.trim();

  return (
    <button
      onClick={handleToggle}
      disabled={loading || checking}
      aria-pressed={isFav}
      className={finalClassName}
    >
      {checking || loading ? (
        '...'
      ) : (
        <>
          <span className="btn-icon">
            <HeartIcon filled={isFav} />
          </span>
          {children || (isFav ? 'Favourited' : 'Favourite')}
        </>
      )}
    </button>
  );
}
