# Decisions Log: reduced-motion

> Plan: `.sisyphus/plans/reduced-motion.md`
> PRD: `.sisyphus/prds/reduced-motion-prd.md`

---

## Decision 1: React hook + CSS media query hybrid approach

**Status:** Pre-approved in PRD
**Rationale:** rAF speed requires JS intervention. CSS transitions are cleaner to override in a media query. The hybrid gives each concern the right tool.

---

## Decision 2: Cap cube speed rather than freeze entirely

**Status:** Pre-approved in PRD
**Rationale:** A near-static drift (0.02deg/frame = ~1.2deg/sec) preserves the 3D identity of the application without triggering vestibular issues. A completely frozen cube looks like a bug.
**Tuning parameter:** If users report discomfort, reduce to 0.01 or 0.005 in a follow-up.

---

## Decision 3: Pass `prefersReducedMotion` as prop rather than Context

**Status:** Pre-approved in PRD, reinforced by Momus review finding
**Rationale:** `FancyButton` is a presentational component that already receives configuration via props. `RotatingCube` is a container-like component that owns its own animation logic, so using the hook directly is appropriate. This avoids Context overhead for a single boolean flag and prevents multiple media-query listeners.
**Ownership model:** `App.jsx` is the single owner of the `useReducedMotion` hook call. It passes the boolean as a prop to `FancyButton`. No Context, no direct hook calls in presentational components.
**Migration threshold:** If prop drilling depth exceeds 2 layers in future, migrate to React Context.

---

## Decision 4: Include CSS containment in this plan

**Status:** Pre-approved in PRD, scoped by Momus review
**Rationale:** The containment is trivial (one line) and directly supports the paint-performance goal of reduced-motion work. The near-term roadmap already lists containment as a next item. Combining it avoids separate PRD overhead.
**Scope boundary:** If `contain: layout paint` clips corner accents, fallback to `contain: layout` only. This fallback is pre-approved and does not require plan revision.

---

## Decision 5: Path B — No test runner, manual QA default

**Status:** Made during plan revision (Momus Gate 2 recheck)
**Rationale:** The project has no test runner configured (ESLint v10 + flat-config incompatibility is a separate pre-existing issue). Setting up a test runner would expand scope beyond the reduced-motion feature. Path B defers the hook unit test to a follow-up issue and uses Chrome DevTools emulation + console assertions for verification.
**Outcome:** Manual QA verified all acceptance criteria successfully. Path B was the right call for bounded scope.

---

## Decision 6: Suppress `transform: translateY(-2px)` hover, not just `hudPulse`

**Status:** Discovered during plan review, implemented in Wave 2
**Rationale:** Momus plan reviewer (E-2) caught that disabling only the `hudPulse` animation still leaves `transform: translateY(-2px)` with a `0.3s` transition on hover. This is still motion during interaction, which contradicts the accessibility goal.
**Fix:** Expanded RM-002 to also suppress the hover transform when `prefersReducedMotion` is true.

---

## Decision 7: Legacy Safari API fallback for `matchMedia`

**Status:** Implemented in Wave 1
**Rationale:** Older Safari versions (pre-14) use `addListener`/`removeListener` instead of `addEventListener`/`removeEventListener` for media query change events. The hook includes both APIs to avoid silent failures on live toggles.
**Code:** `useReducedMotion.js` lines 28-39

---

## Decision 8: `contain: layout paint` applied without clipping

**Status:** Implemented in Wave 2, verified no regressions
**Rationale:** The `.glass-panel` corner accents (`position: absolute` children) remained fully visible after applying containment. No fallback to `contain: layout` was needed.
**Verification:** Visual regression check passed during RM-002 verification.

