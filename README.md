# Probe Simulator

An interactive ocean-floor exploration probe simulator built with React and Vite. Navigate a probe across a grid, avoid obstacles, and visualize its path in real time.

## Features

- **Configurable grid** — choose sizes from 3×3 to 10×10; each size comes with preset obstacles.
- **Directional probe** — a stylized spacecraft that rotates smoothly (N/E/S/W) with an animated thruster flame.
- **Two control modes**
  - **Button pad** — Forward, Backward, Left, Right buttons for step-by-step control.
  - **Command input** — type a sequence of commands (`F`, `B`, `L`, `R`) and press **Run** (or Enter) to execute them all at once.
- **Collision feedback** — the probe blinks **red** when hitting an obstacle and **amber** when hitting the grid boundary.
- **Path tracking** — visited coordinates are displayed in order so you can trace the probe's journey.
- **Reset** — returns the probe to the top-left corner facing North.

## Commands

| Key | Action |
|-----|--------|
| `F` | Move **forward** one cell in the facing direction |
| `B` | Move **backward** one cell (opposite to facing direction) |
| `L` | Turn **left** 90° (does not move) |
| `R` | Turn **right** 90° (does not move) |

Commands are case-insensitive in the input field (auto-uppercased). Unknown characters are silently ignored.

## Project Structure

```
probe-simulator/
├── public/                  # Static assets
├── src/
│   ├── main.jsx             # React entry point
│   ├── App.jsx              # UI: grid rendering, controls, state management
│   ├── App.css              # Styling (dark theme, probe animations, blink effects)
│   ├── core/
│   │   ├── Direction.js     # Cardinal directions, turning logic, movement deltas
│   │   ├── Grid.js          # Grid model with obstacle and boundary checking
│   │   ├── Probe.js         # Probe model: movement, turning, command execution
│   │   └── __tests__/
│   │       ├── Direction.test.js
│   │       ├── Grid.test.js
│   │       └── Probe.test.js
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

### Core Modules

| Module | Responsibility |
|--------|---------------|
| `Direction.js` | Defines `NORTH`, `EAST`, `SOUTH`, `WEST`; provides `turnLeft()`, `turnRight()`, and `delta()` for movement vectors. |
| `Grid.js` | Represents an N×N grid with obstacles. Exposes `isValid()`, `isOutOfBounds()`, and `isObstacle()`. |
| `Probe.js` | The probe entity. `forward()` and `backward()` return `null` on success, `"boundary"` or `"obstacle"` when blocked. `execute(commands)` runs a command string and returns the last block reason (or `null`). |

## Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node.js)

## Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd probe-simulator

# Install dependencies
npm install

# Start development server (opens http://localhost:5173)
npm run dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload on port 5173 |
| `npm run build` | Create production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run all tests once with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint with ESLint |

## Running Tests

```bash
# Run all 78 tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch
```

Test suites cover:
- **Direction** (24 tests) — turning, deltas, all cardinal directions
- **Grid** (19 tests) — construction, validation, boundary detection, obstacle detection
- **Probe** (35 tests) — movement, turning, command execution, block reasons, edge cases

## Tech Stack

- **React 19** — UI rendering
- **Vite 8** — Build tooling and dev server
- **Vitest 4** — Unit testing
- **ESLint 9** — Code linting

## Demo
<img width="1728" height="892" alt="image" src="https://github.com/user-attachments/assets/4539d071-9e1c-40bd-b805-8989d5b16334" />

