/**
 * FROG JMP
 * Codility — Lesson 3: Time Complexity
 * https://app.codility.com/programmers/lessons/3-time_complexity/frog_jmp/
 *
 * ─── PROBLEM ─────────────────────────────────────────────────────────────────
 * A small frog wants to get to the other side of a road.
 * The frog is currently located at position X and wants to reach position Y.
 * The frog always jumps a fixed distance D.
 *
 * Goal: Count the minimal number of jumps the frog must make to reach Y
 *       (i.e., reach a position >= Y).
 *
 * Input:
 *   X — starting position (1 ≤ X ≤ 1,000,000,000)
 *   Y — target position   (X ≤ Y ≤ 1,000,000,000)
 *   D — jump distance     (1 ≤ D ≤ 1,000,000,000)
 *
 * Examples:
 *   X=10, Y=85, D=30  → 3   (10→40→70→100, three jumps to reach ≥85)
 *   X=10, Y=10, D=5   → 0   (already at destination)
 *   X=1,  Y=1000000000, D=1 → 999999999
 *
 * ─── CONSTRAINTS ─────────────────────────────────────────────────────────────
 * - If X === Y, return 0 (no jump needed)
 * - Large values: X, Y, D can all be up to 1,000,000,000 — avoid loops
 * - Expected time complexity: O(1)
 * - Expected space complexity: O(1)
 *
 * ─── YOUR SOLUTION ───────────────────────────────────────────────────────────
 * Write your solution below. Think about:
 *   1. How much distance still needs to be covered?
 *   2. How do you calculate the minimum number of jumps using math (not a loop)?
 *   3. What arithmetic operation gives you "ceiling division"?
 */

function solution(X, Y, D) {
  // YOUR CODE HERE
  if (X === Y) return 0;
  const distance = Y - X;
  return Math.ceil(distance / D);
}

// ─── TESTS (do not modify) ────────────────────────────────────────────────────
// Uncomment these once you have a solution:

// console.assert(solution(10, 85, 30)          === 3,         'Test 1 failed — basic case');
// console.assert(solution(10, 10, 5)           === 0,         'Test 2 failed — already there');
// console.assert(solution(1, 1000000000, 1)    === 999999999, 'Test 3 failed — large values');
// console.assert(solution(1, 2, 1)             === 1,         'Test 4 failed — one jump');
// console.assert(solution(5, 10, 3)            === 2,         'Test 5 failed — 5→8→11');
// console.assert(solution(0, 10, 3)            === 4,         'Test 6 failed — 0→3→6→9→12');
// console.log('frog_jmp: all tests passed');
