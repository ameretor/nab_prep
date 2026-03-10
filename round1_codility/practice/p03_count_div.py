"""
COUNT DIV
Codility — Lesson 5: Prefix Sums
https://app.codility.com/programmers/lessons/5-prefix_sums/count_div/

─── PROBLEM ─────────────────────────────────────────────────────────────────
Compute the number of integers in the range [A, B] that are divisible by K.

Input:
  A — lower bound  (0 ≤ A ≤ B ≤ 2,000,000,000)
  B — upper bound
  K — divisor      (1 ≤ K ≤ 2,000,000,000)

Return the count of integers d where A ≤ d ≤ B and d % K == 0.

Examples:
  A=6,  B=11, K=2  → 3   (6, 8, 10)
  A=0,  B=0,  K=1  → 1   (0 is divisible by any K)
  A=1,  B=1,  K=2  → 0   (1 is not divisible by 2)
  A=0,  B=14, K=3  → 5   (0, 3, 6, 9, 12)

─── CONSTRAINTS ─────────────────────────────────────────────────────────────
- A, B can be 0 — watch out for zero as a valid divisible value
- Range can be up to 2,000,000,000 — a loop is too slow
- Expected time complexity: O(1)
- Expected space complexity: O(1)

─── YOUR SOLUTION ───────────────────────────────────────────────────────────
Write your solution below. Think about:
  1. How many multiples of K exist in [0, B]? (formula involving floor division)
  2. How many multiples of K exist in [0, A-1]?
  3. How do you combine (1) and (2) to get the count for [A, B]?
  4. What edge case does A=0 introduce?
"""


from math import floor


def solution(A, B, K):
    return floor(B / K) - floor((A - 1) / K)


# ─── TESTS (do not modify) ────────────────────────────────────────────────────
# Uncomment these once you have a solution:

# assert solution(6, 11, 2)          == 3, 'Test 1 failed — basic case'
# assert solution(0, 0,  1)          == 1, 'Test 2 failed — zero is divisible'
# assert solution(1, 1,  2)          == 0, 'Test 3 failed — no divisible in range'
# assert solution(0, 14, 3)          == 5, 'Test 4 failed — includes 0'
# assert solution(0, 2000000000, 1)  == 2000000001, 'Test 5 failed — large range, K=1'
# assert solution(1, 2000000000, 2)  == 1000000000, 'Test 6 failed — large even range'
# print('count_div: all tests passed')
