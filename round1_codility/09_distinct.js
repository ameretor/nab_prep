/**
 * DISTINCT
 * Codility — Lesson 6: Sorting
 * https://app.codility.com/programmers/lessons/6-sorting/distinct/
 *
 * ─── PROBLEM ─────────────────────────────────────────────────────────────────
 * Write a function that, given an array A of N integers, returns the number of
 * distinct values in array A.
 *
 * Input:
 *   A — array of N integers (0 ≤ N ≤ 100,000)
 *   Each element in [−1,000,000..1,000,000]
 *
 * Example:
 *   A = [2, 1, 1, 2, 3, 1] → 3  (distinct values: {1, 2, 3})
 *
 * ─── ENGINEER'S THINKING ─────────────────────────────────────────────────────
 * This is arguably the simplest Codility problem — but it tests whether you
 * know your data structures.
 *
 * Option 1 — Sort + count transitions: O(N log N)
 *   Sort the array. Count how many times the value changes.
 *   Clean and avoids auxiliary space, but slower.
 *
 * Option 2 — Set: O(N)
 *   A Set in JavaScript automatically deduplicates. Just insert everything and
 *   return the size.
 *   This is the idiomatic, readable, optimal solution for this constraint size.
 *
 * Edge case:
 *   - Empty array → 0 distinct values (Set.size returns 0 naturally).
 *
 * Time: O(N)  Space: O(N)
 *
 * ─── SOLUTION ────────────────────────────────────────────────────────────────
 */
function solution(A) {
  return new Set(A).size;
}

// Bonus — sort-based approach (good to know for constrained-space environments):
function solutionSort(A) {
  if (A.length === 0) return 0;
  const sorted = [...A].sort((a, b) => a - b);
  let count = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1]) count++;
  }
  return count;
}

// ─── TESTS ───────────────────────────────────────────────────────────────────
console.assert(solution([2,1,1,2,3,1]) === 3, 'Test 1 failed');
console.assert(solution([])             === 0, 'Test 2 failed — empty array');
console.assert(solution([5])            === 1, 'Test 3 failed — single element');
console.assert(solution([1,1,1,1])      === 1, 'Test 4 failed — all same');
console.assert(solution([1,2,3,4])      === 4, 'Test 5 failed — all distinct');
console.assert(solutionSort([2,1,1,2,3,1]) === 3, 'SortTest 1 failed');
console.log('09_distinct: all tests passed');
