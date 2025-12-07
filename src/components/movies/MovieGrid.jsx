
import React from 'react';
import MovieCard from './MovieCard';

export default function MovieGrid({ items }) {
  if (!items || items.length === 0) {
    return <div style={{ padding: 20 }}>No results.</div>;
  }

  return (
    <div style={gridStyle}>
      {items.map((it) => (
        <MovieCard key={it.id || it.tmdbId} item={it} />
      ))}
    </div>
  );
}

const gridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  paddingTop: 12,
};
