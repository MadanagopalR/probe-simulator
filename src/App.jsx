import { useState, useRef, useMemo } from "react";
import Grid from "./core/Grid";
import Probe from "./core/Probe";
import "./App.css";

const DEFAULT_SIZE = 5;
const OBSTACLES_MAP = {
  3: [{ x: 1, y: 1 }],
  4: [{ x: 1, y: 2 }, { x: 2, y: 2 }],
  5: [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 1 }],
  6: [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 4, y: 3 }],
  7: [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 5 }],
  8: [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 6 }, { x: 6, y: 1 }],
  9: [{ x: 2, y: 3 }, { x: 4, y: 5 }, { x: 6, y: 7 }, { x: 7, y: 1 }],
  10: [{ x: 2, y: 3 }, { x: 4, y: 5 }, { x: 6, y: 7 }, { x: 8, y: 2 }, { x: 1, y: 8 }],
};

const DIRECTION_ROTATION = {
  NORTH: 0, EAST: 90, SOUTH: 180, WEST: 270,
};

export default function App() {
  const [gridSize, setGridSize] = useState(DEFAULT_SIZE);
  const grid = useMemo(() => new Grid(gridSize, OBSTACLES_MAP[gridSize] || []), [gridSize]);
  const [probe, setProbe] = useState(() => new Probe(grid, 0, gridSize - 1, "NORTH"));
  const [commands, setCommands] = useState("");
  const [error, setError] = useState("");
  const [blockType, setBlockType] = useState(null);
  const blinkTimeout = useRef(null);

  const triggerBlink = (reason) => {
    setBlockType(reason);
    clearTimeout(blinkTimeout.current);
    blinkTimeout.current = setTimeout(() => setBlockType(null), 600);
  };

  const moveProbe = (action) => {
    const newProbe = new Probe(grid, probe.x, probe.y, probe.direction);
    newProbe.visited = [...probe.visited];
    let result = null;
    switch (action) {
      case "F": result = newProbe.forward(); break;
      case "B": result = newProbe.backward(); break;
      case "L": newProbe.left(); break;
      case "R": newProbe.right(); break;
    }
    setProbe(newProbe);
    setError("");
    if (result) triggerBlink(result);
  };

  const runCommands = () => {
    try {
      const newProbe = new Probe(grid, probe.x, probe.y, probe.direction);
      newProbe.visited = [...probe.visited];
      const blockReason = newProbe.execute(commands);
      setProbe(newProbe);
      setError("");
      if (blockReason) triggerBlink(blockReason);
    } catch (e) {
      setError(e.message);
    }
  };

  const changeGridSize = (newSize) => {
    setGridSize(newSize);
    const newGrid = new Grid(newSize, OBSTACLES_MAP[newSize] || []);
    setProbe(new Probe(newGrid, 0, newSize - 1, "NORTH"));
    setCommands("");
    setError("");
    setBlockType(null);
  };

  const reset = () => {
    setProbe(new Probe(grid, 0, gridSize - 1, "NORTH"));
    setCommands("");
    setError("");
    setBlockType(null);
  };

  return (
    <div className="container">
      <h1>🚀 Probe Simulator</h1>
      <p className="subtitle">Ocean floor exploration probe</p>

      <div className="grid-config">
        <label>Grid Size:</label>
        <select value={gridSize} onChange={(e) => changeGridSize(Number(e.target.value))}>
          {[3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
            <option key={s} value={s}>{s} × {s}</option>
          ))}
        </select>
      </div>

      <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 56px)` }}>
        {[...Array(gridSize)].map((_, row) =>
          [...Array(gridSize)].map((_, col) => {
            const x = col;
            const y = gridSize - 1 - row;

            const isProbe = probe.x === x && probe.y === y;
            const isObstacle = grid.obstacles.has(`${x},${y}`);

            return (
              <div
                key={`${x}-${y}`}
                className={`cell${isProbe ? " probe" : ""}${isProbe && blockType === "obstacle" ? " blink-obstacle" : ""}${isProbe && blockType === "boundary" ? " blink-boundary" : ""}${isObstacle ? " obstacle" : ""}`}
                title={`(${x},${y})`}
              >
                {isProbe
                  ? <div className="probe-body" style={{ transform: `rotate(${DIRECTION_ROTATION[probe.direction]}deg)` }}>
                      <div className="probe-nose" />
                      <div className="probe-wing left" />
                      <div className="probe-wing right" />
                      <div className="probe-thruster" />
                    </div>
                  : isObstacle
                  ? "⛰️"
                  : ""}
              </div>
            );
          })
        )}
      </div>

      <div className="pad-row">
        <div className="pad-panel">
          <span className="pad-label">Move</span>
          <div className="pad-buttons">
            <button className="pad-btn move forward" onClick={() => moveProbe("F")}>Forward</button>
            <button className="pad-btn move backward" onClick={() => moveProbe("B")}>Backward</button>
          </div>
        </div>
        <div className="pad-panel">
          <span className="pad-label">Direction</span>
          <div className="pad-buttons">
            <button className="pad-btn turn turn-left" onClick={() => moveProbe("L")}>Left</button>
            <button className="pad-btn turn turn-right" onClick={() => moveProbe("R")}>Right</button>
          </div>
        </div>
      </div>

      <div className="controls">
        <input
          value={commands}
          onChange={(e) => setCommands(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && runCommands()}
        />
        <button onClick={runCommands}>Run</button>
        <button className="reset" onClick={reset}>Reset</button>
      </div>

      <div className="legend">
        <span><kbd>F</kbd> Forward</span>
        <span><kbd>B</kbd> Backward</span>
        <span><kbd>L</kbd> Left</span>
        <span><kbd>R</kbd> Right</span>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="status">
        <p><strong>Position:</strong> ({probe.x}, {probe.y}) facing {probe.direction}</p>
        <p><strong>Visited:</strong> {probe.visited.join(" → ")}</p>
      </div>
    </div>
  );
}