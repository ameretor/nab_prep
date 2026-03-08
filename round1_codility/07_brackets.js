/**
 * BRACKETS
 * Codility — Lesson 7: Stacks and Queues
 * https://app.codility.com/programmers/lessons/7-stacks_and_queues/brackets/
 *
 * ─── PROBLEM ─────────────────────────────────────────────────────────────────
 * A string S consisting of N characters is considered properly nested if:
 *   - S is empty
 *   - S has the form "(U)", "[U]" or "{U}" where U is properly nested
 *   - S has the form "VW" where V and W are both properly nested
 *
 * Goal: Given a string S of brackets, return 1 if it is properly nested, 0 otherwise.
 * Only characters '(', ')', '[', ']', '{', '}' appear in S.
 *
 * Input:
 *   S — string of 0 to 200,000 bracket characters
 *
 * Examples:
 *   "{[()()]}" → 1 (valid)
 *   "([)()]"   → 0 (invalid, wrong order)
 *   ""         → 1 (empty is valid)
 *
 * ─── ENGINEER'S THINKING ─────────────────────────────────────────────────────
 * This is the canonical stack problem. The pattern is natural:
 *   - When we see an opening bracket → push it, we'll need to match it later.
 *   - When we see a closing bracket → the most recent unmatched opening bracket
 *     (top of stack) MUST be the corresponding opener. If not, invalid.
 *   - At the end: stack must be empty (no unmatched openers left).
 *
 * Use a lookup map for cleaner matching instead of if-else chains.
 *
 * Edge cases:
 *   - Empty string → valid (return 1)
 *   - Starts with a closing bracket → stack will be empty when we try to pop → invalid
 *   - Only openers → stack not empty at end → invalid
 *
 * Time: O(N)  Space: O(N)
 *
 * ─── SOLUTION ────────────────────────────────────────────────────────────────
 */
function solution(S) {
  const stack = [];
  const match = { ')': '(', ']': '[', '}': '{' };

  for (const ch of S) {
    if ('([{'.includes(ch)) {
      stack.push(ch);
    } else {
      // closing bracket — must match the last opener
      if (stack.pop() !== match[ch]) return 0;
    }
  }

  return stack.length === 0 ? 1 : 0;
}

// ─── TESTS ───────────────────────────────────────────────────────────────────
console.assert(solution('{[()()]}') === 1, 'Test 1 failed — valid nested');
console.assert(solution('([)()]')   === 0, 'Test 2 failed — wrong order');
console.assert(solution('')         === 1, 'Test 3 failed — empty string');
console.assert(solution('((')       === 0, 'Test 4 failed — unclosed openers');
console.assert(solution('))')       === 0, 'Test 5 failed — only closers');
console.assert(solution('()')       === 1, 'Test 6 failed — simple valid');
console.log('07_brackets: all tests passed');
