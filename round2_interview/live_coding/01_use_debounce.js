/**
 * LIVE CODING — Custom Hook: useDebounce
 *
 * TASK: Implement a useDebounce hook that delays updating a value until
 * the user has stopped changing it for a given delay period.
 *
 * Common use case: search inputs — don't fire an API call on every keystroke,
 * only after the user pauses typing.
 */

import { useState, useEffect } from 'react';

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Schedule the update after `delay` ms
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    // Cleanup: if value changes before delay expires, cancel the previous timer
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Usage in a component:
 *
 * function SearchInput() {
 *   const [query, setQuery] = useState('');
 *   const debouncedQuery = useDebounce(query, 300);
 *
 *   useEffect(() => {
 *     if (debouncedQuery) fetchResults(debouncedQuery);
 *   }, [debouncedQuery]);
 *
 *   return <input value={query} onChange={e => setQuery(e.target.value)} />;
 * }
 */
