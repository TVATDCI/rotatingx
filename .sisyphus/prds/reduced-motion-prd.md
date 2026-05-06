# PRD: prefers-reduced-motion Accessibility Support

> **APPROVED** — 2026-05-06. Momus PRD review returned `WARNING` (3 major, 1 minor). User override: approved for execution with noted fixes to be addressed during implementation.

## Problem Statement

Users with vestibular disorders, motion sensitivity, or those who have configured their operating system to prefer reduced motion currently experience the full intensity of Rotating-X animations. The cube rotates continuously via `requestAnimationFrame`, button hover states trigger a `hudPulse` keyframe animation, and atmosphere background transitions use a 1.5s ease-in-out transition. None of these respect the user's `prefers-reduced-motion` system preference. This can cause discomfort, dizziness, or nausea for affected users and represents an accessibility gap that blocks WCAG 2.1 compliance (Success Criterion 2.3.3: Animation from Interactions).

## Solution Overview

Implement `prefers-reduced-motion` media query detection across all motion sources in the application. When the user prefers reduced motion:

1. **Cube rotation** slows to a near-static state (minimal drift, not a complete freeze, to maintain the 3D identity of the app)
2. **Button pulse animation** (`hudPulse`) is disabled entirely on hover
3. **Background transitions** become instant (0s) instead of 1.5s animated crossfades
4. **Atmosphere changes** still occur on click, but without animated transitions

The detection will be implemented as a custom React hook (`useReducedMotion`) that wraps `window.matchMedia('(prefers-reduced-motion: reduce)')`. This hook will provide a boolean flag consumed by `RotatingCube` (for rAF speed adjustment) and `FancyButton` (for conditional animation). CSS-only transitions will be handled via a media query block in `index.css`.

## User Stories

### Vertical Slice 1: Core Motion Reduction

**Story 1.1 — Cube rotation respects reduced motion**
- As a user with motion sensitivity, I want the cube to rotate slowly and smoothly, so that I can enjoy the 3D visual without experiencing dizziness.
- **Acceptance:** When `prefers-reduced-motion: reduce` is active, the cube rotation speed is capped at 0.02deg/frame for both axes (down from the dynamic 0.1–1.5deg/frame range). The mouse-reactive speed scaling is disabled.

**Story 1.2 — Button pulse animation respects reduced motion**
- As a user with motion sensitivity, I want button hover effects to be static, so that flashing or pulsing lights do not trigger discomfort.
- **Acceptance:** When `prefers-reduced-motion: reduce` is active, the `hudPulse` animation is never applied to `FancyButton` hover states. The static `box-shadow: 0 0 10px var(--glow-color)` remains as a non-animated visual indicator.

### Vertical Slice 2: CSS Transition Reduction

**Story 2.1 — Background transitions become instant**
- As a user with motion sensitivity, I want atmosphere background changes to happen instantly, so that I am not exposed to full-screen color/gradient crossfades.
- **Acceptance:** When `prefers-reduced-motion: reduce` is active, the `transition: background 1.5s ease-in-out` on `.app` and `body` is overridden to `transition: none` or `transition-duration: 0s`.

**Story 2.2 — CSS containment for paint performance**
- As any user, I want the HUD panel to render efficiently, so that animations do not cause unnecessary repaints elsewhere on the page.
- **Acceptance:** The `.glass-panel` (HUD container) has `contain: layout paint` applied. This is included in this PRD because it directly reduces the paint cost of motion and is already on the near-term roadmap.

### Vertical Slice 3: Detection & Hook Infrastructure

**Story 3.1 — React hook for reduced-motion detection**
- As a developer, I want a reusable hook that detects the user's motion preference, so that I can conditionally apply motion-sensitive logic anywhere in the component tree.
- **Acceptance:** A `useReducedMotion` hook exists in `src/hooks/useReducedMotion.js`. It returns `{ prefersReducedMotion: boolean }`. It listens for `change` events on the `prefers-reduced-motion` media query and re-renders consumers when the preference changes (e.g., user toggles macOS Accessibility setting while app is open).

**Story 3.2 — Hook integration in RotatingCube**
- As a developer, I want the cube component to consume the reduced-motion flag, so that rotation logic is cleanly separated from detection logic.
- **Acceptance:** `RotatingCube.jsx` imports and uses `useReducedMotion`. The `rotationSpeed` state initialization and `handleMouseMove` logic are conditional on the flag.

**Story 3.3 — Hook integration in FancyButton**
- As a developer, I want the button component to consume the reduced-motion flag, so that animation logic is cleanly separated from detection logic.
- **Acceptance:** `FancyButton.jsx` receives `prefersReducedMotion` as a prop (or uses context/hook, TBD in decisions) and conditionally applies the `hudPulse` animation.

## Implementation Decisions

### Module Boundaries

| Module | Interface (small) | Hides (large) |
|--------|-------------------|---------------|
| `useReducedMotion` hook | Returns `{ prefersReducedMotion: boolean }` | Media query setup, event listener lifecycle, re-render triggering |
| `RotatingCube.jsx` | Props: `changeAtmosphere` | rAF loop speed logic, mouse handler conditional branching |
| `FancyButton.jsx` | Props: `isPrimary`, `onClick`, `ariaLabel`, `prefersReducedMotion` | styled-components animation conditional, transition property list |
| `index.css` | CSS custom properties and classes | Media query overrides for `.app`, `body`, `.glass-panel` |

