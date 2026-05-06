# Plan: prefers-reduced-motion Accessibility Support

> **Plan ID:** reduced-motion
> **Created:** 2026-05-06
> **PRD:** `.sisyphus/prds/reduced-motion-prd.md`
> **Issues:** RM-001, RM-002, RM-003
> **Momus PRD Review:** WARNING (3 major, 1 minor) — approved with user override. Plan addresses all flagged findings.

---

## TL;DR

Implement `prefers-reduced-motion` accessibility support across the Rotating-X application. This plan delivers an end-to-end motion-reduction feature: a reusable React hook detects the system preference, animated components respect it, and CSS transitions are overridden for users with vestibular disorders or motion sensitivity.

**Deliverables:**
1. `useReducedMotion` hook with live media-query listening and unit test coverage
2. `RotatingCube` updated to cap rotation speed and disable mouse-reactive scaling when reduced motion is preferred
3. `FancyButton` updated to suppress `hudPulse` animation while preserving static glow, with clean prop-based ownership
4. CSS `@media (prefers-reduced-motion: reduce)` block overriding background transitions on `.app` and `body`
5. `contain: layout paint` applied to `.glass-panel` with visual regression verification and documented fallback

**Effort estimate:** Short (1–2 days)

---

## Prerequisites

- [x] PRD approved: `.sisyphus/prds/reduced-motion-prd.md`
- [x] Momus PRD review completed: WARNING status, user override granted
- [x] Issues created and validated: RM-001, RM-002, RM-003
- [x] Reference check passed: no conflicting plans or state files
- [ ] **Test runner availability verified:** Before starting RM-001, confirm the project has a test runner (Vitest, Jest, or similar) configured. If no test runner exists, choose one of the following paths and document the decision in `.sisyphus/notepads/reduced-motion/decisions.md`:
  - **Path A:** Set up a test runner as an enabling prerequisite before RM-001.
  - **Path B:** Defer the `useReducedMotion` hook unit test to a follow-up issue and replace the automated verification in RM-001 with manual QA steps only (DevTools emulation + console assertion).
  - **Path B is the default** for this plan to keep scope bounded.
- [ ] **QA environment declaration:** Cross-platform manual QA (macOS, Windows, iOS) is supplemental, not release-gating. The release gate is Chrome DevTools emulation + `npm run build` + `npm run lint`. Document any device-specific findings in `.sisyphus/notepads/reduced-motion/learnings.md`.

---

## Waves

### Wave 1: Foundation (Parallel Slices — No Blockers)

**Goal:** Build the detection infrastructure and apply motion reduction to independent subsystems (cube rotation + CSS transitions).

Both slices in this wave are vertical, end-to-end, and can execute in parallel. They touch disjoint file sets and have no runtime dependency on each other.

---

#### Slice 1.1 — RM-001: Hook + Cube Rotation (End-to-End)

**Task:** Create the `useReducedMotion` detection hook, add unit test coverage, and integrate it into `RotatingCube` to cap rotation speed when the user prefers reduced motion.

**What it does:**
- Creates `src/hooks/useReducedMotion.js` that wraps `window.matchMedia('(prefers-reduced-motion: reduce)')`
- Returns `{ prefersReducedMotion: boolean }`
- Listens for `change` events on the media query and triggers re-render when the preference changes mid-session
- Cleans up the event listener on unmount via effect cleanup
- `RotatingCube.jsx` imports and consumes the hook directly (container-like component owns its own animation logic)
- When `prefersReducedMotion` is `true`:
  - `rotationSpeed` is initialized to `{ x: 0.02, y: 0.02 }` (fixed near-static drift)
  - `handleMouseMove` returns early — mouse-reactive speed scaling is fully disabled
- When `prefersReducedMotion` is `false`, all existing behavior is preserved

**Dependencies:** None — foundational slice.

**Owner:** Any developer.

**Verification steps (executable):**
- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes with zero warnings
- [ ] **Path A only (if test runner is configured):** Unit test for `useReducedMotion` hook exists and passes:
  - Mock `window.matchMedia` to return `matches: true`, assert hook returns `prefersReducedMotion: true`
  - Mock `window.matchMedia` to return `matches: false`, assert hook returns `prefersReducedMotion: false`
  - Simulate a `change` event on the media query, assert hook re-renders with updated value
