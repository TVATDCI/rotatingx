# Agent Instructions: Phase 4 UI/UX "HUD" Transformation

## Context

You are an expert Frontend Engineer and UI/UX Specialist. The project is a **React 19 / Vite 7** application. V1 completed a structural refactor: atmosphere logic lives in `useAtmosphere.js`, global CSS variables (`--accent-color`, `--glow-color`, `--glass-bg`, `--glass-border`, `--glass-blur`) are declared in `index.css`, and components use a `.glass-panel` utility class.

### Styling Convention (Follow This Throughout)

The project has three styling systems in use. For all **new and modified** work in V2, follow this rule:

- **Global layout / atmosphere themes**: plain CSS in `index.css`
- **Component-scoped visual styling**: plain CSS class or `styled-components` matching the component's existing approach
- **No new inline `style={}` props** — convert the existing inline flex row in `MultiplePlayer.jsx` to a CSS class

---

### Mission

Transform the current interface into a **High-End Atmospheric HUD (Heads-Up Display)**: a transparent glass overlay that feels like a targeting system floating within the dynamic environments.

---

## Step-by-Step Execution Plan

### Step 1 — Cleanup: Remove Dead Code

Before adding anything, delete the following files which are unused and imported nowhere:

- `src/components/GradientPlayer.jsx` — exports a duplicate function also named `MiniPlayer`; dead code
- `src/components/FloatingButton.jsx` — not imported anywhere in the app; dead code
- `src/App.css` — empty file; remove it and remove its `import` from `src/main.jsx`

---

### Step 2 — Fix the Cube Animation Conflict

In `src/components/RotatingCube.css`, the `@keyframes rotate` animation and the `animation: rotate 10s linear infinite` rule on `.rotating-cube` are in direct conflict with the `requestAnimationFrame` loop in `RotatingCube.jsx` that sets `style.transform` directly. Both run simultaneously, causing jank.

**Action**: Remove **only** the `animation: rotate 10s linear infinite` declaration from `.rotating-cube` and the `@keyframes rotate` block at the bottom of the file. Do **not** touch any other property — `perspective`, `transform-style`, face gradients, `opacity`, borders, or glow — the "exploded" visual identity must be preserved entirely.

---

### Step 3 — Update `index.css`: Glassmorphism 2.0

The variables `--glass-bg`, `--glass-border`, and `--glass-blur` already exist. **Update** them (do not re-add):

- Change `--glass-blur` from `blur(12px)` to `blur(12px) saturate(180%)`
- Change `--glass-bg` to `rgba(10, 10, 20, 0.45)` for a deeper, darker base
- Change `--glass-border` to `rgba(255, 255, 255, 0.12)`
- Add `--text-dim: rgba(255, 255, 255, 0.5)` for secondary/HUD label text

Update the `.glass-panel` rule to use the updated variables and ensure both `backdrop-filter` and `-webkit-backdrop-filter` are present.

**Gradient border technique** — CSS `border` does not support gradients natively. Use a `::before` pseudo-element on `.glass-panel`:

- Set `position: relative` and `overflow: hidden` on `.glass-panel`
- Add a `::before` pseudo-element with:

  ```css
  .glass-panel::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, var(--accent-color), transparent 60%);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: destination-out;
    pointer-events: none;
    z-index: 0;
  }
  ```

This creates a gradient border that respects `border-radius`, degrades gracefully, and auto-updates with every atmosphere change via `--accent-color`.

Add a `.hud-status` utility class:

```css
.hud-status {
  font-family: "Courier New", monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--accent-color);
  opacity: 0.8;
  text-transform: uppercase;
  margin-bottom: 8px;
  text-shadow: 0 0 6px var(--glow-color);
}
```

Add a `.track-selector-row` utility class to replace the inline style in `MultiplePlayer.jsx`:

```css
.track-selector-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
```

Add corner accent styles:

```css
.corner-tl,
.corner-tr,
.corner-bl,
.corner-br {
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: var(--accent-color);
  border-style: solid;
  opacity: 0.7;
}
.corner-tl {
  top: 6px;
  left: 6px;
  border-width: 1.5px 0 0 1.5px;
}
.corner-tr {
  top: 6px;
  right: 6px;
  border-width: 1.5px 1.5px 0 0;
}
.corner-bl {
  bottom: 6px;
  left: 6px;
  border-width: 0 0 1.5px 1.5px;
}
.corner-br {
  bottom: 6px;
  right: 6px;
  border-width: 0 1.5px 1.5px 0;
}
```

---

### Step 4 — Refactor `MiniPlayer.jsx`: Connect to Atmosphere System

`MiniPlayer.jsx` has a hardcoded amber/gold gradient (`rgba(212, 175, 55, ...)`) disconnected from the atmosphere CSS variable system. Refactor its `PlayPauseButton` styled-component:

