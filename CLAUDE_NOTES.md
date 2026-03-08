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
│       └── p01_perm_check.js      ✓ USER SOLVED — assessed, pushed
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
| # | Problem | Codility Lesson | Status |
|---|---------|----------------|--------|
| p01 | PermCheck | L4: Counting Elements | ✓ Solved & pushed |
| p02 | (not given yet) | — | pending |

## User's Coding Style (observed from p01)
- Writes defensive early-return guards (e.g. empty/single element checks)
- Uses Set for O(1) membership checks — good instinct
- Understands range-bounding as a validity check
- Clean, readable code

## Next Steps (when user returns tonight)
1. Give p02 — next practice problem (suggest: FrogJmp or CountDiv, same Easy level)
2. Continue one-by-one practice → assess → push workflow
3. After ~5 practice problems, move to Round 2 live coding practice
