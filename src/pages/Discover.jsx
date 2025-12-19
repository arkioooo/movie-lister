// src/pages/Discover.jsx
import React, { useEffect, useMemo, useState, useRef } from 'react';
import tmdb from '../api/tmdb';
import MovieGrid from '../components/movies/MovieGrid';
import useUserPreferences from '../hooks/useUserPreferences';


export default function Discover() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [rawMovie, setRawMovie] = useState(null);
  const [rawTv, setRawTv] = useState(null);
  const { prefs } = useUserPreferences();
  
  // Filters
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all'); // 'all' | 'movie' | 'tv'
  const [isSearching, setIsSearching] = useState(false); // Track if we're in search mode
  const [searchResults, setSearchResults] = useState(null);
  
  const debounceTimer = useRef(null);

  // Auto-search with debounce when query changes
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // If query is empty, reset to discover mode
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults(null);
      setPage(1);
      return;
    }

    // Debounce the search call
    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      setErr(null);
      setPage(1);
      
      try {
        const searchType = type === 'all' ? 'multi' : type;
        const results = await tmdb.search(query, 1, searchType, {
          allowAdult: prefs.allowAdult,
          language: prefs.language,
        });
        
        setSearchResults(results);
        setIsSearching(true);
      } catch (e) {
        console.error(e);
        setErr(e.message || 'Search failed');
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce delay

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, type, prefs]);

  // Fetch discover data whenever page or type changes (only for discover mode)
  useEffect(() => {
    if (isSearching) return; // Skip discover fetch when searching
    
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const promises = [];

        if (type === 'all' || type === 'movie') {
          promises.push(
            tmdb.discover('movie', page, { sort_by: 'popularity.desc', allowAdult: prefs.allowAdult, language: prefs.language}).then((res) => ({
              kind: 'movie',
              data: res,
            }))
          );
        }

        if (type === 'all' || type === 'tv') {
          promises.push(
            tmdb.discover('tv', page, { sort_by: 'popularity.desc', allowAdult: prefs.allowAdult, language: prefs.language }).then((res) => ({
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
  }, [page, type, isSearching, prefs]);

  // Combine discover results (only used when not searching)
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

    items.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    return items;
  }, [rawMovie, rawTv]);

  const maxPages = useMemo(() => {
    if (isSearching && searchResults) {
      return searchResults.total_pages || 1;
    }
    const moviePages = rawMovie?.total_pages || Infinity;
    const tvPages = rawTv?.total_pages || Infinity;
    const p = Math.max(1, Math.min(moviePages, tvPages));
    return Number.isFinite(p) ? p : 1;
  }, [rawMovie, rawTv, searchResults, isSearching]);

  // Get current items to display
  const displayItems = useMemo(() => {
    if (isSearching && searchResults?.results) {
      return searchResults.results.map((r) => ({
        ...r,
        media_type: r.media_type || 'movie',
      }));
    }
    return combined;
  }, [isSearching, searchResults, combined]);

  function handleTypeChange(e) {
    setPage(1);
    setType(e.target.value);
    // Reset search when type changes
    if (isSearching) {
      setIsSearching(false);
      setSearchResults(null);
    }
  }

  return (
    <div className="container">
      {/* Controls bar: search + type inline */}
      <form onSubmit={(e) => e.preventDefault()} className="discover-controls">
        <input
          className="input discover-search-input"
          placeholder="Search ..."
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
            Showing <strong>{displayItems.length}</strong> items — page {page} / {maxPages}
            {isSearching && query && ` (searching for "${query}")`}
          </div>

          <MovieGrid items={displayItems} />

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
