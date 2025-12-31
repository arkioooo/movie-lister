import React from 'react';
import { Link } from 'react-router-dom';
import tmdb from '../../api/tmdb';

export default function MovieCard({ item }) {
  if (!item) return null;

  const id = item.id || item.tmdbId;
  if (!id) return null;

  const type =
    item.media_type === 'tv' || item.type === 'tv'
      ? 'tv'
      : 'movie';

  const title = item.title || item.name || 'Untitled';
  const poster =
    item.poster_path ||
    item.posterPath ||
    item.backdrop_path ||
    null;

  return (
    <Link to={`/${type}/${id}`} className="movie-card">
      <div className="movie-card-poster">
        {poster ? (
          <img
            src={tmdb.posterUrl(poster, 'w342')}
            alt={title}
          />
        ) : (
          <div className="movie-card-placeholder" />
        )}
      </div>

      <div className="movie-card-title">
        {title}
      </div>
    </Link>
  );
}
