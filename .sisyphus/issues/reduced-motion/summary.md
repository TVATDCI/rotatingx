# Reduced Motion Issues — Dependency Graph & Ready Queue

**Project:** rotating-x
**Feature:** prefers-reduced-motion Accessibility Support
**Date:** 2026-05-06
**PRD:** `.sisyphus/prds/reduced-motion-prd.md`

---

## Slice Overview

| Issue ID | Title | Type | Complexity | Status |
|----------|-------|------|------------|--------|
| RM-001 | Hook + Cube Rotation | AFK | Small | Open |
| RM-002 | Button Pulse + HUD Containment | AFK | Small | Open |
| RM-003 | Background Transition Override | AFK | Tiny | Open |

**Total Slices:** 3
**AFK Slices:** 3
**Human-Review Slices:** 0

---

## Dependency Graph

```
RM-001 (Hook + Cube Rotation)
    │
    ▼
RM-002 (Button Pulse + HUD Containment)

RM-003 (Background Transition Override)  ←── independent, no blockers
```

### Blocking Relationships

| Slice | Blocked By | Rationale |
|-------|------------|-----------|
| RM-001 | — | No blockers. Foundational slice that creates the `useReducedMotion` hook. |
| RM-002 | RM-001 | Requires the `useReducedMotion` hook to exist so `App.jsx` can import it and pass `prefersReducedMotion` to `FancyButton` instances. |
| RM-003 | — | No blockers. Pure CSS media query override; independent of all JavaScript changes. |

### Cycle Check
✅ **No dependency cycles detected.** The graph is a simple DAG.

---

## Ready Queue

Slices with no blockers that can start immediately:

1. **RM-001 — Hook + Cube Rotation**
   - Creates the detection hook and integrates it into the cube
   - End-to-end deliverable: cube rotates slowly when reduced motion is preferred

2. **RM-003 — Background Transition Override**
   - Pure CSS media query block
   - End-to-end deliverable: background atmosphere changes are instant when reduced motion is preferred

> **Note:** RM-001 and RM-003 can be worked on in parallel. RM-002 must wait for RM-001 to complete.

---

## PRD Story → Slice Mapping

| PRD Story | Description | Slice |
|-----------|-------------|-------|
| 1.1 | Cube rotation respects reduced motion | RM-001 |
| 1.2 | Button pulse animation respects reduced motion | RM-002 |
| 2.1 | Background transitions become instant | RM-003 |
| 2.2 | CSS containment for paint performance | RM-002 |
| 3.1 | React hook for reduced-motion detection | RM-001 |
| 3.2 | Hook integration in RotatingCube | RM-001 |
| 3.3 | Hook integration in FancyButton | RM-002 |

---

## Next Steps

1. Approve these issues to proceed to execution planning.
2. After approval, delegate to `plan-writer` to create a structured execution plan.
3. RM-001 and RM-003 can begin in parallel once the plan is approved.
