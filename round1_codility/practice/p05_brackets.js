/**
 * BRACKETS
 * Codility — Lesson 7: Stacks and Queues
 * https://app.codility.com/programmers/lessons/7-stacks_and_queues/brackets/
 *
 * ─── PROBLEM ─────────────────────────────────────────────────────────────────
 * Determine whether a string of bracket characters is properly nested.
 *
 * A string is properly nested if:
 *   - Every opening bracket has a matching closing bracket of the same type
 *   - They are correctly ordered (no interleaving)
 *
 * Bracket pairs: () [] {}
 *
 * Input:
 *   S — a string of N characters drawn from '(', ')', '[', ']', '{', '}'
 *       (0 ≤ N ≤ 200,000)
 *
 * Return 1 if S is properly nested, 0 otherwise.
 *
 * Examples:
 *   S = "{[()]()}"   → 1   (properly nested)
 *   S = "([)()]"     → 0   (interleaved, invalid)
 *   S = ""           → 1   (empty string is valid)
 *   S = "("          → 0   (unclosed)
 *   S = ")()"        → 0   (close before open)
 *
 * ─── CONSTRAINTS ─────────────────────────────────────────────────────────────
 * - Input contains only bracket characters
 * - Expected time complexity:  O(N)
 * - Expected space complexity: O(N)
 *
 * ─── HINTS ───────────────────────────────────────────────────────────────────
 * Classic stack problem:
 *   - Push opening brackets onto a stack
 *   - When you see a closing bracket, check if it matches the top of the stack
 *   - At the end, the stack must be empty
 *
 * ─── YOUR SOLUTION ───────────────────────────────────────────────────────────
 */

function solution(S) {
    // write your solution here
}

// ─── TESTS (uncomment once you have a solution) ───────────────────────────────
// console.assert(solution("{[()()]}")  === 1, 'Test 1 failed — valid nested');
// console.assert(solution("([)()]")    === 0, 'Test 2 failed — interleaved');
// console.assert(solution("")          === 1, 'Test 3 failed — empty string');
// console.assert(solution("(")         === 0, 'Test 4 failed — unclosed');
// console.assert(solution(")()")       === 0, 'Test 5 failed — close before open');
// console.assert(solution("((()))")    === 1, 'Test 6 failed — all parens');
// console.assert(solution("{}")        === 1, 'Test 7 failed — single pair');
// console.assert(solution("{]")        === 0, 'Test 8 failed — wrong closing type');
// console.log('brackets: all tests passed');
