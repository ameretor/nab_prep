# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

Interview prep for **NAB Vietnam Senior Frontend/ReactJS** — 3 rounds:
- **Round 1**: Codility test (~90 min, 3 problems, need 2/3 pass, aim 80%+)
- **Round 2**: Technical interview (2 senior engineers, theory-heavy, ~2h, ~50% English, live coding)
- **Round 3**: Lead + EM, culture fit + some technical, 80-100% English

Confirmed NAB interview question: *"Why don't microservices share a single database?"*

## Notes

- Refer to `CLAUDE_NOTES.md` for session memory and progress tracking — read this first at the start of each session

## Running Code

No build system — plain JS/JSX files. Run individual solutions with Node:

```bash
node round1_codility/01_cyclic_rotation.js
node round1_codility/practice/p01_perm_check.js
```

React/JSX files (`round2_interview/live_coding/`) are reference implementations, not runnable directly — no React project setup exists.

## Repository Structure

```
round1_codility/        # Reference solutions for Codility lessons (01–09)
  practice/             # User practice problems (p01, p02, ...)
round2_interview/
  theory.md             # Deep Q&A: React, JS, CSS, architecture
  live_coding/          # Reference implementations (custom hooks, utilities)
CLAUDE_NOTES.md         # Session memory and progress tracker (read this first)
```

## Practice Problem Workflow

1. Create `round1_codility/practice/pNN_name.js` with problem statement, empty `solution()`, and commented-out tests
2. User solves independently, shares code for assessment
3. Assess solution, then push to GitHub
4. Only give the **next problem after the current one is assessed and pushed**

**Problem naming**: `p01`, `p02`, `p03`... sequential

**Problem file structure**:
- Header block with problem statement (cited from Codility), constraints, examples
- Empty or stub `solution()` function
- Commented-out `console.assert` tests at the bottom

**Reference solutions** (in `round1_codility/01_*.js`) follow the same format but include Engineer's Thinking section explaining the approach, complexity, and edge cases.

## Practice Progress

| # | Problem | Lesson | Status |
|---|---------|--------|--------|
| p01 | PermCheck | L4: Counting Elements | ✓ Solved & pushed |
| p02 | (next to give) | — | pending |

Next suggested problems: FrogJmp or CountDiv (Easy, same difficulty level as p01).

## User's Coding Style

- Writes defensive early-return guards (empty/single-element checks)
- Uses `Set` for O(1) membership checks
- Understands range-bounding as a validity check
- Clean, readable code

## Key Conventions

- Codility solutions use vanilla JS (`function solution(...)`) — no imports
- Live coding files use ES module syntax (`import`/`export`)
- Tests use `console.assert` with descriptive failure messages
- All files include a `─── SECTION ───` comment banner style for readability
