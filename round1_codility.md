# Round 1: Codility Test Preparation

## What to Expect
- 3 coding problems (typical: 2 Easy + 1 Medium, or 1 Easy + 2 Medium)
- ~90 minutes total
- Need to pass at least 2/3 with high score (aim for 100% on 2)
- Language: JavaScript (preferred for frontend role)
- Results visible immediately

---

## Strategy
1. Read ALL 3 problems first, budget your time.
2. Solve easy problems completely before attempting medium.
3. Write clean code with edge case handling — Codility scores on correctness + performance.
4. Watch out for: empty arrays, single elements, negative numbers, large inputs (O(n²) will TLE).

---

## Top Codility Problem Categories (by frequency)

### 1. Arrays & Prefix Sums
**Key patterns**: prefix sum, two-pointer, sliding window

```js
// Prefix sum template
function prefixSum(arr) {
  const prefix = [0];
  for (let i = 0; i < arr.length; i++) {
    prefix.push(prefix[i] + arr[i]);
  }
  return prefix;
}
// rangeSum(l, r) = prefix[r+1] - prefix[l]
```

**Practice problems**:
- CyclicRotation (rotate array right by K)
- OddOccurrencesInArray (XOR trick)
- TapeEquilibrium (min diff of two-part split)
- MaxCounters (counter array with max operation)
- MissingInteger (find smallest positive missing)
- PassingCars (count pairs going opposite directions)

---

### 2. Sorting & Searching
```js
// Sort and check adjacent for duplicates
function hasDuplicates(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted.some((v, i) => i > 0 && v === sorted[i - 1]);
}
```

**Practice problems**:
- Distinct (count unique values)
- MaxProductOfThree (sort and check extremes)
- Triangle (check if triangle exists from sorted triplet)
- NumberOfDiscIntersections

---

### 3. Stacks & Queues
**Key pattern**: bracket matching, monotonic stack

```js
// Bracket matching template
function isBalanced(s) {
  const stack = [];
  const map = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if ('([{'.includes(ch)) stack.push(ch);
    else if (stack.pop() !== map[ch]) return false;
  }
  return stack.length === 0;
}
```

**Practice problems**:
- Brackets (nesting validation)
- Fish (stack to simulate fish survival)
- StoneWall (monotonic stack)

---

### 4. String Manipulation
```js
// Anagram check
function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;
  const freq = {};
  for (const c of s1) freq[c] = (freq[c] || 0) + 1;
  for (const c of s2) {
    if (!freq[c]) return false;
    freq[c]--;
  }
  return true;
}

// Palindrome check
const isPalindrome = s => s === s.split('').reverse().join('');
```

**Practice problems**:
- Anagram detection
- String rotation check
- Longest substring without repeating characters

---

### 5. Greedy Algorithms
```js
// Greedy: always take optimal local choice
// Example: minimum number of coins
function minCoins(amount, coins) {
  coins.sort((a, b) => b - a); // large first
  let count = 0;
  for (const coin of coins) {
    count += Math.floor(amount / coin);
    amount %= coin;
  }
  return amount === 0 ? count : -1;
}
```

**Practice problems**:
- MaxNonOverlappingSegments
- TieRopes (merge ropes greedily)

---

### 6. Dynamic Programming (Medium level)
```js
// Fibonacci / DP template
function dp(n) {
  const memo = new Array(n + 1).fill(-1);
  function solve(i) {
    if (i <= 1) return i;
    if (memo[i] !== -1) return memo[i];
    memo[i] = solve(i - 1) + solve(i - 2);
    return memo[i];
  }
  return solve(n);
}
```

**Practice problems**:
- NumberSolitaire (DP with dice)
- MinAbsSum (subset sum variant)
- FibFrog (BFS/DP)

---

## JavaScript Tricks to Know Cold

```js
// ES6+ you'll use constantly
const unique = arr => [...new Set(arr)];
const sum = arr => arr.reduce((a, b) => a + b, 0);
const max = arr => Math.max(...arr);
const min = arr => Math.min(...arr);
const range = (n) => Array.from({ length: n }, (_, i) => i);

// XOR trick: a ^ a = 0, a ^ 0 = a
// Finds the single non-duplicated number
const singleNumber = arr => arr.reduce((acc, n) => acc ^ n, 0);

// Two-pointer
function twoSum(arr, target) {
  let l = 0, r = arr.length - 1;
  while (l < r) {
    const s = arr[l] + arr[r];
    if (s === target) return [l, r];
    if (s < target) l++; else r--;
  }
  return [];
}

// Sliding window for substring problems
function longestSubstringKDistinct(s, k) {
  const freq = {};
  let l = 0, maxLen = 0;
  for (let r = 0; r < s.length; r++) {
    freq[s[r]] = (freq[s[r]] || 0) + 1;
    while (Object.keys(freq).length > k) {
      freq[s[l]]--;
      if (freq[s[l]] === 0) delete freq[s[l]];
      l++;
    }
    maxLen = Math.max(maxLen, r - l + 1);
  }
  return maxLen;
}
```

---

## Practice Plan (1 Week Before Test)

| Day | Focus | Platform |
|-----|-------|----------|
| Day 1 | Arrays, Prefix Sums | Codility Lessons 1-3 |
| Day 2 | Sorting, Searching | Codility Lessons 4-6 |
| Day 3 | Stacks/Queues, Strings | Codility Lessons 7-9 |
| Day 4 | Greedy + DP basics | LeetCode Easy/Medium |
| Day 5 | Full mock test (timed 90 min) | Codility Demo Test |
| Day 6 | Review mistakes + edge cases | — |
| Day 7 | Light review only | — |

**Resources**:
- https://app.codility.com/programmers/lessons/ (official lessons)
- https://app.codility.com/demo/take-sample-test/ (practice test)
- LeetCode: "Easy" and "Medium" tagged problems
