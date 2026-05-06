# Momus Plan Review: reduced-motion
**Date:** 2026-05-06
**Artifacts reviewed:**
- Plan: `/home/vladi/projects/GitHub/rotating-x/.sisyphus/plans/reduced-motion.md`
- PRD: `/home/vladi/projects/GitHub/rotating-x/.sisyphus/prds/reduced-motion-prd.md`

## Summary
**Gate Decision:** FAIL
**Blocker count:** 4 total (0 critical, 4 major, 0 minor)

The plan fixes two PRD-review problems: it freezes the `FancyButton` path to prop drilling via `App`/`MultiplePlayer`, and it no longer depends on out-of-scope unit-test infrastructure. But it still leaves four execution blockers that would cause the implementation to miss its own reduced-motion acceptance if followed literally.

### Top 3 Risks
1. **Mid-session reduced-motion toggles will not actually slow the cube** — the slice only changes initial speed and future mouse handling, so an already-fast cube can stay fast after the preference flips.
2. **Buttons still animate on hover in reduced-motion mode** — the plan removes `hudPulse` only, but the current button hover also moves upward via `transform`, leaving interaction motion in place.
3. **FancyButton work is sliced as if it were independently verifiable** — the plan schedules button prop plumbing later, but the only live `FancyButton` instances are inside `MultiplePlayer`, so Slice 1.3 cannot be verified in-app when claimed.

## Detailed Findings
### D. Dependency Gaps
D-1: MAJOR — `FancyButton` slice is not independently verifiable
- Location: Wave 1 / Slice 1.3; Wave 3 / Slices 3.1-3.2
- Evidence: "With Reduce Motion ON, hovering a `FancyButton` shows static glow but no pulse" / "pass `prefersReducedMotion` to `MultiplePlayer`" / "forward to both PLAY/PAUSE button and track selector buttons"
- Gap: Slice 1.3 declares only `Slice 1.1` as a dependency, but the running app only renders `FancyButton` through `MultiplePlayer`. Until Slices 3.1 and 3.2 land, there is no runtime path that supplies `prefersReducedMotion` to any visible button, so the stated verification cannot happen in the real UI.
- Fix: Either move prop plumbing into the same wave as Slice 1.3, or mark Slice 1.3 as code-complete only and make its runtime verification explicitly depend on Slices 3.1 and 3.2.

### E. Integration Risks
E-1: MAJOR — Cube plan does not satisfy live preference changes
- Location: Wave 1 / Slice 1.2
- Evidence: "Initialize `rotationSpeed` to `{ x: 0.02, y: 0.02 }` when `prefersReducedMotion` is true" / "In `handleMouseMove`, return early if `prefersReducedMotion` is true"
- Risk: This only covers initial state and future mouse events. In the current component, `rotationSpeed` is mutable state inside the running rAF loop. If the user enables reduced motion mid-session after the cube has already accelerated, the existing speed can remain high, so Story 3.1's live-listener promise and Slice 1.2's fixed-drift acceptance can fail.
- Fix: Add an explicit `useEffect` keyed on `prefersReducedMotion` that forces `rotationSpeed` to `{ x: 0.02, y: 0.02 }` when true and defines the non-reduced fallback behavior when false.

E-2: MAJOR — Reduced-motion buttons still retain hover movement
- Location: Wave 1 / Slice 1.3; current `src/components/FancyButton.jsx` hover styles
- Evidence: "conditionally apply `hudPulse` animation" / "Static `box-shadow` on hover remains in both modes" / current hover style: `transform: translateY(-2px);`
- Risk: The plan disables only the pulse effect. In the actual component, hover also animates vertical movement through `transform` with a `0.3s` transition. Following the plan literally would still produce motion on interaction in the exact component this feature is meant to calm.
- Fix: Expand Slice 1.3 to disable hover `transform`/movement transitions when `prefersReducedMotion` is true, or explicitly justify why that residual motion is acceptable for this accessibility feature.

### F. Resource & Assumption Risks
F-1: MAJOR — Browser support assumption for live media-query listeners is too broad
- Location: Resource Assumptions; Wave 1 / Slice 1.1
- Evidence: "`window.matchMedia` supports `prefers-reduced-motion` in all target browsers (Chrome 74+, Firefox 63+, Safari 10.1+, iOS Safari 10.3+)" / "listen for `change` events"
- Assumption: The plan assumes the same live `change` listener API works across the entire stated browser matrix. That is risky for older Safari-era browsers, where the listener API differs even if `matchMedia` itself exists.
- Fix: Either narrow the supported browser matrix for live updates, or explicitly add compatibility handling (`addEventListener`/`removeEventListener` plus legacy listener fallback) to Slice 1.1 and its verification notes.

## Fix Recommendations (Priority Order)
1. **MAJOR** Cube plan does not satisfy live preference changes — add a `prefersReducedMotion`-driven speed reset path in `RotatingCube`, not just initial state + mouse guard — Effort: small (1-4h)
2. **MAJOR** Reduced-motion buttons still retain hover movement — include hover transform/transition suppression in the button slice — Effort: small (1-4h)
3. **MAJOR** `FancyButton` slice is not independently verifiable — re-slice or add explicit dependencies so button QA happens only after prop plumbing exists — Effort: small (1-4h)
4. **MAJOR** Browser support assumption for live media-query listeners is too broad — specify compatibility fallback or narrow support claims — Effort: small (1-4h)
