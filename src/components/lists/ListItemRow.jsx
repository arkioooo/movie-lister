import React, { useEffect, useState } from 'react';
import tmdb from '../../api/tmdb';

export default function ListItemRow({ item, onRemove }) {
  const [title, setTitle] = useState(item.title || 'Loading…');
  const [rating, setRating] = useState(null);

    useEffect(() => {
    let mounted = true;

    async function load() {
        try {
        let data;

        if (item.type === 'movie' || item.type === 'tv') {
            data = await tmdb.getDetails(item.type, item.tmdbId);
        } else {
            try {
            data = await tmdb.getDetails('movie', item.tmdbId);
            } catch (e) {
            data = await tmdb.getDetails('tv', item.tmdbId);
            }
        }

        if (!mounted) return;

        setTitle(data.title || data.name || 'Untitled');
        setRating(
            typeof data.vote_average === 'number'
            ? data.vote_average
            : null
        );
        } catch (e) {
        console.error('TMDB fetch failed', e);
        if (mounted) setTitle('Unknown title');
        }
    }

    load();
    return () => {
        mounted = false;
    };
    }, [item.tmdbId, item.type]);


  return (
    <div className="list-item-row">
      <div>
        <strong>{title}</strong>
        {rating !== null && (
          <span className="rating-pill">⭐ {rating.toFixed(1)}</span>
        )}
      </div>

      <button
        className="btn btn-primary btn-small"
        onClick={onRemove}
      >
        X
      </button>
    </div>
  );
}

