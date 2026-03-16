/**
 * LIVE CODING — lc04: useRef + Stale Closure Fix
 * Topic: useRef / setInterval / Stale Closures
 *
 * ─── TASK ─────────────────────────────────────────────────────────────────────
 * Build a <Stopwatch /> component with:
 *   - A running seconds counter displayed on screen
 *   - Start / Stop / Reset buttons
 *   - Uses setInterval internally
 *
 * ─── THE TRAP ─────────────────────────────────────────────────────────────────
 * A naive implementation using only useState + useEffect will have a stale
 * closure bug: the interval callback captures `count` at creation time and
 * never sees the updated value, so `count` stays at 0 forever.
 *
 *   // ❌ BUG — count is always 0 inside the interval
 *   useEffect(() => {
 *     const id = setInterval(() => setCount(count + 1), 1000);
 *     return () => clearInterval(id);
 *   }, []);
 *
 * Fix it two ways:
 *   Method A — Functional updater:  setCount(c => c + 1)
 *   Method B — useRef to hold latest value (more general pattern)
 *
 * Implement Method B for the full solution (it applies beyond just counters).
 *
 * ─── REQUIREMENTS ─────────────────────────────────────────────────────────────
 * - Seconds count up from 0 when running
 * - Start/Stop toggles the interval
 * - Reset stops and resets to 0
 * - No memory leaks (clear interval on unmount)
 * - Use useRef to store the interval ID (do NOT store it in useState — why?)
 *
 * ─── USAGE EXAMPLE ────────────────────────────────────────────────────────────
 * function App() {
 *   return <Stopwatch />;
 * }
 *
 * ─── INTERVIEWER FOLLOW-UPS ───────────────────────────────────────────────────
 * Be ready to explain:
 *   1. What is a stale closure? Why does it happen inside setInterval?
 *   2. Why does the functional updater `setCount(c => c + 1)` fix the stale closure?
 *   3. Why is useRef preferred over useState for storing the interval ID?
 *      (Hint: what happens to the component when state changes?)
 *   4. What does it mean that useRef changes don't trigger re-renders?
 *   5. How would you extract this into a useInterval(callback, delay) custom hook?
 *
 * ─── YOUR SOLUTION ────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from 'react';

function Stopwatch() {
  // YOUR CODE HERE
  const [count, setCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        setCount(prev => prev + 1)
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    return () => {
      clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const handleReset = () => {
    setIsRunning(false)
    setCount(0)
  }

  return (
    <>
      <span>{count}</span>
      <button onClick={() => setIsRunning(true)}>Start</button>
      <button onClick={() => setIsRunning(false)}>Stop</button>
      <button onClick={() => handleReset()}>Reset</button>
    </>
  )

}

export default Stopwatch;
