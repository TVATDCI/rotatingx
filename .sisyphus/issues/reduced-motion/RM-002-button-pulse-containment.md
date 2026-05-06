# Slice: Button Pulse + HUD Containment (End-to-End)

**Issue ID:** RM-002
**Status:** Open
**Type:** AFK
**Created:** 2026-05-06

---

## PRD Reference
`.sisyphus/prds/reduced-motion-prd.md`

## User Stories Covered
- Story 3.3 — Hook integration in FancyButton
- Story 1.2 — Button pulse animation respects reduced motion
- Story 2.2 — CSS containment for paint performance

## Description
Integrate the reduced-motion flag into `FancyButton` so that the `hudPulse` animation is suppressed when the user prefers reduced motion, while keeping the static `box-shadow` glow as a non-animated visual indicator. Also add `contain: layout paint` to the `.glass-panel` HUD container to reduce paint scope during motion. This slice delivers a complete end-to-end feature: buttons are accessible and the HUD renders efficiently.

## Acceptance Criteria
- [ ] `FancyButton.jsx` accepts a `prefersReducedMotion` boolean prop
- [ ] When `prefersReducedMotion` is `true`, the `hudPulse` keyframe animation is never applied to hover states
- [ ] When `prefersReducedMotion` is `true`, the static `box-shadow: 0 0 10px var(--glow-color)` remains visible as a non-animated indicator
- [ ] When `prefersReducedMotion` is `false`, button hover behavior remains unchanged
- [ ] `App.jsx` (or the nearest common ancestor) calls `useReducedMotion` and passes `prefersReducedMotion` to all `FancyButton` instances
- [ ] The `.glass-panel` CSS class has `contain: layout paint` applied
- [ ] Corner accent elements (`position: absolute` children of `.glass-panel`) remain fully visible after containment is applied
- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes

## Files to Modify / Create
- **Modify:** `src/components/FancyButton.jsx`
- **Modify:** `src/App.jsx` (or equivalent parent component)
- **Modify:** `src/index.css` (for `.glass-panel` containment)

## Blockers
- **RM-001** — Hook + Cube Rotation must complete first. The `useReducedMotion` hook must exist so that `App.jsx` can import it and pass the boolean to `FancyButton` instances.

## Estimated Complexity
Small

## Notes
- Decision 3 in the PRD specifies passing `prefersReducedMotion` as a prop rather than using Context or calling the hook directly in `FancyButton`. This avoids multiple media query listeners and Context boilerplate.
- If `contain: layout paint` clips corner accents, fall back to `contain: layout` only and document the change.
