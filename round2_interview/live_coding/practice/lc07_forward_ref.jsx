/**
 * LIVE CODING — lc07: forwardRef + useImperativeHandle
 * Topic: Refs / Imperative API / Component Design
 *
 * ─── TASK ─────────────────────────────────────────────────────────────────────
 * Build a reusable <TextInput /> component that:
 *   1. Forwards the ref to the underlying <input> element (basic forwardRef)
 *   2. BONUS: Uses useImperativeHandle to expose a custom API instead of the
 *      raw DOM node
 *
 * ─── PART A — Basic forwardRef ────────────────────────────────────────────────
 * The parent needs to call inputRef.current.focus() on a button click.
 * Without forwardRef, the ref would point to nothing (function components
 * don't have instances).
 *
 * Usage:
 *   const inputRef = useRef(null);
 *   <TextInput ref={inputRef} placeholder="Type here..." />
 *   <button onClick={() => inputRef.current.focus()}>Focus input</button>
 *
 * ─── PART B — useImperativeHandle ────────────────────────────────────────────
 * Instead of exposing the raw DOM node, expose a controlled API:
 *   inputRef.current.focus()   — focuses the input
 *   inputRef.current.clear()   — clears the input value
 *   inputRef.current.getValue() — returns current value
 *
 * The parent should NOT be able to access any other DOM properties.
 *
 * ─── REQUIREMENTS ─────────────────────────────────────────────────────────────
 * - Part A: wrap the input with forwardRef
 * - Part B: use useImperativeHandle to limit the exposed API to 3 methods
 * - The component should still work as a controlled or uncontrolled input
 *
 * ─── INTERVIEWER FOLLOW-UPS ───────────────────────────────────────────────────
 * Be ready to explain:
 *   1. Why can't you attach a ref to a function component by default?
 *      (Functions have no instance — refs need an object to point to)
 *   2. What is the purpose of useImperativeHandle?
 *      (Limit the API you expose — encapsulation, avoid tight DOM coupling)
 *   3. When would you use forwardRef in a real project?
 *      (Design systems, reusable input/modal/dropdown components)
 *   4. What is the difference between a ref and a callback ref?
 *      (useRef = object; callback ref = fn called with the DOM node on mount/unmount)
 *   5. Can you forward a ref through multiple levels of components?
 *      (Yes — each level must use forwardRef)
 *
 * ─── YOUR SOLUTION ────────────────────────────────────────────────────────────
 */

import { useRef, forwardRef, useImperativeHandle } from 'react';

// Part A — basic forwardRef
const TextInput = forwardRef(function TextInput(props, ref) {
  // YOUR CODE HERE
});

// Part B — with useImperativeHandle
const TextInputControlled = forwardRef(function TextInputControlled(props, ref) {
  // YOUR CODE HERE
});

// Usage demo component
function App() {
  const inputRef = useRef(null);

  return (
    <div>
      <TextInput ref={inputRef} placeholder="Type here..." />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <button onClick={() => inputRef.current.clear()}>Clear</button>
    </div>
  );
}

export default App;
