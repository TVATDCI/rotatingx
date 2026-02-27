# Rotating-X

A React 19 / Vite 7 application featuring a 3D rotating cube floating inside dynamic atmospheric environments. The cube is the controller — click it to cycle through 12 handpicked backgrounds. A glassmorphism HUD panel overlays the scene with live atmosphere telemetry and audio playback.

---

## Live Demo

Deployed via GitHub Pages → [TVATDCI/rotatingx](https://tvatdci.github.io/rotatingx)

---

## Features

- **Interactive 3D Cube** — mouse-reactive rotation speed driven by `requestAnimationFrame`; click anywhere to change the atmosphere
- **12 Atmospheric Environments** — space, nebula, galaxy, starfield, snowy mountains, sunset beach, Amazon forest, volcano, underwater, desert, moon surface, white diamond
- **Dynamic CSS Variable System** — every atmosphere overrides `--accent-color`, `--glow-color`, and `--bg-gradient`; the entire UI reacts automatically with no extra prop drilling
- **Glassmorphism 2.0 HUD Panel** — `backdrop-filter: blur(12px) saturate(180%)` with a gradient mask border driven by `--accent-color`
- **HUD Telemetry** — monospaced status bar showing the current atmosphere name and randomised GPS coordinates that regenerate on every environment change
- **L-shaped Corner Accents** — targeting-system bracket corners on the HUD panel, coloured by `--accent-color`
- **Dual Audio System** — SoundCloud widget (`MiniPlayer`) and a local three-track player (`MultiplePlayer`) with play/pause and track switching
- **Pulse Micro-interaction** — buttons animate a `box-shadow` glow pulse on hover via a `keyframes` animation that reads `--glow-color`
- **Mobile Scaling** — buttons use `clamp()` for fluid height and font-size across all screen sizes

---

## Tech Stack

| Layer           | Technology                                                   |
| --------------- | ------------------------------------------------------------ |
| Framework       | React 19.2                                                   |
| Build tool      | Vite 7.3                                                     |
| Styling         | Plain CSS (global) + styled-components v6 (component-scoped) |
| Prop validation | prop-types 15                                                |
| Deployment      | gh-pages                                                     |

---

## Project Structure

```
src/
├── main.jsx                  # App entry point
├── index.css                 # Global CSS variables, atmosphere themes, utility classes
├── App.jsx                   # Root component — owns atmosphere state via useAtmosphere
├── hooks/
│   └── useAtmosphere.js      # Custom hook: background state + changeAtmosphere callback
└── components/
    ├── RotatingCube.jsx      # 3D cube — rAF animation, mouse-reactive speed, click handler
    ├── RotatingCube.css      # Cube identity styles — faces, perspective, exploded look
    ├── MultiplePlayer.jsx    # HUD panel — local audio player, telemetry, corner accents
    ├── MiniPlayer.jsx        # SoundCloud widget wrapper with atmosphere-aware styling
    └── FancyButton.jsx       # Reusable styled button with HUD pulse animation
```

---

## React Concepts Used

1. **Custom Hook** — `useAtmosphere` encapsulates all atmosphere state and the `changeAtmosphere` callback
2. **`useState`** — tracks the active background string
3. **`useCallback`** — memoises `changeAtmosphere` to prevent unnecessary re-renders
4. **`useMemo`** — regenerates HUD coordinates only when `currentAtmosphere` changes
5. **`useRef`** — direct DOM access for cube transform and audio element management
6. **`useEffect`** — manages the `requestAnimationFrame` animation lifecycle
7. **Prop drilling** — `currentAtmosphere` passed from `App` → `MultiplePlayer` for HUD display
8. **PropTypes** — runtime prop validation on all components that accept props

---

## How It Works

### Atmosphere System

`useAtmosphere.js` holds a `background` string in React state. `App.jsx` applies it as a class on the root `<div>` (e.g. `<div className="app galaxy">`). Each atmosphere class in `index.css` overrides three CSS variables:

```css
.app.galaxy {
  --bg-gradient: radial-gradient(circle, #1a2a6c, #b21f1f, #fdbb2d);
  --accent-color: #fdbb2d;
  --glow-color: rgba(253, 187, 45, 0.6);
}
```

Every component that uses `var(--accent-color)` or `var(--glow-color)` updates instantly — the cube glow, button borders, HUD text, corner accents, and gradient border all react together.

### Cube Animation

`RotatingCube.jsx` runs a `requestAnimationFrame` loop that increments `angle.x` and `angle.y` each frame and writes the result directly to `cube.style.transform`. Moving the mouse over the scene adjusts the rotation speed in real time. Clicking anywhere on the scene calls `changeAtmosphere`.

### HUD Telemetry

`MultiplePlayer` receives `currentAtmosphere` as a prop from `App.jsx`. A `useMemo` block keyed on `currentAtmosphere` generates a new random lat/lon pair each time the atmosphere changes and formats it for display:

```
ATMOSPHERE: GALAXY | 34.7291°N 118.2435°W
```

---

## Getting Started

```bash
git clone https://github.com/TVATDCI/rotatingx.git
cd rotatingx
npm install
npm run dev       # development server
npm run build     # production build
npm run preview   # preview production build locally
npm run deploy    # build + push to gh-pages
```

---

## Refactor History

| Phase                       | Summary                                                                                                                                                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **V1 — Modernisation**      | React 18→19, Vite 5→7, extracted `useAtmosphere` hook, removed dead components, introduced CSS variable theme system, first glassmorphism pass                                                                                              |
| **V2 — HUD Transformation** | Glassmorphism 2.0 with CSS mask gradient border, corner accents, HUD telemetry label, `hudPulse` animation, `MiniPlayer` atmosphere integration, removed all dead code, fixed rAF/CSS animation conflict, 4 post-implementation debug fixes |

---

## Roadmap

### Near Term

- [ ] `prefers-reduced-motion` — disable `hudPulse` and slow rAF speed for accessibility
- [ ] Merge V2 debug fixes to `main` as a clean atomic commit
- [ ] CSS containment (`contain: layout paint`) on HUD panel for paint performance

### Phase 5 — Audio Visualisation

- [ ] Canvas-based waveform / frequency bar visualiser inside the HUD panel
- [ ] Corner accents pulse in sync with audio beat detection
- [ ] Display current track title, artist, and elapsed time

### Phase 6 — Interactivity

- [ ] Keyboard shortcuts — space to play/pause, arrow keys to change tracks, `R` to randomise atmosphere
- [ ] Click HUD coordinates to copy to clipboard
- [ ] Settings panel (gear icon) — adjustable blur amount, panel opacity, cube speed
- [ ] Fullscreen toggle

### Phase 7 — Accessibility & Performance

- [ ] ARIA live region announces atmosphere changes to screen readers
- [ ] Full keyboard tab navigation
- [ ] Lazy-load Unsplash background images with low-quality placeholder
- [ ] `will-change: transform` on `.rotating-cube`

### Phase 8 — Theming

- [ ] User-customisable atmosphere combinations
- [ ] Persist preferences to `localStorage`
- [ ] Import / export theme JSON

---

_Last updated: 2026-02-27 — V2 HUD Transformation complete_
