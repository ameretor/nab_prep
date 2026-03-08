/**
 * CYCLIC ROTATION
 * Codility — Lesson 2: Arrays
 * https://app.codility.com/programmers/lessons/2-arrays/cyclic_rotation/
 *
 * ─── PROBLEM ─────────────────────────────────────────────────────────────────
 * An array A consisting of N integers is given. Rotation of the array means
 * that each element is shifted right by one index, and the last element of
 * the array is moved to the first place.
 *
 *   e.g. [3, 8, 9, 7, 6] rotated once → [6, 3, 8, 9, 7]
 *
 * Goal: Write a function that rotates array A by K positions.
 *
 * Input:
 *   A — array of N integers (0 ≤ N ≤ 100, each element in [−1000..1000])
 *   K — number of rotations (0 ≤ K ≤ 100)
 *
 * Output: Array A rotated K times to the right.
 *
 * Example:
 *   A = [3, 8, 9, 7, 6], K = 3 → [9, 7, 6, 3, 8]
 *
 * ─── ENGINEER'S THINKING ─────────────────────────────────────────────────────
 * Naive approach: loop K times, each time shift every element right by 1.
 * That's O(N × K) — fine for the tiny constraints here, but think smarter.
 *
 * Key insight: rotating N elements by K steps is the same as splitting the
 * array at position (N - K % N) and swapping the two halves.
 *
 *   [3, 8, 9 | 7, 6]  ← split here when K=3, N=5 → split at index N-K=2
 *   tail = [7, 6], head = [3, 8, 9]
 *   result = [...tail, ...head] = [9, 7, 6, 3, 8]   ← wait, let me recheck
 *
 * Actually:
 *   k = K % N  (handles K > N edge case)
 *   last k elements move to the front
 *   result = [...A.slice(-k), ...A.slice(0, N - k)]
 *
 * Edge cases to handle:
 *   - Empty array → return []
 *   - K = 0 or K = N → no change, return original
 *   - K > N → use K % N (rotating N times = original)
 *
 * Time: O(N)  Space: O(N)
 *
 * ─── SOLUTION ────────────────────────────────────────────────────────────────
 */
function solution(A, K) {
  if (A.length === 0 || K === 0) return A;
  const k = K % A.length;
  if (k === 0) return A;
  return [...A.slice(-k), ...A.slice(0, A.length - k)];
}

// ─── TESTS ───────────────────────────────────────────────────────────────────
console.assert(JSON.stringify(solution([3,8,9,7,6], 3)) === JSON.stringify([9,7,6,3,8]), 'Test 1 failed');
console.assert(JSON.stringify(solution([1,2,3,4], 4)) === JSON.stringify([1,2,3,4]), 'Test 2 failed — K=N');
console.assert(JSON.stringify(solution([], 3))         === JSON.stringify([]),        'Test 3 failed — empty');
console.assert(JSON.stringify(solution([1], 5))        === JSON.stringify([1]),       'Test 4 failed — single');
console.assert(JSON.stringify(solution([1,2], 5))      === JSON.stringify([2,1]),     'Test 5 failed — K>N');
console.log('01_cyclic_rotation: all tests passed');
