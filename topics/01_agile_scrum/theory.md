# Agile / Scrum — Theory & Interview Prep

## Core Concepts

### Scrum Roles
| Role | Responsibility |
|------|---------------|
| Product Owner (PO) | Owns the backlog, defines priorities, represents business value |
| Scrum Master (SM) | Facilitates ceremonies, removes blockers, coaches the team |
| Development Team | Self-organising, cross-functional, delivers the increment |

### Scrum Artifacts
| Artifact | What it is |
|----------|------------|
| Product Backlog | Ordered list of everything the product needs |
| Sprint Backlog | Subset selected for the current sprint + how to deliver it |
| Increment | Potentially shippable product at end of each sprint |

### Scrum Ceremonies
| Ceremony | Duration (2-week sprint) | Purpose |
|----------|------------------------|---------|
| Sprint Planning | ≤ 4h | Select backlog items, define sprint goal, break into tasks |
| Daily Standup | 15 min | Sync: what did I do, what will I do, any blockers? |
| Sprint Review | ≤ 2h | Demo the increment to stakeholders, gather feedback |
| Sprint Retrospective | ≤ 1.5h | Inspect the process: what worked, what didn't, what to improve |
| Backlog Refinement | Ongoing (~1h/week) | Break epics into stories, estimate, clarify ACs |

---

## Key Interview Questions

### Q1: What is the difference between Scrum and Kanban? When would you use each?

**Scrum:**
- Fixed-length sprints (usually 2 weeks)
- Roles: PO, SM, Dev Team
- Ceremonies: planning, standup, review, retro
- Velocity-based planning (story points)
- Best for: product teams building features with regular delivery cadence

**Kanban:**
- No fixed iterations — continuous flow
- No prescribed roles
- WIP (Work in Progress) limits on columns
- Lead time / cycle time are the metrics
- Best for: support/maintenance teams, ops, teams with unpredictable inflow

**How to answer at NAB:**
> "Both are Agile frameworks but for different contexts. Scrum is best when you have a product team delivering features on a regular cadence — you want predictability, sprint goals, and structured planning. Kanban is better for teams with unpredictable inflow like a support team where you can't plan a sprint upfront. In my experience, most product teams at banks use Scrum; support or platform teams often use Kanban."

---

### Q2: How do you handle scope changes mid-sprint?

**The Scrum answer:**
- The sprint goal is fixed once the sprint starts — protect it
- If a stakeholder brings new work mid-sprint:
  1. Evaluate: is it more valuable than current sprint items?
  2. If yes → bring to PO → either add and remove equivalent scope, or defer to next sprint
  3. **Never** silently expand scope — it kills predictability and the team's trust in planning

**How to answer:**
> "Mid-sprint scope changes are a sign the backlog wasn't refined well enough or priorities shifted. I'd flag it to the PO immediately. If it's urgent, we can swap out a similar-effort item to protect the sprint goal. If it can wait, it goes into the backlog for next sprint. What I don't do is silently absorb it — that breaks velocity tracking and teaches the team that sprint commitments aren't real."

---

### Q3: What is Definition of Done vs Acceptance Criteria?

| | Definition of Done (DoD) | Acceptance Criteria (AC) |
|--|--------------------------|--------------------------|
| Scope | Applies to ALL stories | Specific to ONE story |
| Defined by | Team + SM | Product Owner / BA |
| Content | Code reviewed, tests written, deployed to staging, no critical bugs | The specific "given/when/then" conditions this story must meet |
| Purpose | Quality gate — ensures the increment is releasable | Determines if the story is "done from the business perspective" |

**Example DoD:**
- Unit tests written and passing
- Code reviewed by at least 1 peer
- No lint errors
- Deployed to staging
- Acceptance criteria verified by PO

---

### Q4: What is velocity? How do you use it?

- **Velocity** = sum of story points completed per sprint
- Used for **forecasting**, not as a performance metric
- Average velocity over 3–4 sprints → used for sprint planning
- "How much can we take on next sprint?" → use historical average, don't overcommit

**Senior nuance to add:**
> "Velocity is a planning tool, not a KPI. Comparing velocity across teams is meaningless because story point scales differ. I've seen managers try to 'increase velocity' by inflating estimates — it breaks the whole system. The real goal is consistent, predictable delivery."

---

### Q5: What happens when a sprint fails to deliver?

- Incomplete items go back to the Product Backlog — they are NOT automatically in the next sprint
- Hold a retrospective to understand root cause: unclear ACs, poor estimates, blockers?
- Common causes: scope crept, stories too large, dependencies not managed
- **Don't just re-add without renegotiating** — re-estimate, re-clarify, re-prioritize

---

## Agile at NAB — What They Actually Want to Hear

NAB uses Agile explicitly in job descriptions. They have cross-timezone collaboration with Australia, meaning:
- **Sprint ceremonies are sometimes time-shifted** — you've had to work async
- **Communication across timezones** requires clear, written handoffs
- **Retrospectives matter** — they want engineers who improve the process, not just follow it

Key things to mention in your interview:
1. You've worked in 2-week sprint cycles
2. You participate in refinement (breaking epics into estimable stories)
3. You use story points (Fibonacci: 1, 2, 3, 5, 8, 13, 21)
4. You've identified impediments and raised them in standups
5. You contribute to retrospectives — give specific examples of process improvements

---

## Practice Exercise

**Scenario question (common in Round 2/3):**

> "Your team is mid-sprint. A senior manager says a critical bug fix is needed immediately and should be added to the sprint. The fix would take 3 days. You have 4 days left in the sprint. What do you do?"

Write out your full answer before reading the model:

**Model answer:**
1. Acknowledge the urgency: "Understood, let me get the right people involved."
2. Loop in the Scrum Master and Product Owner immediately.
3. Assess: Is this truly critical (production down, data risk) or urgent-but-deferrable?
4. If truly critical: swap out a 3-point story from the sprint with PO approval; update the sprint backlog; communicate to the team so the sprint goal is adjusted.
5. If deferrable: create a story, prioritize to top of backlog, commit in next sprint.
6. Raise in retro: "We got hit mid-sprint — how do we better handle critical issues? Do we need a bug-fix buffer each sprint?"
