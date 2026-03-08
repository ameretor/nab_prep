/**
 * PERM CHECK
 * Codility — Lesson 4: Counting Elements
 * https://app.codility.com/programmers/lessons/4-counting_elements/perm_check/
 *
 * ─── PROBLEM ─────────────────────────────────────────────────────────────────
 * A non-empty array A of N integers is given.
 *
 * A permutation is a sequence containing each element from 1 to N once and
 * only once.
 *
 * Goal: Check whether array A is a permutation of [1, 2, ..., N].
 *       Return 1 if it is, 0 if it is not.
 *
 * Input:
 *   A — array of N integers (1 ≤ N ≤ 100,000)
 *   Each element is an integer in [1..1,000,000,000]
 *
 * Examples:
 *   A = [4, 1, 3, 2]  → 1   (contains 1,2,3,4 exactly once — valid permutation)
 *   A = [4, 1, 3]     → 0   (missing 2, has 3 elements but max is 4)
 *   A = [1]           → 1   (single element [1] is a valid permutation of N=1)
 *   A = [1, 1]        → 0   (duplicate)
 *
 * ─── CONSTRAINTS ─────────────────────────────────────────────────────────────
 * - N is the length of the array, so the valid values must be exactly 1..N
 * - Any value greater than N immediately disqualifies the array
 * - Any duplicate immediately disqualifies the array
 *
 * ─── YOUR SOLUTION ───────────────────────────────────────────────────────────
 * Write your solution below. Think about:
 *   1. What data structure helps you check membership efficiently?
 *   2. What are ALL the conditions that make an array NOT a permutation?
 *   3. What is the expected time and space complexity?
 */

function solution(A) {
  // YOUR CODE HERE
  if (A.length === 0) return 0; // empty array is not a permutation
  if (A.length === 1) return A[0] === 1 ? 1 : 0; // single element must be 1

  const seen = new Set();
  for (const num of A) {
    if (num < 1 || num > A.length) return 0; // out of valid range
    if (seen.has(num)) return 0; // duplicate found
    seen.add(num);
  }
  return 1; // all checks passed, it's a permutation

}

// ─── TESTS (do not modify) ────────────────────────────────────────────────────
// Uncomment these once you have a solution:

// console.assert(solution([4,1,3,2]) === 1, 'Test 1 failed — valid permutation');
// console.assert(solution([4,1,3])   === 0, 'Test 2 failed — missing 2');
// console.assert(solution([1])       === 1, 'Test 3 failed — single element');
// console.assert(solution([1,1])     === 0, 'Test 4 failed — duplicate');
// console.assert(solution([2,3,4,5]) === 0, 'Test 5 failed — missing 1');
// console.assert(solution([1,2,3,5]) === 0, 'Test 6 failed — gap in middle');
// console.log('perm_check: all tests passed');
