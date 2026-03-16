# Arrow vs Regular Functions in React

## Short Answer

React doesn't care — both work. But there are concrete reasons why **named function declarations are preferred** for components and custom hooks in professional codebases.

---

## Why `this` Doesn't Decide This

The main arrow-vs-regular difference (lexical `this`) is **irrelevant** in functional React. Functional components and hooks never use `this` — that's a class component concern. So the real decision factors are:

1. Hoisting
2. Stack traces and debugging
3. Fast Refresh / HMR compatibility
4. Community convention

---

## Components

### Arrow function (common, especially inline)

```jsx
const Button = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);

export default Button;
```

### Function declaration (preferred)

```jsx
export default function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}
```

### Why function declarations win for components

#### 1. Hoisting — organize file top-down

```jsx
// With function declarations: you can use components before they're defined
// This lets you write the "important" part of a file at the top

export default function Dashboard() {
  return (
    <div>
      <Header />   {/* used here */}
      <Sidebar />  {/* used here */}
    </div>
  );
}

function Header() { ... }   // defined below — fine, hoisted
function Sidebar() { ... }  // defined below — fine, hoisted

// With arrow functions: must define before use (not hoisted)
// const Header = () => { ... }  // must come BEFORE Dashboard
```

#### 2. Stack traces — better error messages

```jsx
// Arrow function — anonymous, stack trace shows "Anonymous"
const Button = () => { throw new Error('oops'); };

// Function declaration — named, stack trace shows "Button"
function Button() { throw new Error('oops'); }

// In practice, bundlers often infer the name from the const assignment,
// but it's not guaranteed — especially with complex HOC wrapping
const Button = React.memo(() => { throw new Error('oops'); }); // "Anonymous"
const Button = React.memo(function Button() { ... }); // "Button" — always named
```

#### 3. Fast Refresh (HMR) — critical for dev experience

React Fast Refresh (the hot reload in Create React App, Vite, Next.js) requires components to be **named** to work correctly. Anonymous default exports break it.

```jsx
// Breaks Fast Refresh — anonymous default arrow
export default () => <div>Hello</div>;

// Works — named function
export default function Hello() { return <div>Hello</div>; }

// Works — named arrow (name is attached)
const Hello = () => <div>Hello</div>;
export default Hello;
```

---

## Custom Hooks

### Function declaration (strongly preferred in the ecosystem)

```javascript
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  // ...
  return debouncedValue;
}
```

### Arrow function (works, but less conventional)

```javascript
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  // ...
  return debouncedValue;
};
```

### Why function declarations win for hooks

**Convention:** React's own docs, `react-use`, `@tanstack/react-query`, `swr` — all use function declarations for hooks. If an interviewer looks at your code, function declarations signal familiarity with the ecosystem.

**Stack traces:** Hook errors show the hook name in the trace, making debugging easier.

**Linting:** ESLint's `react-hooks` plugin identifies hooks by the `use` prefix. Both styles work, but function declarations play better with some lint configurations.

---

## The One Place Arrow Functions Are Actually Better

### Inline callbacks inside JSX

```jsx
function Form() {
  return (
    <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </form>
  );
}
```

Inline event handlers are always arrows — you wouldn't write `function(e) { ... }` inline. `this` doesn't matter here because it's inside a functional component already.

### Callbacks inside hooks

```javascript
useEffect(() => {
  // arrows are the natural style for hook callbacks
  const timer = setTimeout(() => doSomething(), 1000);
  return () => clearTimeout(timer);
}, []);
```

---

## Summary Table

| Context | Preferred | Reason |
|---------|-----------|--------|
| Component definition | `function MyComponent()` | Hoisting, stack traces, Fast Refresh |
| Custom hook definition | `function useMyHook()` | Convention, stack traces |
| Default export component | `export default function Foo()` | Fast Refresh compatibility |
| Inline JSX callback | `onClick={() => ...}` | Arrow is natural here |
| Hook callbacks (`useEffect`, `useMemo`) | Arrow | Short, `this` irrelevant |
| HOC-wrapped components | `React.memo(function Foo() {...})` | Keeps name in stack trace |

---

## What to Say in the Interview

> "For functional components and custom hooks, I prefer named function declarations. Not because of `this` — that's irrelevant in functional React — but for hoisting, better stack traces, and Fast Refresh compatibility. Anonymous default arrow exports can silently break hot reload. For inline event handlers and hook callbacks, arrows are the natural choice since they're concise and `this` doesn't come into play."

---

## Live Coding Habit

When writing components or hooks during the interview, default to:

```jsx
// Component
export function MyComponent({ prop }) {
  return <div>{prop}</div>;
}

// Hook
export function useMyHook(value) {
  const [state, setState] = useState(value);
  return state;
}
```

This is what React docs write. Interviewers recognize it immediately as idiomatic.
