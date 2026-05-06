# Learnings Log: reduced-motion

> Plan: `.sisyphus/plans/reduced-motion.md`
> PRD: `.sisyphus/prds/reduced-motion-prd.md`

---

## Learning Template

| Field | Value |
|-------|-------|
| **ID** | L-NNN |
| **Slice** | RM-00N |
| **What** | |
| **So What** | |
| **Now What** | |
| **Date** | |

---

## Learnings

### L-001: The two-gate Momus architecture catches issues single-review misses

| Field | Value |
|-------|-------|
| **ID** | L-001 |
| **Slice** | All |
| **What** | `momus-prd-reviewer` and `momus-plan-reviewer` found different, complementary issues. PRD reviewer caught requirements contradictions (FancyButton ownership, scope creep). Plan reviewer caught execution blockers (live toggle gap, residual button movement, dependency chain gaps). |
| **So What** | A single combined reviewer would have missed execution-level issues that only appear when mapping requirements to actual code paths. The split into two focused skills provides genuine value. |
| **Now What** | Keep the two-gate architecture (PRD review → plan review) in all future workflows. Do not collapse back to a single reviewer. |
| **Date** | 2026-05-06 |

### L-002: Plan review is iterative — expect multiple passes

| Field | Value |
|-------|-------|
| **ID** | L-002 |
| **Slice** | All |
| **What** | The plan required 3 review passes: v1 FAIL (3 major), v2 WARNING (1 partial), v3 PASS. Each pass found real issues that improved the plan. |
| **So What** | A single review pass is insufficient for complex plans. The `fix_then_recheck` cycle is productive, not wasteful. Each iteration makes the plan more executable. |
| **Now What** | Budget for 2-3 review passes in planning timelines. Don't treat a FAIL as failure — treat it as calibration. |
| **Date** | 2026-05-06 |

### L-003: Prop drilling is acceptable for shallow trees

| Field | Value |
|-------|-------|
| **ID** | L-003 |
| **Slice** | RM-002 |
| **What** | Passing `prefersReducedMotion` through `App → MultiplePlayer → FancyButton` (2 layers) is clean and explicit. No Context boilerplate needed. |
| **So What** | Context is not always the right answer for prop passing. For shallow trees with few consumers, explicit prop drilling is more readable and traceable. |
| **Now What** | Document the migration threshold (depth > 2 layers) and stick with props until then. |
| **Date** | 2026-05-06 |

### L-004: Legacy browser APIs need explicit fallback

| Field | Value |
|-------|-------|
| **ID** | L-004 |
| **Slice** | RM-001 |
| **What** | `matchMedia.addEventListener` is modern, but older Safari uses `addListener`. Without the fallback, live toggles would silently fail on some browsers. |
| **So What** | Browser compatibility assumptions in PRDs often assume "modern enough" without defining what that means. The plan reviewer (F-1) correctly flagged this. |
| **Now What** | Always include legacy API fallbacks for `matchMedia`, `fetch`, and other browser APIs that evolved. Document the supported browser matrix explicitly. |
| **Date** | 2026-05-06 |

### L-005: Accessibility requires suppressing ALL motion, not just animation

| Field | Value |
|-------|-------|
| **ID** | L-005 |
| **Slice** | RM-002 |
| **What** | Disabling only `hudPulse` keyframe animation still leaves `transform: translateY(-2px)` hover movement with a `0.3s` transition. This is still motion. |
| **So What** | "Reduced motion" means ALL motion, not just CSS `@keyframes`. Any `transform`, `transition`, or JS-driven movement must be gated. |
| **Now What** | When implementing `prefers-reduced-motion`, audit ALL motion sources: `@keyframes`, `transition`, `transform`, `requestAnimationFrame`, SVG animations, canvas animations. |
| **Date** | 2026-05-06 |

