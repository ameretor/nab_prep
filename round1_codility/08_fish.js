/**
 * FISH
 * Codility — Lesson 7: Stacks and Queues
 * https://app.codility.com/programmers/lessons/7-stacks_and_queues/fish/
 *
 * ─── PROBLEM ─────────────────────────────────────────────────────────────────
 * N fish are swimming in a river, each with a size and direction:
 *   A[i] = size of the i-th fish (all distinct)
 *   B[i] = direction: 0 = upstream (left), 1 = downstream (right)
 *
 * Collision rules:
 *   - Two fish meet when one goes downstream (1) and a later fish goes upstream (0).
 *   - The larger fish eats the smaller and continues in its direction.
 *   - Fish travelling the same direction never meet.
 *
 * Goal: Return the number of fish that will ultimately survive.
 *
 * Input:
 *   A — array of N integers: fish sizes (1 ≤ A[i] ≤ 1,000,000,000, all distinct)
 *   B — array of N integers: directions (0 or 1)
 *   1 ≤ N ≤ 100,000
 *
 * Example:
 *   A = [4, 3, 2, 1, 5], B = [0, 1, 0, 0, 0]
 *   Fish 1 (size 3, →) eats fish 2 (size 2, ←), then eats fish 3 (size 1, ←)
 *   Fish 4 (size 5, ←) eats fish 1 (size 3, →)
 *   Survivors: fish 0 (size 4, ←) and fish 4 (size 5, ←) → answer: 2
 *
 * ─── ENGINEER'S THINKING ─────────────────────────────────────────────────────
 * Model the river as a stack of downstream (→) fish that haven't yet met an
 * upstream (←) fish.
 *
 * Walk left to right through the array:
 *
 *   If fish goes downstream (B[i]=1):
 *     It can't eat anything to its left (they're already past it or going same way).
 *     Push it onto the stack — it's a "pending threat" for future upstream fish.
 *
 *   If fish goes upstream (B[i]=0):
 *     It will collide with every downstream fish in the stack (in reverse order).
 *     While stack is non-empty: compare sizes.
 *       - If stack top (downstream fish) is bigger → upstream fish dies. Break.
 *       - If upstream fish is bigger → downstream fish dies. Pop stack, continue.
 *     If the stack empties (upstream fish survived all encounters) → count it as survivor.
 *
 * At the end: all fish remaining in the stack survived (no upstream fish to fight).
 * Total survivors = upstreamSurvivors + stack.length.
 *
 * Time: O(N)  Space: O(N)
 *
 * ─── SOLUTION ────────────────────────────────────────────────────────────────
 */
function solution(A, B) {
  const downstream = []; // stack of downstream fish sizes
  let upstreamSurvivors = 0;

  for (let i = 0; i < A.length; i++) {
    if (B[i] === 1) {
      // Going downstream — push as a future threat
      downstream.push(A[i]);
    } else {
      // Going upstream — fight every downstream fish in the stack
      let survived = true;
      while (downstream.length > 0) {
        if (downstream[downstream.length - 1] > A[i]) {
          // Downstream fish wins, upstream fish dies
          survived = false;
          break;
        } else {
          // Upstream fish wins, eat the downstream fish
          downstream.pop();
        }
      }
      if (survived) upstreamSurvivors++;
    }
  }

  return upstreamSurvivors + downstream.length;
}

// ─── TESTS ───────────────────────────────────────────────────────────────────
console.assert(solution([4,3,2,1,5], [0,1,0,0,0]) === 2, 'Test 1 failed');
console.assert(solution([1,2,3,4,5], [0,0,0,0,0]) === 5, 'Test 2 failed — all upstream, no fights');
console.assert(solution([1,2,3,4,5], [1,1,1,1,1]) === 5, 'Test 3 failed — all downstream, no fights');
console.assert(solution([1,5],       [1,0])        === 1, 'Test 4 failed — bigger eats smaller');
console.assert(solution([5,1],       [1,0])        === 1, 'Test 5 failed — downstream wins');
console.assert(solution([2,1],       [0,0])        === 2, 'Test 6 failed — no collision same direction');
console.log('08_fish: all tests passed');
