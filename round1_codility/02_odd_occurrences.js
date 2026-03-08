/**
 * ODD OCCURRENCES IN ARRAY
 * Codility — Lesson 2: Arrays
 * https://app.codility.com/programmers/lessons/2-arrays/odd_occurrences_in_array/
 *
 * ─── PROBLEM ─────────────────────────────────────────────────────────────────
 * A non-empty, zero-indexed array A of N integers is given. The array contains
 * an odd number of elements. Each element of the array can be paired with
 * another element that has the same value, except for one element that is left
 * unpaired.
 *
 * Goal: Find the unpaired element.
 *
 * Input:
 *   A — array of N integers (N is odd, 1 ≤ N ≤ 1,000,000)
 *   Each element is an integer in [1..1,000,000,000]
 *   All values appear an even number of times except one
 *
 * Example:
 *   A = [9, 3, 9, 3, 9, 7, 9]
 *   9 appears 4 times, 3 appears 2 times, 7 appears 1 time → return 7
 *
 * ─── ENGINEER'S THINKING ─────────────────────────────────────────────────────
 * First instinct: use a hash map to count frequency, then find key with odd count.
 * That works — O(N) time, O(N) space.
 *
 * But there's a beautiful O(1) space trick using XOR (^):
 *   Properties of XOR:
 *     a ^ a = 0        (same values cancel out)
 *     a ^ 0 = a        (identity)
 *     XOR is commutative and associative
 *
 *   So: 9 ^ 9 ^ 3 ^ 3 ^ 7 = 0 ^ 0 ^ 7 = 7
 *   XOR all elements together — every paired element cancels to 0.
 *   Only the unpaired element remains.
 *
 * This is a classic interview trick. Mentioning it shows senior-level intuition.
 *
 * Time: O(N)  Space: O(1)
 *
 * ─── SOLUTION ────────────────────────────────────────────────────────────────
 */
function solution(A) {
  return A.reduce((acc, n) => acc ^ n, 0);
}

// ─── TESTS ───────────────────────────────────────────────────────────────────
console.assert(solution([9,3,9,3,9,7,9]) === 7,  'Test 1 failed');
console.assert(solution([1])             === 1,  'Test 2 failed — single element');
console.assert(solution([1,2,1])         === 2,  'Test 3 failed');
console.assert(solution([7,7,7])         === 7,  'Test 4 failed — all same');
console.log('02_odd_occurrences: all tests passed');
