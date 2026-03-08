/**
 * LIVE CODING — Search Component with Debounce + Race Condition Prevention
 *
 * TASK: Build a search input that:
 *   1. Debounces the API call (don't call on every keystroke)
 *   2. Prevents race conditions (a slow earlier response doesn't overwrite a faster later one)
 *   3. Clears results when query is empty
 */

import { useState, useEffect } from 'react';
import { useDebounce } from './01_use_debounce';

export function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    let cancelled = false; // closure flag to prevent stale responses

    setLoading(true);
    setError(null);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then(res => {
        if (!res.ok) throw new Error('Search failed');
        return res.json();
      })
      .then(data => {
        if (!cancelled) setResults(data); // only update if this request is still current
      })
      .catch(err => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; }; // cleanup: cancel stale requests
  }, [debouncedQuery]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
        aria-label="Search"
      />
      {loading && <p>Loading...</p>}
      {error && <p role="alert">Error: {error}</p>}
      <ul>
        {results.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
