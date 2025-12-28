import React from 'react';
import MovieCard from './MovieCard';

export default function MovieGrid({ items }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <div style={{ padding: 20 }}>No results.</div>;
  }

  return (
    <div className="movie-grid">
      {items
        .filter(Boolean)
        .map((it, index) => (
          <MovieCard
            key={it?.id ?? it?.tmdbId ?? `fallback-${index}`}
            item={it}
          />
        ))}
    </div>
  );
}
