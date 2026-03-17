// ─── React Practice lc01: Split Context for Performance ──────────────────────
//
// PROBLEM:
// The component below has a performance bug — every component that reads the
// ThemeContext re-renders whenever EITHER theme OR user changes.
//
// TASK:
// 1. Identify the bug
// 2. Split the context into ThemeContext and UserContext
// 3. Ensure that a component reading only ThemeContext does NOT re-render when
//    the user changes, and vice versa.
//
// Reference file — not runnable directly (no React project setup).
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, memo } from 'react';

// ─── BUGGY VERSION ───────────────────────────────────────────────────────────

const AppContext = createContext();

function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState({ name: 'Alice', role: 'customer' });

  // BUG: new object on every render even if theme didn't change
  return (
    <AppContext.Provider value={{ theme, setTheme, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

// This component only cares about theme — but re-renders on user changes too
const ThemeDisplay = memo(function ThemeDisplay() {
  const { theme } = useContext(AppContext);
  console.log('ThemeDisplay rendered'); // will log too often
  return <div>Current theme: {theme}</div>;
});

// ─────────────────────────────────────────────────────────────────────────────
// YOUR TASK: Refactor below
// ─────────────────────────────────────────────────────────────────────────────

// Step 1: Create two separate contexts
// const ThemeContext = createContext();
// const UserContext = createContext();

// Step 2: Create two providers (or a combined provider that wraps two contexts)

// Step 3: Create two custom hooks for clean consumption
// function useTheme() { ... }
// function useUser() { ... }

// Step 4: ThemeDisplay should only subscribe to ThemeContext
// — verify by clicking "Update User" and confirming ThemeDisplay does NOT re-render

// ─── EXAMPLE USAGE ───────────────────────────────────────────────────────────
// function App() {
//   return (
//     <AppProvider>
//       <ThemeDisplay />
//       <UserDisplay />
//       <Controls />
//     </AppProvider>
//   );
// }
