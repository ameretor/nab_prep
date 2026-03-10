/**
 * MAX PROFIT
 * Codility — Lesson 9: Maximum Slice Problem
 * https://app.codility.com/programmers/lessons/9-maximum_slice_problem/max_profit/
 *
 * ─── PROBLEM ─────────────────────────────────────────────────────────────────
 * Given a log of daily stock prices (array A of N integers), find the maximum
 * profit from a single buy-then-sell transaction where you must buy before you sell.
 *
 * Return 0 if no profit is possible (prices only go down or stay flat).
 *
 * Input:
 *   A — array of N integers, each representing the stock price on day i
 *       (0 ≤ A[i] ≤ 200,000)
 *       (0 ≤ N ≤ 400,000)
 *
 * Examples:
 *   A = [23171, 21011, 21123, 21366, 21013, 21367]  → 356  (buy at 21011, sell at 21367)
 *   A = [5, 4, 3, 2, 1]                              → 0   (only decreasing, no profit)
 *   A = [1, 2]                                        → 1
 *   A = []                                            → 0   (empty)
 *   A = [7]                                           → 0   (single element)
 *
 * ─── CONSTRAINTS ─────────────────────────────────────────────────────────────
 * - You must buy before you sell (index i < j)
 * - If no profit is possible, return 0 (never return negative)
 * - Expected time complexity:  O(N)
 * - Expected space complexity: O(1)
 *
 * ─── HINTS ───────────────────────────────────────────────────────────────────
 * Think about tracking the minimum price seen so far as you scan left-to-right.
 * At each step, the best profit you could make selling today = today's price - min_so_far.
 *
 * ─── YOUR SOLUTION ───────────────────────────────────────────────────────────
 */

function solution(A) {
    // write your solution here
}

// ─── TESTS (uncomment once you have a solution) ───────────────────────────────
// console.assert(solution([23171, 21011, 21123, 21366, 21013, 21367]) === 356, 'Test 1 failed');
// console.assert(solution([5, 4, 3, 2, 1])                           === 0,   'Test 2 failed — only decreasing');
// console.assert(solution([1, 2])                                     === 1,   'Test 3 failed — two elements');
// console.assert(solution([])                                         === 0,   'Test 4 failed — empty');
// console.assert(solution([7])                                        === 0,   'Test 5 failed — single element');
// console.assert(solution([1, 5, 3, 8, 2])                           === 7,   'Test 6 failed — buy at 1, sell at 8');
// console.log('max_profit: all tests passed');
