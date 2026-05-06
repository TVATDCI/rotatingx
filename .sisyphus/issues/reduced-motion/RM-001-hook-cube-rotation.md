# Slice: Hook + Cube Rotation (End-to-End)

**Issue ID:** RM-001
**Status:** Open
**Type:** AFK
**Created:** 2026-05-06

---

## PRD Reference
`.sisyphus/prds/reduced-motion-prd.md`

## User Stories Covered
- Story 3.1 — React hook for reduced-motion detection
- Story 3.2 — Hook integration in RotatingCube
- Story 1.1 — Cube rotation respects reduced motion

## Description
Create the `useReducedMotion` detection hook and integrate it into `RotatingCube` so that when the user prefers reduced motion, the cube rotates at a capped near-static speed instead of the full dynamic range. This slice delivers a complete, testable end-to-end feature: the cube respects the user's system accessibility preference.

## Acceptance Criteria
- [ ] A `useReducedMotion` hook exists in `src/hooks/useReducedMotion.js`
- [ ] The hook returns `{ prefersReducedMotion: boolean }`
- [ ] The hook listens for `change` events on the `prefers-reduced-motion` media query and re-renders consumers when the preference changes
- [ ] `RotatingCube.jsx` imports and uses `useReducedMotion`
- [ ] When `prefers-reduced-motion: reduce` is active, cube rotation speed is capped at `0.02deg/frame` for both axes (down from the dynamic `0.1–1.5deg/frame` range)
- [ ] When reduced motion is active, mouse-reactive speed scaling in `handleMouseMove` is disabled
- [ ] When reduced motion is inactive, cube behavior remains unchanged from current implementation
- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes

## Files to Modify / Create
- **Create:** `src/hooks/useReducedMotion.js`
- **Modify:** `src/components/RotatingCube.jsx`

## Blockers
None — this is the first slice. No other issues must complete first.

## Estimated Complexity
Small

## Notes
- The hook should clean up its event listener on unmount via effect cleanup.
- `window.matchMedia` is widely supported; no polyfill needed.
- The near-static speed (0.02deg/frame at 60fps = 1.2deg/sec) preserves the 3D identity of the app without triggering vestibular issues.
