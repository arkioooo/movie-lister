import React, { useEffect, useState } from 'react';
import tmdb from '../api/tmdb';
import MovieGrid from '../components/movies/MovieGrid';

export default function Discover() {
  const [type, setType] = useState('movie'); // 'movie' or 'tv'
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    tmdb.discover(type, page)
      .then((res) => setData(res))
      .catch((e) => setErr(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [type, page]);

  return (
    <div style={{ maxWidth: 1100, margin: '1.5rem auto' }}>
      <h2>Discover</h2>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <label>
          Type:{' '}
          <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
        </label>

        <div style={{ marginLeft: 'auto' }}>
          <strong>Page:</strong> {data ? data.page : page}
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {err && <div style={{ color: 'red' }}>{err}</div>}

      {data && (
        <>
          <MovieGrid items={data.results} />
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button disabled={data.page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
            <button disabled={data.page >= data.total_pages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
