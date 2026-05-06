# Problems Log: reduced-motion

> Plan: `.sisyphus/plans/reduced-motion.md`
> PRD: `.sisyphus/prds/reduced-motion-prd.md`

---

## Problem Template

| Field | Value |
|-------|-------|
| **ID** | P-NNN |
| **Slice** | RM-00N |
| **Description** | |
| **Impact** | |
| **Workaround** | |
| **Resolution** | |
| **Date** | |

---

## Active Problems

*No active problems.*

---

## Resolved Problems

### P-001: ESLint v10 + flat-config incompatibility

| Field | Value |
|-------|-------|
| **ID** | P-001 |
| **Slice** | All |
| **Description** | `npm run lint` fails with `TypeError: context.getSourceCode is not a function` in `eslint-plugin-react-hooks/exhaustive-deps` rule. |
| **Impact** | Blocks automated lint verification. Cannot run `npm run lint` on this codebase. |
| **Workaround** | Verified lint failure is pre-existing by stashing all changes and re-running on unmodified codebase. Same error occurs. |
| **Resolution** | Acknowledged as pre-existing infrastructure issue, not caused by reduced-motion changes. Build (`npm run build`) passes as the primary quality gate. |
| **Date** | 2026-05-06 |

### P-002: FancyButton ownership model ambiguity

| Field | Value |
|-------|-------|
| **ID** | P-002 |
| **Slice** | RM-002 |
| **Description** | PRD simultaneously said FancyButton consumes hook directly, may use prop/context/hook, and has already decided to use a prop. Mutually exclusive ownership models. |
| **Impact** | Would cause implementation drift before slicing even starts. Different developers might choose different patterns. |
| **Workaround** | N/A — this is a requirements-level issue, not a runtime bug. |
| **Resolution** | Plan explicitly declares `App.jsx` as single owner of `useReducedMotion()` call. Prop passes through `MultiplePlayer` to `FancyButton`. No Context, no direct hook calls. Documented in plan and implemented in code. |
| **Date** | 2026-05-06 |

### P-003: RM-001 claimed "no blockers" but required test runner

| Field | Value |
|-------|-------|
| **ID** | P-003 |
| **Slice** | RM-001 |
| **Description** | RM-001 verification steps included a unit test, but the repo has no test runner. The slice was marked as "no blockers" but the verification was blocked. |
| **Impact** | Would cause execution to stall when the unit test step is reached. |
| **Workaround** | Added Path A/B branching to prerequisites and verification steps. |
| **Resolution** | Path B (no test runner, manual QA) declared as default. All verification steps made conditional on chosen path. Resource assumptions updated. |
| **Date** | 2026-05-06 |