- [ ] **Path B default (no test runner):** Manual QA in Chrome DevTools Rendering tab → "Emulate CSS media feature prefers-reduced-motion: reduce" ON:
  - Cube rotates at a fixed slow drift (~1.2deg/sec) regardless of mouse position
  - No jitter or speed changes on mouse movement
  - Open browser console, run: `console.assert(window.matchMedia('(prefers-reduced-motion: reduce)').matches === true, 'Media query should match')`
- [ ] Toggle emulation OFF mid-session:
  - Cube resumes full dynamic range (0.1–1.5deg/frame) and mouse reactivity within 1 second

**Output:**
- `src/hooks/useReducedMotion.js` (new)
- `src/hooks/useReducedMotion.test.js` (new — Path A only; omit if Path B)
- Modified `src/components/RotatingCube.jsx`

---

#### Slice 1.2 — RM-003: Background Transition Override (End-to-End)

**Task:** Add a CSS `@media (prefers-reduced-motion: reduce)` block that overrides the `transition: background 1.5s ease-in-out` on `.app` and `body` to become instant.

**What it does:**
- Adds a media query block to `src/index.css`
- Inside `@media (prefers-reduced-motion: reduce)`:
  - `.app` background transition is overridden to `transition: none` (or `transition-duration: 0s`)
  - `body` background transition is overridden to `transition: none` (or `transition-duration: 0s`)
- Atmosphere cycling still works — only the animated crossfade is removed, not the state change itself
- When reduced motion is inactive, existing `transition: background 1.5s ease-in-out` behavior is fully preserved

**Dependencies:** None — pure CSS slice, independent of all JavaScript changes.

**Owner:** Any developer.

**Verification steps (executable):**
- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes with zero warnings
- [ ] Manual QA in Chrome DevTools Rendering tab → "Emulate CSS media feature prefers-reduced-motion: reduce" ON:
  - Click the cube to cycle atmosphere — background changes instantly (no 1.5s crossfade)
  - Verify both `.app` and `body` backgrounds update simultaneously without animation
- [ ] Toggle emulation OFF:
  - Click the cube to cycle atmosphere — background crossfade animates over 1.5s as before
- [ ] If the initial page load looks jarring with `body` transition removed, scope the override to `.app` only and document the change in `.sisyphus/notepads/reduced-motion/decisions.md`

**Output:**
- Modified `src/index.css`

---

### Wave 2: Button Integration + Paint Containment (Blocked by Wave 1)

**Goal:** Wire the reduced-motion flag into `FancyButton`, suppress the pulse animation, and add CSS containment to the HUD panel.

This wave depends on Wave 1 because `useReducedMotion` must exist so that `App.jsx` can import it and pass the boolean down to `FancyButton` instances.

---

#### Slice 2.1 — RM-002: Button Pulse + HUD Containment (End-to-End)

**Task:** Integrate `prefersReducedMotion` into `FancyButton` via prop, suppress `hudPulse` on hover when reduced motion is preferred, and add `contain: layout paint` to `.glass-panel`.

**What it does:**
- `App.jsx` calls `useReducedMotion()` once and passes `prefersReducedMotion` to `MultiplePlayer` (which renders `FancyButton` instances)
- `MultiplePlayer.jsx` receives `prefersReducedMotion` as a prop and forwards it to all `FancyButton` instances it renders (PLAY/PAUSE button and track selector buttons)
- `FancyButton.jsx` accepts `prefersReducedMotion` as an optional boolean prop (default `false`)
- When `prefersReducedMotion` is `true`:
  - The `hudPulse` keyframe animation is never applied to hover states
  - The static `box-shadow: 0 0 10px var(--glow-color)` remains visible as a non-animated indicator
- When `prefersReducedMotion` is `false`, button hover behavior remains unchanged
- Adds `contain: layout paint` to the `.glass-panel` CSS class to reduce paint scope during motion
- **Ownership model clarification (addresses Momus finding):** `App.jsx` is the single owner of the `useReducedMotion` hook call. It passes the boolean as a prop to `FancyButton`. `FancyButton` does NOT call the hook directly and does NOT use React Context. This avoids conflicting ownership models and multiple media-query listeners.

