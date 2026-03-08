/**
 * PASSING CARS
 * Codility — Lesson 5: Prefix Sums
 * https://app.codility.com/programmers/lessons/5-prefix_sums/passing_cars/
 *
 * ─── PROBLEM ─────────────────────────────────────────────────────────────────
 * A zero-indexed array A of N integers is given. It contains only 0s and 1s:
 *   0 = car travelling east
 *   1 = car travelling west
 *
 * A pair of cars (P, Q) is "passing" if P < Q, A[P]=0, A[Q]=1
 * (an eastbound car at position P will eventually pass a westbound car at Q).
 *
 * Goal: Count the number of passing pairs. Return -1 if the count > 1,000,000,000.
 *
 * Input:
 *   A — array of N integers (1 ≤ N ≤ 100,000), values are 0 or 1
 *
 * Example:
 *   A = [0, 1, 0, 1, 1]
 *   Pairs: (0,1),(0,3),(0,4),(2,3),(2,4) → 5
 *
 * ─── ENGINEER'S THINKING ─────────────────────────────────────────────────────
 * Brute force: two nested loops — every (P, Q) pair. O(N²). TLE for N=100k.
 *
 * Prefix sum insight:
 *   Every eastbound car (0) at index P will pass ALL westbound cars (1) that
 *   come after it. So, for each westbound car at index Q, the number of pairs
 *   it contributes equals the number of eastbound cars seen so far (before Q).
 *
 *   Algorithm:
 *     Walk left to right.
 *     If A[i] = 0 → increment eastCount.
 *     If A[i] = 1 → add eastCount to total (this westbound car pairs with all
 *                    previous eastbound cars).
 *
 * This is prefix sums in spirit: we accumulate a "count of 0s so far" and
 * use it as a multiplier for each 1 we encounter.
 *
 * Don't forget: return -1 if total exceeds 1,000,000,000.
 *
 * Time: O(N)  Space: O(1)
 *
 * ─── SOLUTION ────────────────────────────────────────────────────────────────
 */
function solution(A) {
  const LIMIT = 1_000_000_000;
  let eastCount = 0;
  let total = 0;

  for (const car of A) {
    if (car === 0) {
      eastCount++;
    } else {
      total += eastCount;
      if (total > LIMIT) return -1;
    }
  }

  return total;
}

// ─── TESTS ───────────────────────────────────────────────────────────────────
console.assert(solution([0, 1, 0, 1, 1]) === 5,  'Test 1 failed');
console.assert(solution([0])              === 0,  'Test 2 failed — no westbound');
console.assert(solution([1])              === 0,  'Test 3 failed — no eastbound');
console.assert(solution([0, 1])           === 1,  'Test 4 failed — one pair');
console.assert(solution([1, 0])           === 0,  'Test 5 failed — no pair (wrong order)');
// Large input triggering -1
console.assert(solution(new Array(100000).fill(0).concat(new Array(100000).fill(1))), 'Test 6 — large');
console.log('06_passing_cars: all tests passed');
