# Momus PRD Review: reduced-motion
**Date:** 2026-05-06  
**Artifacts reviewed:** PRD: `/home/vladi/projects/GitHub/rotating-x/.sisyphus/prds/reduced-motion-prd.md`

## Summary
**Gate Decision:** WARNING  
**Blocker count:** 4 total (0 critical, 3 major, 1 minor)

### Top 3 Risks
1. **Conflicting FancyButton integration model** — the PRD names three different ownership patterns for reduced-motion state, so implementation can drift before slicing even starts.
2. **Verification depends on missing test infrastructure** — the hook test is specified as required work, but the repo currently has no test runner and the PRD does not scope adding one.
3. **Completion is not mechanically verifiable end-to-end** — core acceptance still depends on external OS/device toggles and ad hoc visual checks rather than repo-executable verification.

## Detailed Findings
### A. Logical Contradictions
A-1: MAJOR — Conflicting `FancyButton` integration model
- Location: Solution Overview (line 16), Story 3.3 (line 52), Decision 3 (lines 77-80)
- Evidence: "This hook will provide a boolean flag consumed by `RotatingCube` (for rAF speed adjustment) and `FancyButton` (for conditional animation)." / "`FancyButton.jsx` receives `prefersReducedMotion` as a prop (or uses context/hook, TBD in decisions)" / "`FancyButton` receives `prefersReducedMotion` as an optional boolean prop."
- Conflict: The PRD simultaneously says `FancyButton` consumes the hook directly, may use prop/context/hook, and has already decided to use a prop. Those are mutually exclusive ownership models. In the current app, `FancyButton` is only rendered inside `MultiplePlayer`, so the prop-based path also requires an explicit parent-owner decision that the PRD never names.
- Fix: Freeze one model in the PRD. Recommended: declare `MultiplePlayer` (or `App`) as the single owner that calls `useReducedMotion` once and passes `prefersReducedMotion` into each `FancyButton`; then remove the hook/context TBD wording everywhere else.

### B. Scope Creep
B-1: MAJOR — Hook unit test assumes infrastructure that is not in scope
- Location: Testing Decisions (line 91), Out of Scope (line 108)
- Evidence: "Unit test: `useReducedMotion` hook — mock `window.matchMedia`..." / "Unit tests for `RotatingCube` or `FancyButton` (these components currently have no test infrastructure; testing them would require setting up a test runner which is out of scope)"
- Hidden dependency: A hook unit test still needs the same missing test runner/mocking setup. The PRD requires a unit test but never scopes the test infrastructure needed to run it.
- Fix: Either add test-runner setup explicitly to scope for this PRD, or remove the mandatory unit-test language and replace it with a fully manual/browser-based verification plan that matches current project capabilities.

B-2: MINOR — CSS containment broadens scope beyond the reduced-motion objective
- Location: Story 2.2 (lines 36-38), Decision 4 (lines 82-85), Risks table (line 115)
- Evidence: "As any user, I want the HUD panel to render efficiently..." / "Add `contain: layout paint` to `.glass-panel` as part of this motion-reduction work." / "`contain: layout paint` on `.glass-panel` might clip positioned children"
- Hidden dependency: Reduced-motion support can ship without containment. Bundling a separate paint-optimization task adds unrelated acceptance surface and introduces a known layout/clipping risk.
- Fix: Split Story 2.2 into its own follow-up issue/PRD unless containment is required for release, or explicitly state why reduced-motion is blocked without it.

### C. Missing Verification
C-1: MAJOR — Acceptance is not mechanically verifiable in this repository
- Location: Testing Decisions (lines 91-100)
- Evidence: "Visual QA: Test in Chrome DevTools Rendering tab... Verify cube drifts slowly, buttons have no pulse, background changes are instant." / "macOS... Verify all acceptance criteria." / "Windows... Verify." / "Mobile: iOS... Verify."
- Problem: The PRD does not give a repo-executable way to verify the feature end-to-end. It relies on external OS/device settings and manual observation, and the only automated check mentioned is the hook unit test that itself depends on missing infrastructure. That means an auditor agent cannot objectively confirm completion from the repository alone.
- Fix: Add a concrete executable verification path. Options: scope browser automation/test tooling into the work, or define a supported-browser manual checklist with precise observable outcomes per story and clearly mark cross-platform device checks as supplemental rather than release-gating.

## Fix Recommendations (Priority Order)
1. **MAJOR** Conflicting `FancyButton` integration model — choose a single owner for reduced-motion state and remove contradictory hook/prop/context wording — Effort: small (1-4h)
2. **MAJOR** Hook unit test assumes infrastructure that is not in scope — either scope test infrastructure or remove the unit-test requirement — Effort: small (1-4h)
3. **MAJOR** Acceptance is not mechanically verifiable in this repository — define one executable verification path for completion — Effort: medium (half day)
4. **MINOR** CSS containment broadens scope beyond the reduced-motion objective — split it into a follow-up unless release-critical — Effort: trivial (< 1h)