**Dependencies:**
- RM-001 (Hook + Cube Rotation) must be complete — `useReducedMotion` hook must exist and be importable from `App.jsx`.

**Owner:** Any developer.

**Verification steps (executable):**
- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes with zero warnings
- [ ] Manual QA in Chrome DevTools Rendering tab → "Emulate CSS media feature prefers-reduced-motion: reduce" ON:
  - Hover over any `FancyButton` — static glow is visible, but no pulse animation plays
  - Click atmosphere cycle — background changes instantly (verifies Wave 1.2 still works)
  - Cube rotates at slow drift (verifies Wave 1.1 still works)
- [ ] Toggle emulation OFF:
  - Hover over any `FancyButton` — `hudPulse` animation plays on hover as before
  - Cube resumes full dynamic range
  - Background crossfade animates over 1.5s
- [ ] Visual regression check for CSS containment:
  - Verify that `.glass-panel` corner accent elements (`position: absolute` children) remain fully visible
  - If any accents are clipped, switch `.glass-panel` from `contain: layout paint` to `contain: layout` only, document the change in `.sisyphus/notepads/reduced-motion/decisions.md`, and re-verify
- [ ] PropTypes validation: no console warnings about missing or invalid `prefersReducedMotion` prop in `FancyButton` or `MultiplePlayer`

**Output:**
- Modified `src/components/FancyButton.jsx`
- Modified `src/components/MultiplePlayer.jsx` (forwards `prefersReducedMotion` prop to `FancyButton` instances)
- Modified `src/App.jsx` (passes `prefersReducedMotion` to `MultiplePlayer`)
- Modified `src/index.css` (for `.glass-panel` containment)

---

## Integration + Final Verification (Blocked by all above)

- [ ] **Task 3.1: Integration + Final Verification**
  - **What:** Wire up all modules, run full test suite, verify all PRD acceptance criteria, and confirm no regressions.
  - **Output:** All acceptance criteria checked off, build clean, no debug code or TODO markers left.
  - **Verify:**
    - [ ] All PRD acceptance criteria met:
      - [ ] Story 1.1 — Cube rotation respects reduced motion (0.02deg/frame cap, mouse scaling disabled)
      - [ ] Story 1.2 — Button pulse animation respects reduced motion (`hudPulse` suppressed, static glow preserved)
      - [ ] Story 2.1 — Background transitions become instant (CSS media query override active)
      - [ ] Story 2.2 — CSS containment for paint performance (`contain: layout paint` on `.glass-panel`, no clipping)
      - [ ] Story 3.1 — React hook for reduced-motion detection (returns boolean, listens for changes, cleans up)
      - [ ] Story 3.2 — Hook integration in RotatingCube (uses hook directly, conditional speed logic)
      - [ ] Story 3.3 — Hook integration in FancyButton (receives prop, conditional animation)
    - [ ] `npm run build` passes with zero errors
    - [ ] `npm run lint` passes with zero warnings
    - [ ] **Path A only:** `npm run test` passes (hook unit test + any existing tests)
    - [ ] **Path B default:** Manual QA via Chrome DevTools emulation passes (all acceptance criteria verified without automated tests)
    - [ ] No debug `console.log`, `debugger`, or TODO markers left in committed code
    - [ ] Browser-based release verification (mandatory gate):
      - [ ] Chrome DevTools Rendering tab → "Emulate CSS media feature prefers-reduced-motion: reduce" ON. Verify all acceptance criteria.
      - [ ] Toggle emulation OFF mid-session. Verify app adapts within 1 second.
    - [ ] Cross-platform supplemental QA (optional, document findings in learnings log):
      - [ ] macOS: System Settings → Accessibility → Display → Reduce Motion → ON. Refresh app. Verify.
      - [ ] Windows: Settings → Accessibility → Visual Effects → Animation Effects → OFF. Verify.
      - [ ] Mobile: iOS Settings → Accessibility → Motion → Reduce Motion → ON. Verify.
    - [ ] Momus PRD review findings addressed:
      - [ ] FancyButton ownership model is clean: `App.jsx` owns the hook call, passes prop to `FancyButton`. No Context, no direct hook calls in presentational components.
      - [ ] Test infrastructure gap closed: `useReducedMotion` hook has unit test coverage. Component tests for `RotatingCube` and `FancyButton` remain out of scope per PRD (no test runner setup required).
      - [ ] Verification is executable: every verification step includes a concrete command or manual QA procedure with pass/fail criteria.
      - [ ] CSS containment scope is bounded: `contain: layout paint` is a single-line change with explicit visual regression check and documented fallback to `contain: layout`.

