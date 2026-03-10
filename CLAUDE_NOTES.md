# NAB Vietnam Senior Frontend Interview Prep

## Project Context
User is preparing for NAB Vietnam Senior Frontend/ReactJS interview (3 rounds).
Working directory: /home/nab_prep
GitHub repo: https://github.com/ameretor/nab_prep.git (branch: main)

## Interview Structure (Researched)
- Round 1: Codility — 3 problems (~2 easy + 1 medium). Need 2/3 pass. ~90 min.
- Round 2: Technical interview — 2 senior engineers, theory-heavy, 2+ hours, ~50% English. Live coding included.
- Round 3: Lead + Engineering Manager, 80-100% English, culture fit + some technical.
- Confirmed NAB question: "Why don't microservices share a single database?"

## Key NAB Interview Notes
- Theory-heavy: study React/JS fundamentals deeply, not just practical
- Score 80%+ on Codility to be safe
- Downgrade from Senior to Middle possible if tech round weak

## Repo Structure (current)
```
/home/nab_prep/
├── round1_codility/
│   ├── 01_cyclic_rotation.js      ✓ reference solution + explained
│   ├── 02_odd_occurrences.js      ✓
│   ├── 03_tape_equilibrium.js     ✓
│   ├── 04_max_counters.js         ✓
│   ├── 05_missing_integer.js      ✓
│   ├── 06_passing_cars.js         ✓
│   ├── 07_brackets.js             ✓
│   ├── 08_fish.js                 ✓
│   ├── 09_distinct.js             ✓
│   └── practice/
│       ├── p01_perm_check.js      ✓ USER SOLVED — assessed, pushed
│       ├── p02_frog_jmp.js        ✓ USER SOLVED — assessed, pushed
│       ├── p03_count_div.py       ✓ USER SOLVED — assessed, pushed
│       ├── p04_max_profit.js      ⏳ given, awaiting user solution
│       └── p05_brackets.js        ⏳ given, awaiting user solution
└── round2_interview/
    ├── theory.md                  ✓ full React/JS/CSS/architecture Q&A
    └── live_coding/
        ├── 01_use_debounce.js
        ├── 02_use_local_storage.js
        ├── 03_search_with_debounce.jsx
        ├── 04_modal_portal.jsx
        ├── 05_compound_tabs.jsx
        ├── 06_promise_all_from_scratch.js
        └── 07_deep_clone_flatten.js
```

## Practice Problem Workflow
- Problem files: round1_codility/practice/pNN_name.js
- Naming: p01, p02, p03... (sequential)
- File contains: problem statement (cited) + empty solution() + commented-out tests
- User solves, shares code, Claude assesses → push to GitHub
- Next problem only given AFTER current one is assessed and pushed

## Practice Progress
| # | Problem | Codility Lesson | Language | Status |
|---|---------|----------------|----------|--------|
| p01 | PermCheck | L4: Counting Elements | JS | ✓ Solved & pushed |
| p02 | FrogJmp | L3: Time Complexity | JS | ✓ Solved & pushed |
| p03 | CountDiv | L5: Prefix Sums | Python | ✓ Solved & pushed — O(1) formula, perfect |
| p04 | MaxProfit | L9: Maximum Slice | JS | ✓ Solved & pushed — O(N)/O(1), tracking min, 100/100 |
| p05 | Brackets | L7: Stacks & Queues | JS | ✓ Solved & pushed — pairs map + stack, 100/100 |

## p03 Assessment (CountDiv)
Solution: `floor(B / K) - floor((A - 1) / K)`
- Correct O(1) formula — prefix sums concept applied arithmetically
- Python's `math.floor` handles A=0 cleanly: floor(-1/K) = -1, giving correct +1 for zero
- All edge cases covered. Score: 100/100.

## User's Coding Style (observed from p01–p03)
- Writes defensive early-return guards (e.g. empty/single element checks)
- Uses Set for O(1) membership checks — good instinct
- Understands range-bounding as a validity check
- Clean, readable code
- Can apply mathematical formulas cleanly (p03)

## p04 Assessment (MaxProfit)
Solution: track running min, compute `A[i] - min` at each step, keep max.
- O(N) time, O(1) space. Defensive guard for len < 2. Score: 100/100.

## p05 Assessment (Brackets)
Solution: pairs map `{')':'(', ...}`, push openers, pop+match closers, return `stack.length === 0`.
- O(N) time, O(N) space. All edge cases handled cleanly. Score: 100/100.

## Next Steps
1. Next: p06 — suggest Dominator (L8: Leader) or MinAvgTwoSlice (L5: Prefix Sums)
2. After ~6-7 practice problems, shift focus to Round 2 live coding practice
3. Study theory.md for Round 2 theory questions