- Replace the hardcoded `radial-gradient` background with `background: var(--glass-bg)`
- Replace the hardcoded `box-shadow` with `box-shadow: 0 0 15px var(--glow-color)`
- Add `border: 1px solid var(--glass-border)` and `backdrop-filter: var(--glass-blur)`
- On hover: `box-shadow: 0 0 30px var(--glow-color)` — no hardcoded amber

---

### Step 5 — Refactor `MultiplePlayer.jsx`: Corner Accents + HUD Status

**A. Convert inline style to CSS class**

Replace the track-selector `style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}` with `className="track-selector-row"`.

**B. Corner Accents**

Four L-shaped brackets require four DOM elements. Wrap the existing panel content in a new inner `<div className="hud-panel-inner">` and add the four `<span>` corner elements inside it:

```jsx
<div className="hud-panel-inner">
  <span className="corner-tl" />
  <span className="corner-tr" />
  <span className="corner-bl" />
  <span className="corner-br" />
  {/* existing children */}
</div>
```

Add `.hud-panel-inner` to `index.css`:

```css
.hud-panel-inner {
  position: relative;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
```

Move the `padding` and `flex` layout from `.multiPlayerContainer` into `.hud-panel-inner`, keeping `.multiPlayerContainer` responsible only for absolute page positioning.

**C. HUD Status Label**

`MultiplePlayer` needs to display the current atmosphere name. Pass it as a new prop from `App.jsx`:

- In `App.jsx`: add `currentAtmosphere={background}` to the `<MultiplePlayer ... />` JSX element
- In `MultiplePlayer.jsx`: accept `currentAtmosphere` as a prop and add it to `propTypes`:

  ```js
  MultiplePlayer.propTypes = {
    audioSources: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentAtmosphere: PropTypes.string.isRequired,
  };
  ```

Render a HUD label as the **first child** inside `.hud-panel-inner` (above the play/pause button):

```jsx
<p className="hud-status">
  ATMOSPHERE: {currentAtmosphere.toUpperCase()} | {lat}°{latDir} {lon}°{lonDir}
</p>
```

Generate coordinates with `useMemo` keyed on `currentAtmosphere` so they update on every atmosphere change but are stable between re-renders:

```js
const coords = useMemo(() => {
  const rawLat = (Math.random() * 180 - 90).toFixed(4);
  const rawLon = (Math.random() * 360 - 180).toFixed(4);
  const lat = Math.abs(rawLat).toFixed(4);
  const lon = Math.abs(rawLon).toFixed(4);
  const latDir = rawLat >= 0 ? "N" : "S";
  const lonDir = rawLon >= 0 ? "E" : "W";
  return { lat, lon, latDir, lonDir };
}, [currentAtmosphere]);
```

Destructure `coords` for use in the JSX.

---

### Step 6 — Refactor `FancyButton.jsx`: Pulse Micro-interaction

**Important**: CSS custom properties cannot be directly animated with `@keyframes`. Animate `box-shadow` (which references `--glow-color`) instead.

Import `keyframes` from `styled-components` and define the animation:

```js
const hudPulse = keyframes`
  0%, 100% { box-shadow: 0 0 8px var(--glow-color); }
  50%       { box-shadow: 0 0 20px var(--glow-color), 0 0 35px var(--glow-color); }
`;
```

On hover of non-disabled, non-`isPrimary` buttons, replace the static `box-shadow` with:

```css
animation: ${hudPulse} 1.2s ease-in-out infinite;
```

The `isPrimary` hover keeps its existing `filter: brightness(1.2)` without the pulse.

For mobile scaling, update the button's `height` and `font-size`:

```css
height: clamp(36px, 5vw, 44px);
font-size: clamp(11px, 1.8vw, 14px);
```

---

### Step 7 — Verify

Run `npm run build` and confirm:

- Zero errors in Vite build output
- No PropTypes warnings in browser console
- All 12 atmosphere classes still apply correctly and update CSS variables
- Corner accents are visible and use `--accent-color`
- HUD status label updates on cube click (atmosphere change)
- Coordinates regenerate on each atmosphere change
- `GradientPlayer.jsx`, `FloatingButton.jsx`, and `App.css` are gone from the repo

---

## Technical Constraints & Guardrails

- **React 19**: Functional components only; use `useMemo` for coordinate generation
- **Cube Identity**: Only the `animation` declaration and `@keyframes rotate` block may be removed from `RotatingCube.css` — no other changes to that file
- **PropTypes**: Every component that accepts props must have a complete `propTypes` declaration
- **State**: All atmosphere state remains in `useAtmosphere`; never call the hook a second time inside child components — receive `currentAtmosphere` via props instead
- **Styling**: New global styles → `index.css`; component-scoped styles → existing `styled-components` file for that component