---

## Resource Assumptions

- `window.matchMedia` supports `prefers-reduced-motion` in all target browsers (Chrome 74+, Firefox 63+, Safari 10.1+, iOS Safari 10.3+). No polyfill needed.
- `styled-components` v6 handles conditional `animation` prop injection without re-mount issues.
- The existing `requestAnimationFrame` loop in `RotatingCube` can have its speed variables reassigned mid-flight without requiring loop restart.
- **Path A:** The project has a test runner configured (e.g., Vitest or Jest) sufficient for hook unit tests.
- **Path B (default):** No test runner is configured. Hook verification is manual via DevTools emulation and console assertions. The `useReducedMotion.test.js` file may be created as a placeholder but is not executed as part of this plan.
- Adding `contain: layout paint` to `.glass-panel` will not clip `position: absolute` corner accents because they are direct children. If they are clipped, the fallback to `contain: layout` is documented and pre-approved.

---

## Risk Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| `window.matchMedia` may not fire `change` events reliably in all browsers during mid-session toggles | Medium | Low | Test across Chrome, Firefox, Safari during manual QA. Fallback: the preference is read on mount, which covers the 95% case (users who set it before opening the app). Document known limitation in `.sisyphus/notepads/reduced-motion/decisions.md` if observed. |
| `contain: layout paint` on `.glass-panel` clips positioned children (corner accents are `position: absolute`) | Low | Medium | Visual regression check is part of Slice 2.1 verification. If clipped, switch to `contain: layout` only and document the change. The fallback is pre-approved and does not block the slice. |
| The near-static cube speed (0.02deg/frame at 60fps = 1.2deg/sec) might still be too fast for some users | Low | Low | If reported post-release, reduce to 0.01 or 0.005 in a follow-up. The hook architecture makes this a one-line change. Document the tuning parameter in `.sisyphus/notepads/reduced-motion/decisions.md`. |
| The `transition: background 1.5s ease-in-out` on `body` might make the initial page load look jarring when overridden | Low | Low | Scope the override to `.app` only if jarring. This is part of Slice 1.2 verification and does not require a plan change. |
| Missing test infrastructure prevents hook unit test from running | Medium | Low | Verify test runner availability before starting Wave 1. If no runner is configured, escalate to user: either (a) set up test runner as prerequisite, or (b) defer hook unit test to a follow-up issue and document the gap. |
| Prop drilling `prefersReducedMotion` through multiple layers becomes unwieldy if the component tree grows | Low | Low | Acceptable for current tree depth (App → FancyButton). If tree depth increases beyond 2 layers in future, migrate to React Context. Document this threshold in `.sisyphus/notepads/reduced-motion/decisions.md`. |

---

## Notepad

- Decisions log: `.sisyphus/notepads/reduced-motion/decisions.md`
- Problems log: `.sisyphus/notepads/reduced-motion/problems.md`
- Learnings log: `.sisyphus/notepads/reduced-motion/learnings.md`

---

## Handoff Contract

**Next phase:** `wave-executor`
**Trigger phrase:** "start execution" or "begin work"
**Entry criteria for wave-executor:**
- This plan is approved by user
- All prerequisites checked off
- Developer has read the PRD and this plan
- `npm install` has been run and dev server starts successfully

**Wave 1 ready queue:**
1. RM-001 — Hook + Cube Rotation
2. RM-003 — Background Transition Override

**Wave 2 ready queue (blocked until Wave 1 complete):**
1. RM-002 — Button Pulse + HUD Containment

**Integration gate:** Task 3.1 runs only after all slices in Waves 1 and 2 are marked complete.