### Decision Log

**Decision 1: Use a React hook + CSS media query hybrid approach**
- **Choice:** Detect `prefers-reduced-motion` in both JavaScript (via `useReducedMotion` hook) and CSS (via `@media (prefers-reduced-motion: reduce)` block).
- **Rejected:** Pure CSS-only approach — cannot control `requestAnimationFrame` loop speed from CSS alone. Pure JS-only approach — cannot easily override CSS transitions without inline styles or class toggling, which is more intrusive.
- **Rationale:** rAF speed requires JS intervention. CSS transitions are cleaner to override in a media query. The hybrid gives each concern the right tool.

**Decision 2: Cap cube speed rather than freeze entirely**
- **Choice:** When reduced motion is preferred, set rotation speed to a fixed low value (0.02deg/frame) and ignore mouse input.
- **Rejected:** Completely stop the cube (`speed = 0`) — would make the app look broken to users who can tolerate minimal motion. Also rejected: keep mouse reactivity but at a lower scale — still too dynamic for sensitive users.
- **Rationale:** A near-static drift preserves the 3D identity of the application without triggering vestibular issues. A completely frozen cube looks like a bug.

**Decision 3: Pass `prefersReducedMotion` as prop rather than Context**
- **Choice:** `FancyButton` receives `prefersReducedMotion` as an optional boolean prop. `RotatingCube` uses the hook directly.
- **Rejected:** React Context — would require wrapping the app in a provider for a single boolean flag, adding boilerplate. Also rejected: `FancyButton` calling `useReducedMotion` directly — would create multiple media query listeners (though cheap, it's unnecessary duplication).
- **Rationale:** `FancyButton` is already a presentational component that receives configuration via props. `RotatingCube` is a container-like component that owns its own animation logic, so using the hook directly is appropriate. This avoids Context overhead for a simple prop drill.

**Decision 4: Include CSS containment in this PRD**
- **Choice:** Add `contain: layout paint` to `.glass-panel` as part of this motion-reduction work.
- **Rejected:** Separate PRD — the containment is trivial (one line) and directly supports the paint-performance goal of reduced-motion work.
- **Rationale:** The near-term roadmap already lists containment as a next item. Combining it avoids PRD overhead for a one-line change.

## Testing Decisions

### Feedback Loops

- **Unit test:** `useReducedMotion` hook — mock `window.matchMedia` to return `matches: true/false`, verify the hook returns the correct boolean. Simulate a `change` event and verify re-render.
- **Visual QA:** Test in Chrome DevTools Rendering tab → "Emulate CSS media feature prefers-reduced-motion". Verify cube drifts slowly, buttons have no pulse, background changes are instant.
- **Build verification:** `npm run build` passes with zero errors. `npm run lint` passes.

### Manual QA Checkpoints

1. **macOS:** System Settings → Accessibility → Display → Reduce Motion → ON. Refresh app. Verify all acceptance criteria.
2. **Windows:** Settings → Accessibility → Visual Effects → Animation Effects → OFF. Verify.
3. **Toggle mid-session:** Open app, enable reduced motion in OS settings without reloading. Verify app adapts within 1 second (media query `change` event).
4. **Mobile:** iOS Settings → Accessibility → Motion → Reduce Motion → ON. Verify.

## Out of Scope

- Removing `requestAnimationFrame` entirely or replacing with CSS animation
- Adding a manual "Disable Animations" toggle in a settings panel (that is Phase 6 work)
- Refactoring the atmosphere system to use CSS `view-transition` API
- Adding `prefers-contrast` or other accessibility media queries
- Unit tests for `RotatingCube` or `FancyButton` (these components currently have no test infrastructure; testing them would require setting up a test runner which is out of scope)

## Open Questions / Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| `window.matchMedia` may not fire `change` events reliably in all browsers during mid-session toggles | Medium | Test across Chrome, Firefox, Safari. Fallback: the preference is read on mount, which covers the 95% case (users who set it before opening the app). |
| `contain: layout paint` on `.glass-panel` might clip positioned children (corner accents are `position: absolute`) | Low | Verify in browser that corner accents remain visible. If clipped, switch to `contain: layout` only. |
| The near-static cube speed (0.02deg/frame at 60fps = 1.2deg/sec) might still be too fast for some users | Low | If reported, we can reduce to 0.01 or 0.005 in a follow-up. The hook architecture makes this a one-line change. |
| The `transition: background 1.5s ease-in-out` is also on `body` for the initial page load fade. Setting it to `none` might make the initial load look jarring. | Low | The `body` transition is primarily for the atmosphere cycling, not the initial load. If jarring, scope the override to `.app` only. |

## PRD Hardening Checklist

- [x] Content Boundaries defined — N/A, no dynamic content in this feature
- [x] Score/Metric Normalization — N/A, no scores or metrics
- [x] Fixture/Test Data Provenance — N/A, no external test data
- [x] Latency/Performance Contracts — `contain: layout paint` reduces paint scope; media query detection is synchronous
- [x] Token/Rate Limits — N/A, no API calls
- [x] Error Boundaries — `window.matchMedia` is widely supported. No fallback needed beyond reading on mount.
- [x] State/Persistence Contract — `useReducedMotion` state lives in React component state. No persistence. Cleaned up on unmount via effect cleanup.
