// src/pages/Search.jsx
import React, { useEffect, useState } from 'react';
import tmdb from '../api/tmdb';
import MovieGrid from '../components/movies/MovieGrid';

export default function Search() {
  const [q, setQ] = useState('');
  const [type, setType] = useState('multi'); // 'multi' | 'movie' | 'tv'
  const [page, setPage] = useState(1);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!q || q.trim().length === 0) {
        setResults(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      tmdb.search(q.trim(), page, type)
        .then((data) => setResults(data))
        .catch((err) => setError(err.message || 'Search failed'))
        .finally(() => setLoading(false));
    }, 350);

    return () => clearTimeout(timer);
  }, [q, type, page]);

  function onSubmit(e) {
    e.preventDefault();
    setPage(1);
  }

  return (
    <div className="container">
      <h2>Search</h2>

      <form onSubmit={onSubmit} className="search-bar">
        <div className="search-input">
          <input
            className="input"
            placeholder="Search movies, TV shows or people..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="search-select">
          <select
            className="select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="multi">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary btn-small">
          Search
        </button>
      </form>

      {loading && <div>Loading results...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {results && (
        <>
          <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--muted)' }}>
            <strong>{results.total_results}</strong> results — page {results.page} / {results.total_pages}
          </div>

          <MovieGrid items={results.results} />

          <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              disabled={results.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              disabled={results.page >= results.total_pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
