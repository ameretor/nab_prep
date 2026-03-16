# lc04 — useRef + Stale Closure Fix
**Topic:** useRef / setInterval / Stale Closures
**Final Score: 90 / 100**

---

## What Was Excellent

- `intervalRef = useRef(null)` — correct usage; stores interval ID without triggering re-renders
- `setCount(prev => prev + 1)` — correctly avoids the stale closure bug (Method A)
- `clearInterval(intervalRef.current)` — correct global function call
- Cleanup `return () => clearInterval(intervalRef.current)` — no memory leak on unmount
- Single `isRunning` boolean — clean, correct state design
- `handleReset` correctly stops interval then resets count
- JSX renders all three buttons and the counter display

---

## Minor Issues (-10)

### 1. Redundant null guard
```jsx
// Unnecessary — clearInterval(null) is a safe no-op
if (intervalRef.current) {
  clearInterval(intervalRef.current)
}

// ✓ Fine to write directly:
clearInterval(intervalRef.current)
```

### 2. Unnecessary arrow wrapper on handleReset
```jsx
// ❌ Redundant wrapper
<button onClick={() => handleReset()}>Reset</button>

// ✓ Pass directly
<button onClick={handleReset}>Reset</button>
```

### 3. No unit in display
`<span>{count}s</span>` makes it immediately clear to the user it's seconds.

---

## Potential Interview Trap — Double Start Click

An interviewer may ask: *"What happens if the user clicks Start twice?"*

**The concern:** A second `setInterval` created before clearing the first = two intervals running.

**Why your code is safe:** `isRunning` is a boolean. Clicking Start when it's already `true`
calls `setIsRunning(true)` with the same value — React bails out, no re-render, no effect re-run.

**The correct answer to give verbally:**
> "React won't re-run the effect because the state value didn't change — boolean true to true is
> bailed out by React's state diffing. But if I used a non-boolean trigger, I'd guard with
> `if (intervalRef.current) return` inside the isRunning branch."

---

## Follow-up Questions to Nail

1. **Why `useRef` over `useState` for interval ID?**
   `useState` triggers a re-render on change. Storing an interval ID in state would re-render the
   component (and re-run effects) for no visual reason.

2. **Why does `setCount(prev => prev + 1)` fix stale closure?**
   React passes the *current* state value as `prev` at call time — the callback doesn't need to
   close over the stale `count` variable from the outer render.

3. **How would you extract this into a `useInterval(callback, delay)` custom hook?**
   Store the callback in a ref so it's always fresh, and manage the interval lifecycle internally.
   Dan Abramov's `useInterval` hook is the canonical example.
