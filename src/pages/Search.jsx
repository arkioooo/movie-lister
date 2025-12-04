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

  // perform search when query or type or page changes (debounce)
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      if (!q || q.trim().length === 0) {
        setResults(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      tmdb.search(q.trim(), page, type)
        .then((data) => {
          setResults(data);
        })
        .catch((err) => {
          setError(err.message || 'Search failed');
        })
        .finally(() => {
          setLoading(false);
        });
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, type, page]);

  function onSubmit(e) {
    e.preventDefault();
    setPage(1);
    // effect will run
  }

  return (
    <div style={{ maxWidth: 1100, margin: '1.5rem auto' }}>
      <h2>Search</h2>

      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input
          placeholder="Search movies, TV shows or people..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1, padding: '8px 10px', fontSize: 16 }}
        />

        <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: '8px' }}>
          <option value="multi">All</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>

        <button type="submit">Search</button>
      </form>

      {loading && <div>Loading results...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {results && (
        <>
          <div style={{ marginBottom: 8 }}>
            <strong>{results.total_results}</strong> results — page {results.page} / {results.total_pages}
          </div>

          <MovieGrid items={results.results} />

          <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <button disabled={results.page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </button>
            <button disabled={results.page >= results.total_pages} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
