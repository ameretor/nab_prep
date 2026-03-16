/**
 * LIVE CODING — lc09: useContext + Context Performance Trap
 * Topic: Context API / Re-render Patterns / Provider Design
 *
 * ─── TASK ─────────────────────────────────────────────────────────────────────
 * Build a theme switcher (light/dark) using Context.
 * Then fix the performance problem that naive Context usage introduces.
 *
 * ─── PART A — Basic Context ───────────────────────────────────────────────────
 * 1. Create a ThemeContext with { theme: 'light' | 'dark', toggleTheme: fn }
 * 2. Create a <ThemeProvider /> component
 * 3. Create a useTheme() custom hook that throws if used outside the provider
 * 4. Use it in <Header /> and <Button /> components
 *
 * ─── PART B — The Performance Trap ───────────────────────────────────────────
 * Problem: every component that calls useTheme() re-renders whenever ANYTHING
 * in the context value changes — even if the part they use didn't change.
 *
 * Demonstrate the problem: add a `count` to the context value. Now every
 * keystroke (count changes) forces Header and Button to re-render.
 *
 * Fix: split the context into two:
 *   - ThemeStateContext  — { theme } — rarely changes
 *   - ThemeActionsContext — { toggleTheme } — stable (useCallback)
 *
 * Components subscribe only to what they need.
 *
 * ─── USAGE EXAMPLE ────────────────────────────────────────────────────────────
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <Header />
 *       <main>
 *         <Button />
 *       </main>
 *     </ThemeProvider>
 *   );
 * }
 *
 * ─── REQUIREMENTS ─────────────────────────────────────────────────────────────
 * - useTheme() must throw a helpful error if called outside <ThemeProvider>
 * - toggleTheme must be stable (useCallback) — not a new function each render
 * - Part B: split into state + actions contexts to prevent unnecessary re-renders
 *
 * ─── INTERVIEWER FOLLOW-UPS ───────────────────────────────────────────────────
 * Be ready to explain:
 *   1. What is the key performance problem with Context API?
 *      (All consumers re-render when context value changes, even if their
 *       slice of data didn't change — no selector support like Redux/Zustand)
 *   2. How does splitting contexts into state + actions fix it?
 *   3. Why wrap toggleTheme in useCallback inside the provider?
 *   4. When would you reach for Zustand or Redux over Context?
 *      (When many components need independent slices of global state — selectors)
 *   5. What does React.memo do when a component uses useContext?
 *      (It does NOT help — memo only skips re-renders from props, not context)
 *
 * ─── YOUR SOLUTION ────────────────────────────────────────────────────────────
 */

import { createContext, useContext, useState, useCallback } from 'react';

// Part A — single context (has a performance issue)
const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  // YOUR CODE HERE
}

function useTheme() {
  // YOUR CODE HERE — include out-of-provider error check
}

// Part B — split into two contexts
const ThemeStateContext = createContext(null);
const ThemeActionsContext = createContext(null);

function ThemeProviderOptimized({ children }) {
  // YOUR CODE HERE
}

export { ThemeProvider, useTheme, ThemeProviderOptimized };
