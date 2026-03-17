# Unit Testing — Theory & Interview Prep

## The Testing Pyramid

```
          /\
         /E2E\          Few, slow, expensive — cover critical user journeys
        /------\
       /  Integ  \      Some — verify units work together (API calls, DB, components with context)
      /------------\
     /   Unit Tests  \  Many, fast, cheap — verify individual functions/components
    /------------------\
```

**Ratio at a healthy project:** ~70% unit, ~20% integration, ~10% E2E

**Why the pyramid matters:**
- E2E tests are slow, brittle, expensive to maintain
- Unit tests are fast, isolated, refactor-safe
- Integration tests give confidence without full E2E cost

---

## Types of Tests in Frontend

| Type | What it tests | Tools |
|------|--------------|-------|
| Unit | Pure functions, hooks, isolated components | Jest, Vitest |
| Component | Component rendering + behavior | React Testing Library (RTL) |
| Integration | Components with real context/routing/API | RTL + MSW |
| E2E | Full user flows in a browser | Playwright, Cypress |
| Visual regression | Pixel-level UI changes | Storybook + Chromatic |

---

## Jest Fundamentals

### Core APIs
```js
describe('grouping related tests', () => {
  beforeEach(() => { /* setup */ });
  afterEach(() => { /* teardown */ });

  it('should do something', () => {
    // Arrange
    const input = [1, 2, 3];
    // Act
    const result = sum(input);
    // Assert
    expect(result).toBe(6);
  });
});
```

### jest.fn() vs jest.spyOn() vs jest.mock()

```js
// jest.fn() — create a standalone mock function
const mockFn = jest.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue({ data: [] }); // for async
expect(mockFn).toHaveBeenCalledWith('expected arg');
expect(mockFn).toHaveBeenCalledTimes(1);

// jest.spyOn() — spy on an EXISTING method, can restore original
const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
// ... run test
expect(spy).toHaveBeenCalled();
spy.mockRestore(); // restore original console.error

// jest.mock() — mock an entire module
jest.mock('../api/userApi', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1, name: 'Alice' }),
}));
```

**When to use which:**
- `jest.fn()` → create a dependency from scratch
- `jest.spyOn()` → observe or override an existing method temporarily
- `jest.mock()` → replace entire modules (API clients, third-party libs)

---

## React Testing Library (RTL) — Philosophy

**Core principle:** Test behavior from the user's perspective — not implementation details.

"The more your tests resemble the way your software is used, the more confidence they can give you." — Kent C. Dodds

### Query Priority (in order of preference)
1. `getByRole` — most resilient, matches accessibility tree
2. `getByLabelText` — for form elements
3. `getByPlaceholderText` — use sparingly
4. `getByText` — for non-interactive content
5. `getByDisplayValue` — current value of form elements
6. `getByTestId` — last resort (no semantic meaning)

```jsx
// Bad — tests implementation details
const submitBtn = container.querySelector('.submit-button');

// Good — tests what the user sees
const submitBtn = screen.getByRole('button', { name: /submit/i });
```

### Testing a Component
```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
  it('shows error when submitting empty email', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
  });

  it('calls onSubmit with credentials on valid submit', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'secret');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret',
    });
  });
});
```

---

## Testing Custom Hooks

Use `renderHook` from `@testing-library/react`:

```jsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with given value', () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it('increments the count', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => { result.current.increment(); });
    expect(result.current.count).toBe(1);
  });
});
```

---

## Mocking API Calls — MSW (Mock Service Worker)

MSW intercepts at the network level — more realistic than mocking fetch directly:

```js
// handlers.js
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/user', () => {
    return HttpResponse.json({ id: 1, name: 'Alice' });
  }),
  http.post('/api/login', () => {
    return HttpResponse.json({ token: 'abc123' });
  }),
];

// setupTests.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## What Makes Tests Brittle?

**Brittle tests (avoid):**
- Query by class name or CSS selector
- Assert on exact rendered HTML structure
- Mock time/ids with hardcoded values
- Deeply couple tests to implementation (testing that a specific function was called internally)

**Resilient tests:**
- Query by role, label, accessible text
- Assert on user-visible outcomes ("the error message appears")
- Use `userEvent` over `fireEvent` (more realistic)
- Test what the feature does, not how it does it

---

## Test Coverage

**What coverage measures:** Which lines/branches/functions were executed during tests.
**Healthy level:** 70–80% for most projects; critical paths should be 100%.

**Coverage does NOT tell you:**
- Whether your assertions are correct
- Whether you're testing the right scenarios
- Whether your tests would catch a real bug

**NAB-expected answer:**
> "I aim for 70–80% overall coverage, with near 100% on critical paths like auth, payment flows, and core business logic. But I don't chase the number — a test that just calls a function without asserting anything inflates coverage without value. I'd rather have 60% coverage with meaningful assertions than 95% coverage with empty tests."

---

## Interview Model Answers

### "What is the difference between unit and integration tests?"
> "Unit tests isolate a single piece of logic — a function, a component — from its dependencies. All dependencies are mocked. Integration tests verify that multiple units work correctly together. For frontend, an integration test might render a component with a real Context provider and make real (or MSW-mocked) API calls, asserting on the final UI state. Unit tests are faster and pinpoint exactly where a failure is; integration tests give higher confidence that the system works end-to-end but are slower and harder to debug."

### "Why use React Testing Library over Enzyme?"
> "RTL's philosophy is to test from the user's perspective — querying by role and label rather than by component internals. This means your tests don't break when you refactor the implementation, only when the behavior changes. Enzyme encouraged testing component internals like state and lifecycle methods, which created tight coupling between tests and implementation. RTL also aligns with accessibility — if you can't find an element by role or label, it might mean your component has an accessibility problem."
