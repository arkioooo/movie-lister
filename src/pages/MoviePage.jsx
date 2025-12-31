// src/pages/MoviePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import tmdb from '../api/tmdb';
import MovieGrid from '../components/movies/MovieGrid';
import AddToFavButton from '../components/movies/AddToFavButton';
import Modal from '../components/common/Modal';
import AddToListModal from '../components/lists/AddToListModal';
import useAuth from '../hooks/useAuth';
import DetailInfo from '../components/common/DetailInfo';

export default function MoviePage() {
  const { id } = useParams();
  const type = 'movie';

  const [details, setDetails] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const { user } = useAuth();
  const [addItem, setAddItem] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setErr(null);

    tmdb
      .getDetails(type, id)
      .then((data) => {
        setDetails(data);
        setRecommendations(data?.recommendations?.results || []);
      })
      .catch((e) => {
        setErr(e.message || 'Failed to load details');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container">Loading…</div>;
  if (err) return <div className="container error">{err}</div>;
  if (!details) return <div className="container">No details found.</div>;

  const poster = details.poster_path || details.backdrop_path;

  function handleAddToList() {
    if (!user) {
      alert('Please sign in to add to a list.');
      return;
    }

    setAddItem({
      tmdbId: String(details.id),
      type: 'movie',
      title: details.title,
      posterPath: poster || null,
    });
  }

  return (
    <div className="detail-page">
      {/* Backdrop */}
      <div
        className="detail-backdrop"
        style={{
          backgroundImage: `url(${tmdb.posterUrl(
            details.backdrop_path || details.poster_path,
            'original'
          )})`,
        }}
      />

      {/* Main content */}
      <div className="detail-container">
        {/* Poster */}
        <div className="detail-poster">
          {poster && (
            <img
              src={tmdb.posterUrl(poster, 'w500')}
              alt={details.title}
            />
          )}
        </div>

        {/* Info */}
        <DetailInfo
          details={details}
          actions={
            <>
              <AddToFavButton
                tmdbId={details.id}
                type="movie"
                title={details.title}
                posterPath={poster || null}
                className="btn btn-primary btn-small"
              >
                <span className="btn-icon"></span>
                Favourite
              </AddToFavButton>

              <button
                className="btn btn-secondary btn-small"
                onClick={handleAddToList}
              >
                <span className="btn-icon">🔖</span>
                Add to list
              </button>
            </>
          }
        />

      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="detail-recommendations">
          <h3>Recommendations</h3>
          <MovieGrid items={recommendations.slice(0, 12)} />
        </section>
      )}

      {/* Add to list modal */}
      {addItem && (
        <Modal open onClose={() => setAddItem(null)}>
          <AddToListModal
            item={addItem}
            onClose={() => setAddItem(null)}
          />
        </Modal>
      )}
    </div>
  );
}
