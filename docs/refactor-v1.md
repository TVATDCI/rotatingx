# UI Refactor Plan - V1

This document outlines the roadmap for the student project refactor, focusing on tech stack modernization, structural cleanup, and UI/UX enhancements.

## Phase 1: Tech Stack Modernization [DONE]
**Goal:** Bring the project up to 2026 standards for better performance and developer experience.

- [x] **Upgrade React:** Move from `18.x` to `19.x`.
- [x] **Upgrade Vite:** Move from `5.x` to `6.x` (actually `7.x`).
- [x] **Dependency Update:** Update `styled-components`, `eslint`, and `prop-types` to their latest stable versions.
- [x] **Environment Verification:** Ensure `npm run dev` and `npm run build` work correctly after updates.

## Phase 2: Structural Refactoring (Clean Code) [DONE]
**Goal:** Improve maintainability and reduce code complexity.

- [x] **Logic Extraction:** Create a `useAtmosphere` custom hook to manage background state and random switching.
- [x] **Component Consolidation:** 
    - Remove redundant files: `RotatingCubeStyled.jsx`, `MiniPlayerX.jsx`, `Player1.jsx`.
    - Unify styling strategy (Standardize on modern CSS with Variables).
- [x] **Prop Cleanliness:** Audit and simplify prop passing between `App.jsx` and its children.

## Phase 3: UI/UX Enhancements [DONE]
**Goal:** Create a more immersive and professional "floating" experience.

- [x] **Dynamic CSS Variables:** Link atmosphere colors to CSS variables (e.g., `--accent-color`, `--glow-color`) so the Cube and UI automatically adapt to the background.
- [x] **Glassmorphism UI:** 
    - Apply translucent, blurred backgrounds (`backdrop-filter: blur()`) to the music player and controls.
    - Improve typography for better readability against dynamic backgrounds.
- [x] **Refined 3D Effects:**
    - Adjust `perspective` and `transform-style` for a deeper 3D feel.
    - Add "reactive glow" to the cube that changes intensity based on interaction.
- [x] **Mobile Optimization:** Ensure the cube and players are perfectly centered and scaled on small screens.

---

## Deferred Features (Future Phases)
- **Atmospheric Audio Sync:** Linking specific audio tracks/loops to backgrounds.
- **Advanced Themes:** User-selectable atmosphere combinations.

---
*Created: Friday, February 27, 2026*
