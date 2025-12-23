
import React from 'react';
import { Link } from 'react-router-dom';
import tmdb from '../../api/tmdb';
import useAuth from '../../hooks/useAuth';


export default function MovieCard({ item, onRemoveFromList }) {
  // TMDB search/multi returns different keys: title/name, poster_path, media_type
  const id = item.id || item.tmdbId;
  const type = item.media_type || (item.title ? 'movie' : 'tv');
  const title = item.title || item.name;
  const poster = item.poster_path || item.posterPath || item.backdrop_path;
  const { user } = useAuth();

  return (
    
    <div style={cardStyle}>
      <Link to={`/${type}/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ height: 280, marginBottom: 8, overflow: 'hidden', borderRadius: 6 }}>
          {poster ? (
            <img
              src={tmdb.posterUrl(poster, 'w342')}
              alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={noPosterStyle}>No image</div>
          )}
        </div>

        <div>
          <div style={{ fontWeight: 600, fontSize: 14, lineHeight: '1.2em' }}>{title}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
            {item.release_date || item.first_air_date}
          </div>
        </div>
      </Link>

      {/* Add-to-list moved to MoviePage; button intentionally omitted here */}
      {onRemoveFromList && (
        <button
          className="btn btn-secondary btn-small"
          onClick={() => onRemoveFromList(item)}
        >
          Remove
        </button>
      )}
    </div>
  );
}

const cardStyle = {
  width: 200,
  margin: 8,
};

const noPosterStyle = {
  width: '100%',
  height: '100%',
  background: '#ddd',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#666',
  fontSize: 14,
};
