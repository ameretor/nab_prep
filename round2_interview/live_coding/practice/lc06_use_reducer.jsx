/**
 * LIVE CODING — lc06: useReducer
 * Topic: useReducer / Complex State / Action Patterns
 *
 * ─── TASK ─────────────────────────────────────────────────────────────────────
 * Build a shopping cart using useReducer (NOT useState).
 *
 * The cart should support:
 *   - ADD_ITEM    — add a product; if already in cart, increase quantity
 *   - REMOVE_ITEM — remove a product entirely
 *   - INCREMENT   — increase quantity of an item by 1
 *   - DECREMENT   — decrease quantity; if it hits 0, remove the item
 *   - CLEAR_CART  — empty the cart
 *
 * ─── STATE SHAPE ──────────────────────────────────────────────────────────────
 * {
 *   items: [
 *     { id: 1, name: 'Laptop', price: 999, quantity: 2 },
 *     ...
 *   ]
 * }
 *
 * ─── USAGE EXAMPLE ────────────────────────────────────────────────────────────
 * function App() {
 *   const { state, dispatch } = useCart();
 *
 *   return (
 *     <>
 *       <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: { id: 1, name: 'Laptop', price: 999 } })}>
 *         Add Laptop
 *       </button>
 *       <button onClick={() => dispatch({ type: 'INCREMENT', payload: { id: 1 } })}>+</button>
 *       <button onClick={() => dispatch({ type: 'DECREMENT', payload: { id: 1 } })}>-</button>
 *       <p>Total: ${state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)}</p>
 *     </>
 *   );
 * }
 *
 * ─── REQUIREMENTS ─────────────────────────────────────────────────────────────
 * - Write the reducer function (pure — no side effects)
 * - Write a useCart() custom hook that wraps useReducer
 * - The reducer must return new state objects — never mutate
 * - Handle the DECREMENT-to-zero → remove case cleanly
 *
 * ─── INTERVIEWER FOLLOW-UPS ───────────────────────────────────────────────────
 * Be ready to explain:
 *   1. When should you use useReducer instead of useState?
 *      (Answer: when next state depends on previous state + complex transitions)
 *   2. Why must the reducer be a pure function?
 *   3. useReducer + useContext is often compared to Redux. What's missing?
 *      (middleware, DevTools, async action handling out of the box)
 *   4. How does Redux Toolkit's createSlice relate to this pattern?
 *   5. What is the dispatch function's identity — does it change between renders?
 *      (It's stable — same reference always. Safe to put in useEffect deps)
 *
 * ─── YOUR SOLUTION ────────────────────────────────────────────────────────────
 */

import { useReducer } from 'react';

const initialState = {
  items: [],
};

// YOUR CODE HERE — write the reducer
function cartReducer(state, action) {
}

// YOUR CODE HERE — write the custom hook
function useCart() {
}

export { useCart };
