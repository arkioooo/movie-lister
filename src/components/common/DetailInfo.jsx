import React from 'react';
import tmdb from '../../api/tmdb';



export default function DetailInfo({ details, actions }) {
  const title = details.title || details.name;
  const year =
    (details.release_date || details.first_air_date || '').split('-')[0];

  const runtime =
    details.runtime
      ? `${details.runtime} min`
      : details.episode_run_time?.[0]
      ? `${details.episode_run_time[0]} min / ep`
      : null;

  const genres = details.genres || [];
  const rating = details.vote_average?.toFixed(1);
  const cast = details.credits?.cast?.slice(0, 6) || [];
  const IMDbLogo = () => (
    <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
        alt="IMDb"
        style={{ height: 16 }}
    />
    );

  return (
    <div className="detail-info">
      {/* Title */}
        <h1 className="detail-title">
        {title}
        {year && <span className="detail-year">({year})</span>}
        </h1>

      {/* Runtime */}
      {runtime && (
        <div className="detail-meta-row">
          {runtime}
        </div>
      )}

      {/* Genres */}
      {genres.length > 0 && (
        <div className="detail-meta-row">
          {genres.map((g) => (
            <span key={g.id} className="meta-chip">
              {g.name}
            </span>
          ))}
        </div>
      )}

      {/* Rating */}
      {rating && (
        <div className="detail-rating-row">
          <IMDbLogo />
          <span className="detail-rating">{rating} / 10</span>
        </div>
      )}

      {/* Actions */}
      <div className="detail-actions">
        {actions}
      </div>

      {/* Overview */}
      <p className="detail-overview">
        {details.overview}
      </p>

      {/* Cast */}
      {cast.length > 0 && (
        <div className="detail-cast">
          <strong>Cast</strong>
          <div className="detail-cast-list">
            {cast.map((c) => c.name).join(' • ')}
          </div>
        </div>
      )}
    </div>
  );
}
