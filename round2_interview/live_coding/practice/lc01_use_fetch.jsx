/**
 * LIVE CODING — lc01: useFetch
 * Topic: Custom Hooks + Async + Cleanup
 *
 * ─── TASK ─────────────────────────────────────────────────────────────────────
 * Implement a custom React hook: useFetch(url)
 *
 * It should return: { data, loading, error }
 *
 * Behaviour:
 *   - Starts in loading state (loading: true, data: null, error: null)
 *   - On success: sets data, clears loading and error
 *   - On failure: sets error message, clears loading and data
 *   - Re-fetches automatically if `url` changes
 *   - Cancels the in-flight request if the component unmounts OR url changes
 *     before the previous fetch completes (use AbortController)
 *
 * ─── USAGE EXAMPLE ────────────────────────────────────────────────────────────
 * function UserProfile({ userId }) {
 *   const { data, loading, error } = useFetch(`/api/users/${userId}`);
 *   if (loading) return <p>Loading...</p>;
 *   if (error)   return <p>Error: {error}</p>;
 *   return <p>{data.name}</p>;
 * }
 *
 * ─── CONSTRAINTS ──────────────────────────────────────────────────────────────
 * - Use AbortController for cancellation — do NOT use a boolean flag
 * - Handle the case where the fetch is aborted (don't set error state for aborts)
 * - Must clean up on unmount
 *
 * ─── INTERVIEWER FOLLOW-UPS ───────────────────────────────────────────────────
 * Be ready to explain:
 *   1. Why do we need cleanup? What happens without it?
 *   2. What is AbortController and how does it work?
 *   3. What's the difference between useEffect deps [] vs [url]?
 *   4. How would you add caching (e.g. don't re-fetch the same URL twice)?
 *
 * ─── YOUR SOLUTION ────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';

function useFetch(url) {
    // write your solution here
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        setLoading(true)
        setData(null)
        setError(null)

        fetch(url, { signal }).then((res) => {
            if (!res.ok) {
                throw new Error(`API error: ${res.status}`);
            }
            return res.json();
        }).then((data) => {
            setData(data);
            setLoading(false)
        }).catch((err) => {
            if (err.name === 'AbortError') {
                // Fetch was aborted, do not update state
                return;
            } else {
                setError(err.message);
                setLoading(false);
            }
        })

        return () => {
                controller.abort();
            }
    }, [url]);

    return { data, loading, error };
}

export default useFetch;
