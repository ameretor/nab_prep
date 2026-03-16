/**
 * LIVE CODING — lc08: Error Boundary
 * Topic: Error Handling / Class Components / getDerivedStateFromError
 *
 * ─── TASK ─────────────────────────────────────────────────────────────────────
 * Implement an <ErrorBoundary /> component that:
 *   - Catches render errors thrown by any child component
 *   - Displays a fallback UI instead of crashing the whole app
 *   - Provides a "Try again" button to reset the error state
 *   - Accepts a custom fallback via a `fallback` prop
 *
 * ─── CONTEXT ──────────────────────────────────────────────────────────────────
 * Error Boundaries MUST be class components — there is no hooks equivalent.
 * React 19 is adding `use(promise)` and improved error handling, but the classic
 * pattern is still a class with getDerivedStateFromError + componentDidCatch.
 *
 * ─── USAGE EXAMPLE ────────────────────────────────────────────────────────────
 * <ErrorBoundary fallback={<p>Something went wrong.</p>}>
 *   <UserProfile userId={null} />   {/* this throws */}
 * </ErrorBoundary>
 *
 * ─── REQUIREMENTS ─────────────────────────────────────────────────────────────
 * - Implement getDerivedStateFromError(error) — update state to show fallback
 * - Implement componentDidCatch(error, info) — log the error + component stack
 * - Reset state when "Try again" is clicked
 * - If no `fallback` prop is provided, show a default message
 *
 * ─── BUGGY CHILD (for testing — do not modify) ────────────────────────────────
 * function BrokenComponent({ shouldThrow }) {
 *   if (shouldThrow) throw new Error('Boom! Component crashed.');
 *   return <p>Everything is fine.</p>;
 * }
 *
 * ─── INTERVIEWER FOLLOW-UPS ───────────────────────────────────────────────────
 * Be ready to explain:
 *   1. What does Error Boundary catch vs NOT catch?
 *      Catches: render errors, lifecycle errors, constructor errors
 *      Does NOT catch: async errors (setTimeout, fetch), event handler errors,
 *                      errors inside the boundary itself
 *   2. Why can't Error Boundaries be implemented as function components (hooks)?
 *      (No hooks equivalent for getDerivedStateFromError — it's a static lifecycle)
 *   3. What is the difference between getDerivedStateFromError and componentDidCatch?
 *      (getDerivedState = update UI; componentDidCatch = log/report side effects)
 *   4. How do you handle errors in event handlers since boundaries don't catch those?
 *      (try/catch inside the handler + setState to show error UI)
 *   5. What is react-error-boundary (npm package) and what does it add?
 *      (Hooks-friendly wrapper, onError callback, resetKeys prop)
 *
 * ─── YOUR SOLUTION ────────────────────────────────────────────────────────────
 */

import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    // YOUR CODE HERE
  }

  static getDerivedStateFromError(error) {
    // YOUR CODE HERE
  }

  componentDidCatch(error, info) {
    // YOUR CODE HERE
  }

  render() {
    // YOUR CODE HERE
  }
}

// Buggy child for testing — do not modify
function BrokenComponent({ shouldThrow }) {
  if (shouldThrow) throw new Error('Boom! Component crashed.');
  return <p>Everything is fine.</p>;
}

export { ErrorBoundary, BrokenComponent };
