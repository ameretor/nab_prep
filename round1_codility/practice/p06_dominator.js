/**
 * DOMINATOR
 * Codility — Lesson 8: Leader
 * https://app.codility.com/programmers/lessons/8-leader/dominator/
 *
 * ─── PROBLEM ─────────────────────────────────────────────────────────────────
 * Find the index of an element that dominates the array — i.e., an element
 * that occurs more than N/2 times.
 *
 * Return any index of the dominating element.
 * If no dominator exists, return -1.
 *
 * Input:
 *   A — array of N integers (0 ≤ N ≤ 100,000, each element in range [-2^31, 2^31-1])
 *
 * Examples:
 *   A = [3, 4, 3, 2, 3, -1, 3, 3]  → 0, 2, 4, 6, or 7  (3 appears 5/8 times)
 *   A = [2, 2, 2, 5, 2]            → 0, 1, 2, or 4      (2 appears 4/5 times)
 *   A = [1, 2, 3, 1, 2, 3]         → -1                  (no dominator)
 *   A = []                          → -1
 *   A = [5]                         → 0                   (single element always dominates)
 *
 * ─── CONSTRAINTS ─────────────────────────────────────────────────────────────
 * - Return ANY valid index (not a specific one) — Codility accepts any correct index
 * - Strictly more than N/2 occurrences required (not N/2 exactly)
 * - Expected time complexity:  O(N)
 * - Expected space complexity: O(1) or O(N) — both accepted
 *
 * ─── HINTS ───────────────────────────────────────────────────────────────────
 * O(N) space approach: use a Map/object to count occurrences, then check if
 * any value exceeds N/2. Simple and readable.
 *
 * O(1) space (Boyer-Moore Voting): the dominator — if it exists — survives a
 * "cancel out" process where you pair each non-matching element against the
 * current candidate and reduce a count. Whatever's left is the candidate;
 * then verify it actually appears > N/2 times.
 *
 * ─── YOUR SOLUTION ───────────────────────────────────────────────────────────
 */

function solution(A) {
    // write your solution here
}

// ─── TESTS (uncomment once you have a solution) ───────────────────────────────
// const validIdx = (A, result, dominator) =>
//     result === -1 ? true : A[result] === dominator;
//
// console.assert([0,2,4,6,7].includes(solution([3,4,3,2,3,-1,3,3])), 'Test 1 failed');
// console.assert([0,1,2,4].includes(solution([2,2,2,5,2])),           'Test 2 failed');
// console.assert(solution([1,2,3,1,2,3])  === -1,                     'Test 3 failed — no dominator');
// console.assert(solution([])             === -1,                     'Test 4 failed — empty');
// console.assert(solution([5])            === 0,                      'Test 5 failed — single element');
// console.assert(solution([1,1])          === 0 || solution([1,1]) === 1, 'Test 6 failed — two same');
// console.assert(solution([1,2])          === -1,                     'Test 7 failed — two different');
// console.log('dominator: all tests passed');
