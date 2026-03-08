/**
 * MAX COUNTERS
 * Codility — Lesson 4: Counting Elements
 * https://app.codility.com/programmers/lessons/4-counting_elements/max_counters/
 *
 * ─── PROBLEM ─────────────────────────────────────────────────────────────────
 * You have N counters, all initially set to 0. You are given M operations in
 * array A. Each operation is one of:
 *
 *   increase(X)  — if 1 ≤ A[i] ≤ N: counter X is incremented by 1
 *   max counter  — if A[i] = N+1: all counters are set to the current maximum
 *
 * Goal: Return the final state of the counters after all operations.
 *
 * Input:
 *   N   — number of counters (1 ≤ N ≤ 100,000)
 *   A   — array of M operations (1 ≤ M ≤ 100,000), each value in [1..N+1]
 *
 * Example:
 *   N=5, A=[3, 4, 4, 6, 1, 4, 4]
 *   After (3)→ [0,0,1,0,0]
 *   After (4)→ [0,0,1,1,0]
 *   After (4)→ [0,0,1,2,0]
 *   After (6)→ [2,2,2,2,2]  ← max counter (N+1=6), max was 2
 *   After (1)→ [3,2,2,2,2]
 *   After (4)→ [3,2,2,3,2]
 *   After (4)→ [3,2,2,4,2]
 *   Answer: [3, 2, 2, 4, 2]
 *
 * ─── ENGINEER'S THINKING ─────────────────────────────────────────────────────
 * Naive: When max counter fires, loop through all N counters and set each.
 * That's O(N) per max_counter op. Worst case: M max_counter ops → O(N×M). TLE.
 *
 * Better — lazy propagation:
 *   Track two variables:
 *     currentMax  — the highest any single counter has ever reached
 *     lastMax     — the value set by the most recent max_counter operation
 *
 *   On increase(X):
 *     Before incrementing, ensure counter[X] is at least lastMax.
 *     Then increment. Update currentMax.
 *
 *   On max_counter:
 *     Just record lastMax = currentMax. Don't touch the array yet.
 *
 *   At the end:
 *     Any counter still below lastMax must be raised to lastMax.
 *
 * Key insight: we defer the "set all counters" work until the very end,
 * doing it once in O(N) instead of potentially M times.
 *
 * Time: O(N + M)  Space: O(N)
 *
 * ─── SOLUTION ────────────────────────────────────────────────────────────────
 */
function solution(N, A) {
  const counters = new Array(N).fill(0);
  let currentMax = 0;
  let lastMax = 0;

  for (const op of A) {
    if (op >= 1 && op <= N) {
      // increase(op)
      const idx = op - 1;
      counters[idx] = Math.max(counters[idx], lastMax) + 1;
      currentMax = Math.max(currentMax, counters[idx]);
    } else {
      // max counter
      lastMax = currentMax;
    }
  }

  // Final pass: apply lastMax to any counter that hasn't been touched since
  return counters.map(c => Math.max(c, lastMax));
}

// ─── TESTS ───────────────────────────────────────────────────────────────────
console.assert(
  JSON.stringify(solution(5, [3,4,4,6,1,4,4])) === JSON.stringify([3,2,2,4,2]),
  'Test 1 failed'
);
console.assert(
  JSON.stringify(solution(3, [2,2,2,2])) === JSON.stringify([0,4,0]),
  'Test 2 failed — no max counter'
);
console.assert(
  JSON.stringify(solution(2, [3,3,3])) === JSON.stringify([0,0]),
  'Test 3 failed — all max counter ops'
);
console.log('04_max_counters: all tests passed');
