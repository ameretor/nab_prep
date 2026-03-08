/**
 * MISSING INTEGER
 * Codility — Lesson 4: Counting Elements
 * https://app.codility.com/programmers/lessons/4-counting_elements/missing_integer/
 *
 * ─── PROBLEM ─────────────────────────────────────────────────────────────────
 * Write a function that, given an array A of N integers, returns the smallest
 * positive integer (greater than 0) that does not occur in A.
 *
 * Input:
 *   A — array of N integers (1 ≤ N ≤ 100,000)
 *   Each element in [−1,000,000..1,000,000]
 *
 * Examples:
 *   A = [1, 3, 6, 4, 1, 2] → 5
 *   A = [1, 2, 3]           → 4
 *   A = [−1, −3]            → 1
 *
 * ─── ENGINEER'S THINKING ─────────────────────────────────────────────────────
 * Brute force: check 1, 2, 3... against the array each time → O(N²).
 *
 * Smarter: Put all values in a Set (O(1) lookup), then scan from 1 upward.
 *
 * Key observations:
 *   - We only care about positive integers.
 *   - The answer is always in the range [1..N+1].
 *     Why? If all integers 1..N are present, the answer is N+1.
 *     Otherwise, the answer is somewhere in 1..N.
 *   - Negative numbers and zeros are irrelevant — skip them.
 *
 * This bounds our search and ensures we stop quickly.
 *
 * Alternative: sort the array, then linear scan. O(N log N) — works but Set is cleaner.
 *
 * Time: O(N)  Space: O(N)
 *
 * ─── SOLUTION ────────────────────────────────────────────────────────────────
 */
function solution(A) {
  const present = new Set(A.filter(x => x > 0));
  let i = 1;
  while (present.has(i)) i++;
  return i;
}

// ─── TESTS ───────────────────────────────────────────────────────────────────
console.assert(solution([1, 3, 6, 4, 1, 2]) === 5, 'Test 1 failed');
console.assert(solution([1, 2, 3])           === 4, 'Test 2 failed — consecutive from 1');
console.assert(solution([-1, -3])            === 1, 'Test 3 failed — all negative');
console.assert(solution([2, 3, 4])           === 1, 'Test 4 failed — missing 1');
console.assert(solution([1])                 === 2, 'Test 5 failed — single element');
console.log('05_missing_integer: all tests passed');
