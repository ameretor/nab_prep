/**
 * LIVE CODING — Custom Hook: useLocalStorage
 *
 * TASK: Implement a hook that syncs state with localStorage, so the value
 * persists across page refreshes.
 *
 * Drop-in replacement for useState with persistence.
 */

import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    // Lazy init: only read from localStorage once on mount
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    // Support functional updater pattern (like useState)
    const valueToStore = value instanceof Function ? value(stored) : value;
    setStored(valueToStore);
    try {
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      // Ignore write errors (e.g. private browsing quota)
    }
  };

  return [stored, setValue];
}

/**
 * Usage:
 *
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * setTheme('dark'); // persists across refreshes
 */
