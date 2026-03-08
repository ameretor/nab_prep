/**
 * TAPE EQUILIBRIUM
 * Codility — Lesson 3: Time Complexity
 * https://app.codility.com/programmers/lessons/3-time_complexity/tape_equilibrium/
 *
 * ─── PROBLEM ─────────────────────────────────────────────────────────────────
 * A non-empty array A of N integers is given. Each integer represents a number
 * written on tape. Any integer P such that 0 < P < N splits the tape into two
 * non-empty parts:
 *
 *   Left:  A[0] + A[1] + ... + A[P−1]
 *   Right: A[P] + A[P+1] + ... + A[N−1]
 *
 * Goal: Find the minimal absolute difference between the sums of the two parts.
 *
 * Input:
 *   A — array of N integers (2 ≤ N ≤ 100,000)
 *   Each element in [−1000..1000]
 *
 * Example:
 *   A = [3, 1, 2, 4, 3]
 *   P=1: |3 − 10| = 7
 *   P=2: |4 − 9|  = 5
 *   P=3: |6 − 7|  = 1  ← minimum
 *   P=4: |10 − 3| = 7
 *   Answer: 1
 *
 * ─── ENGINEER'S THINKING ─────────────────────────────────────────────────────
 * Naive: For every split position P, sum both sides → O(N²). Too slow for N=100k.
 *
 * Better: Prefix sum / running sum approach.
 *   1. Compute the total sum of the array once.
 *   2. Walk left to right, maintaining a running leftSum.
 *   3. At each position P, rightSum = totalSum − leftSum.
 *   4. Track the minimum |leftSum − rightSum|.
 *
 * This is the core "prefix sum" pattern — compute once, query O(1).
 * P must satisfy 0 < P < N, so we iterate P from 1 to N−1 (never include the
 * full array on one side).
 *
 * Time: O(N)  Space: O(1)
 *
 * ─── SOLUTION ────────────────────────────────────────────────────────────────
 */
function solution(A) {
  const total = A.reduce((sum, x) => sum + x, 0);
  let leftSum = 0;
  let minDiff = Infinity;

  for (let p = 0; p < A.length - 1; p++) {
    leftSum += A[p];
    const rightSum = total - leftSum;
    minDiff = Math.min(minDiff, Math.abs(leftSum - rightSum));
  }

  return minDiff;
}

// ─── TESTS ───────────────────────────────────────────────────────────────────
console.assert(solution([3, 1, 2, 4, 3]) === 1, 'Test 1 failed');
console.assert(solution([1, 2])           === 1, 'Test 2 failed — minimum N');
console.assert(solution([-1, 1])          === 2, 'Test 3 failed — negatives');
console.assert(solution([5, 5, 5, 5])     === 0, 'Test 4 failed — equal halves');
console.log('03_tape_equilibrium: all tests passed');
