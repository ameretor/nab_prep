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
│   ├── 01–09_*.js                 ✓ reference solutions
│   └── practice/
│       ├── p01_perm_check.js      ✓ USER SOLVED — assessed, pushed
│       ├── p02_frog_jmp.js        ✓ USER SOLVED — assessed, pushed
│       ├── p03_count_div.py       ✓ USER SOLVED — assessed, pushed
│       ├── p04_max_profit.js      ✓ USER SOLVED — assessed, pushed
│       ├── p05_brackets.js        ✓ USER SOLVED — assessed, pushed
│       └── p06_dominator.js       ✓ USER SOLVED — assessed, pushed
└── round2_interview/
    ├── theory.md                  ✓ full React/JS/CSS/architecture Q&A
    └── live_coding/
        ├── 01–07_*.js/jsx         ✓ reference implementations
        └── practice/
            ├── lc01_use_fetch.jsx     ⏳ given, awaiting solution
            ├── lc02_throttle.js       ⏳ given, awaiting solution
            └── lc03_event_emitter.js  ⏳ given, awaiting solution
```

## Practice Problem Workflow
- Codility: round1_codility/practice/pNN_name.js
- Live coding: round2_interview/live_coding/practice/lcNN_name.js(x)
- User solves, shares code, Claude assesses → push to GitHub

## Codility Practice Progress
| # | Problem | Codility Lesson | Language | Status |
|---|---------|----------------|----------|--------|
| p01 | PermCheck | L4: Counting Elements | JS | ✓ Solved & pushed |
| p02 | FrogJmp | L3: Time Complexity | JS | ✓ Solved & pushed |
| p03 | CountDiv | L5: Prefix Sums | Python | ✓ Solved & pushed — O(1) formula |
| p04 | MaxProfit | L9: Maximum Slice | JS | ✓ Solved & pushed — O(N)/O(1) |
| p05 | Brackets | L7: Stacks & Queues | JS | ✓ Solved & pushed — pairs map + stack |
| p06 | Dominator | L8: Leader | JS | ✓ Solved & pushed — object count, early return |

## Live Coding Practice Progress
| # | Topic | Status |
|---|-------|--------|
| lc01 | useFetch (custom hook + AbortController) | ✓ Solved & pushed — AbortController + finally, 100/100 |
| lc02 | throttle from scratch | ✓ Solved & pushed — Date.now() closure, 100/100 |
| lc03 | EventEmitter (pub/sub) | ⏳ given, awaiting solution |

## Key Assessments
- p03 CountDiv: `floor(B/K) - floor((A-1)/K)` — perfect O(1), 100/100
- p04 MaxProfit: running min tracking, O(N)/O(1), 100/100
- p05 Brackets: pairs map + stack, all edge cases, 100/100
- p06 Dominator: object counting, early return at threshold, 100/100

## User's Coding Style
- Defensive early-return guards
- Object/Set for O(1) lookups
- Clean, minimal, readable
- Strong instinct for edge cases (empty, single element, zero)

## Next Steps
1. User solves lc03 EventEmitter
2. After assessed, give more live coding: useMemo-like memoize, retry with backoff, virtual list
3. Review theory.md for Round 2 theory questions
