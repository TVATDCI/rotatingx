# Slice: Background Transition Override (End-to-End)

**Issue ID:** RM-003
**Status:** Open
**Type:** AFK
**Created:** 2026-05-06

---

## PRD Reference
`.sisyphus/prds/reduced-motion-prd.md`

## User Stories Covered
- Story 2.1 — Background transitions become instant

## Description
Add a CSS `@media (prefers-reduced-motion: reduce)` block that overrides the `transition: background 1.5s ease-in-out` on `.app` and `body` to become instant (`transition: none` or `transition-duration: 0s`). Atmosphere changes still occur on click, but without animated crossfades. This slice delivers a complete end-to-end feature: background transitions respect the user's motion preference.

## Acceptance Criteria
- [ ] An `@media (prefers-reduced-motion: reduce)` block exists in `src/index.css`
- [ ] Inside the media query, `.app` has its background transition overridden to instant (no animation)
- [ ] Inside the media query, `body` has its background transition overridden to instant (no animation)
- [ ] When reduced motion is inactive, the existing `transition: background 1.5s ease-in-out` behavior is preserved
- [ ] Atmosphere cycling still works correctly — only the transition animation is removed, not the state change itself
- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes

## Files to Modify / Create
- **Modify:** `src/index.css`

## Blockers
None — this slice is pure CSS and has no dependency on the JavaScript hook or component changes.

## Estimated Complexity
Tiny

## Notes
- The `body` transition is primarily for atmosphere cycling, not the initial page load. If removing it makes the initial load look jarring, scope the override to `.app` only and document.
- This slice can be implemented and tested in parallel with RM-001.
