// src/pages/Discover.jsx
import React, { useEffect, useMemo, useState } from 'react';
import tmdb from '../api/tmdb';
import MovieGrid from '../components/movies/MovieGrid';

export default function Discover() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [rawMovie, setRawMovie] = useState(null);
  const [rawTv, setRawTv] = useState(null);

  // Filters
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all'); // 'all' | 'movie' | 'tv'

  // Fetch data whenever page or type changes
  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const promises = [];

        if (type === 'all' || type === 'movie') {
          promises.push(
            tmdb.discover('movie', page, { sort_by: 'popularity.desc' }).then((res) => ({
              kind: 'movie',
              data: res,
            }))
          );
        }

        if (type === 'all' || type === 'tv') {
          promises.push(
            tmdb.discover('tv', page, { sort_by: 'popularity.desc' }).then((res) => ({
              kind: 'tv',
              data: res,
            }))
          );
        }

        const results = await Promise.all(promises);
        let moviesRes = null;
        let tvRes = null;

        for (const r of results) {
          if (r.kind === 'movie') moviesRes = r.data;
          if (r.kind === 'tv') tvRes = r.data;
        }

        setRawMovie(moviesRes);
        setRawTv(tvRes);
      } catch (e) {
        console.error(e);
        setErr(e.message || 'Failed to load discover');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page, type]);

  // Combine + search filter
  const combined = useMemo(() => {
    let items = [];

    if (rawMovie?.results) {
      items = items.concat(
        rawMovie.results.map((r) => ({
          ...r,
          media_type: 'movie',
        }))
      );
    }

    if (rawTv?.results) {
      items = items.concat(
        rawTv.results.map((r) => ({
          ...r,
          media_type: 'tv',
        }))
      );
    }

    if (query.trim()) {
      const qLower = query.trim().toLowerCase();
      items = items.filter((item) => {
        const title = (item.title || item.name || '').toLowerCase();
        return title.includes(qLower);
      });
    }

    items.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    return items;
  }, [rawMovie, rawTv, query]);

  const maxPages = useMemo(() => {
    const moviePages = rawMovie?.total_pages || Infinity;
    const tvPages = rawTv?.total_pages || Infinity;
    const p = Math.max(1, Math.min(moviePages, tvPages));
    return Number.isFinite(p) ? p : 1;
  }, [rawMovie, rawTv]);

  function handleSearchSubmit(e) {
    e.preventDefault();
  }

  function handleTypeChange(e) {
    setPage(1);
    setType(e.target.value);
  }

  return (
    <div className="container">
      {/* Controls bar: search + type inline */}
      <form onSubmit={handleSearchSubmit} className="discover-controls">
        <input
          className="input discover-search-input"
          placeholder="Search within discover results..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="select discover-type-select"
          value={type}
          onChange={handleTypeChange}
        >
          <option value="all">Type</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>
      </form>

      {loading && <div>Loading...</div>}
      {err && <div style={{ color: 'red' }}>{err}</div>}

      {!loading && !err && (
        <>
          <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--muted)' }}>
            Showing <strong>{combined.length}</strong> items — page {page} / {maxPages}
          </div>

          <MovieGrid items={combined} />

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              disabled={page >= maxPages}
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
