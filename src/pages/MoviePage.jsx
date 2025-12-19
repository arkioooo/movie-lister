import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import tmdb from '../api/tmdb';
import MovieGrid from '../components/movies/MovieGrid';
import AddToFavButton from '../components/movies/AddToFavButton';
import useAuth from '../hooks/useAuth';

export default function MoviePage({ isTV = false }) {
  const { id } = useParams();
  const type = isTV ? 'tv' : 'movie';
  const [details, setDetails] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setErr(null);

    tmdb.getDetails(type, id)
      .then((data) => {
        setDetails(data);
        const recs = (data.recommendations && data.recommendations.results) || [];
        setRecommendations(recs);
      })
      .catch((e) => {
        setErr(e.message || 'Failed to load details');
      })
      .finally(() => setLoading(false));
  }, [id, type]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (err) return <div style={{ padding: 20, color: 'red' }}>{err}</div>;
  if (!details) return <div style={{ padding: 20 }}>No details found.</div>;

  const title = details.title || details.name;
  const poster = details.poster_path || details.backdrop_path;

  function handleAddToList() {
    if (!user) {
      alert('Please sign in to add to a list.');
      return;
    }
    alert(`Add "${title}" to list (coming soon)`);
  }

  return (
    <div style={{ maxWidth: 1000, margin: '1.5rem auto' }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ width: 300 }}>
          {poster ? (
            <img src={tmdb.posterUrl(poster, 'w500')} alt={title} style={{ width: '100%', borderRadius: 8 }} />
          ) : (
            <div style={{ width: '100%', height: 450, background: '#ddd', borderRadius: 8 }} />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ marginTop: 0 }}>{title}</h1>
          <p style={{ color: '#666' }}>
            {details.tagline && <em>{details.tagline}</em>}
          </p>
          <p>{details.overview}</p>

          <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
            <AddToFavButton
              tmdbId={id}
              type={type}
              title={title}
              posterPath={details.poster_path || details.backdrop_path || null}
            />
            {user && (
              <button className="btn btn-secondary btn-small" onClick={handleAddToList}>
                Add to list
              </button>
            )}
            <div style={{ marginLeft: 12 }}>
              <strong>Rating:</strong> {details.vote_average} ({details.vote_count} votes)
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <strong>Genres:</strong> {(details.genres || []).map((g) => g.name).join(', ')}
          </div>
        </div>
      </div>

      {recommendations && recommendations.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <h3>Recommendations</h3>
          <MovieGrid items={recommendations.slice(0, 12)} />
        </section>
      )}
    </div>
  );
}
