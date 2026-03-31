import { describe, it, expect } from "vitest";
import Grid from "../src/core/Grid";
import Probe from "../src/core/Probe";

describe("Probe", () => {
  const grid = new Grid(5);
  const gridWithObstacles = new Grid(5, [{ x: 1, y: 1 }, { x: 3, y: 3 }]);

  describe("construction", () => {
    it("initialises at the given position and direction", () => {
      const probe = new Probe(grid, 0, 0, "NORTH");
      expect(probe.x).toBe(0);
      expect(probe.y).toBe(0);
      expect(probe.direction).toBe("NORTH");
    });

    it("records the starting position as the first visited cell", () => {
      const probe = new Probe(grid, 2, 3, "EAST");
      expect(probe.visited).toEqual(["(2,3)"]);
    });

    it("throws if starting position is outside the grid", () => {
      expect(() => new Probe(grid, -1, 0, "NORTH")).toThrow();
      expect(() => new Probe(grid, 0, 5, "NORTH")).toThrow();
    });

    it("throws if starting position is on an obstacle", () => {
      expect(() => new Probe(gridWithObstacles, 1, 1, "NORTH")).toThrow();
    });

    it("throws for an invalid direction", () => {
      expect(() => new Probe(grid, 0, 0, "UP")).toThrow();
    });
  });

  describe("forward", () => {
    it("moves one cell in the facing direction", () => {
      const probe = new Probe(grid, 0, 0, "NORTH");
      probe.forward();
      expect(probe.x).toBe(0);
      expect(probe.y).toBe(1);
    });

    it("does not move if it would leave the grid", () => {
      const probe = new Probe(grid, 0, 4, "NORTH");
      probe.forward();
      expect(probe.x).toBe(0);
      expect(probe.y).toBe(4);
    });

    it("does not move into an obstacle", () => {
      const probe = new Probe(gridWithObstacles, 1, 0, "NORTH");
      probe.forward(); // would go to (1,1) which is an obstacle
      expect(probe.x).toBe(1);
      expect(probe.y).toBe(0);
    });

    it("returns null on successful move", () => {
      const probe = new Probe(grid, 0, 0, "NORTH");
      expect(probe.forward()).toBeNull();
    });

    it("returns 'boundary' when blocked by grid edge", () => {
      const probe = new Probe(grid, 0, 4, "NORTH");
      expect(probe.forward()).toBe("boundary");
    });

    it("returns 'obstacle' when blocked by an obstacle", () => {
      const probe = new Probe(gridWithObstacles, 1, 0, "NORTH");
      expect(probe.forward()).toBe("obstacle");
    });

    it("records the new position in visited", () => {
      const probe = new Probe(grid, 0, 0, "EAST");
      probe.forward();
      expect(probe.visited).toEqual(["(0,0)", "(1,0)"]);
    });
  });

  describe("backward", () => {
    it("moves one cell opposite to the facing direction", () => {
      const probe = new Probe(grid, 2, 2, "NORTH");
      probe.backward();
      expect(probe.x).toBe(2);
      expect(probe.y).toBe(1);
    });

    it("does not move if it would leave the grid", () => {
      const probe = new Probe(grid, 0, 0, "NORTH");
      probe.backward(); // would go to (0,-1)
      expect(probe.x).toBe(0);
      expect(probe.y).toBe(0);
    });

    it("does not move backward into an obstacle", () => {
      const probe = new Probe(gridWithObstacles, 1, 2, "NORTH");
      probe.backward(); // would go to (1,1) which is an obstacle
      expect(probe.x).toBe(1);
      expect(probe.y).toBe(2);
    });

    it("returns null on successful move", () => {
      const probe = new Probe(grid, 2, 2, "NORTH");
      expect(probe.backward()).toBeNull();
    });

    it("returns 'boundary' when blocked by grid edge", () => {
      const probe = new Probe(grid, 0, 0, "NORTH");
      expect(probe.backward()).toBe("boundary");
    });

    it("returns 'obstacle' when blocked by an obstacle", () => {
      const probe = new Probe(gridWithObstacles, 1, 2, "NORTH");
      expect(probe.backward()).toBe("obstacle");
    });
  });

  describe("turning", () => {
    it("left changes direction without moving", () => {
      const probe = new Probe(grid, 2, 2, "NORTH");
      probe.left();
      expect(probe.direction).toBe("WEST");
      expect(probe.x).toBe(2);
      expect(probe.y).toBe(2);
    });

    it("right changes direction without moving", () => {
      const probe = new Probe(grid, 2, 2, "NORTH");
      probe.right();
      expect(probe.direction).toBe("EAST");
      expect(probe.x).toBe(2);
      expect(probe.y).toBe(2);
    });

    it("turning does not add to visited list", () => {
      const probe = new Probe(grid, 0, 0, "NORTH");
      probe.left();
      probe.right();
      expect(probe.visited).toEqual(["(0,0)"]);
    });
  });

  describe("execute", () => {
    it("processes a sequence of commands", () => {
      const probe = new Probe(grid, 0, 0, "NORTH");
      probe.execute("FFRFF");
      expect(probe.x).toBe(2);
      expect(probe.y).toBe(2);
      expect(probe.direction).toBe("EAST");
    });

    it("ignores unknown commands gracefully", () => {
      const probe = new Probe(grid, 0, 0, "NORTH");
      probe.execute("FXF");
      expect(probe.y).toBe(2); // two forward moves
    });

    it("handles empty command string", () => {
      const probe = new Probe(grid, 1, 1, "SOUTH");
      probe.execute("");
      expect(probe.x).toBe(1);
      expect(probe.y).toBe(1);
      expect(probe.direction).toBe("SOUTH");
    });

    it("stops at grid boundary mid-sequence", () => {
      const probe = new Probe(grid, 0, 3, "NORTH");
      probe.execute("FFFFF"); // only 1 move possible before hitting edge
      expect(probe.y).toBe(4);
    });

    it("navigates around an obstacle", () => {
      // obstacle at (1,1) — go NORTH, try EAST into obstacle, turn, go around
      const probe = new Probe(gridWithObstacles, 0, 0, "NORTH");
      probe.execute("FFRFF"); // (0,0)→(0,1)→(0,2)→face EAST→(1,2)→(2,2)
      expect(probe.x).toBe(2);
      expect(probe.y).toBe(2);
    });

    it("returns null when no move is blocked", () => {
      const probe = new Probe(grid, 0, 0, "NORTH");
      expect(probe.execute("FF")).toBeNull();
    });

    it("returns 'boundary' when a move hits grid edge", () => {
      const probe = new Probe(grid, 0, 3, "NORTH");
      expect(probe.execute("FFF")).toBe("boundary");
    });

    it("returns 'obstacle' when a move hits an obstacle", () => {
      const probe = new Probe(gridWithObstacles, 0, 0, "NORTH");
      // (0,0)→(0,1)→face EAST→(1,1) is obstacle
      expect(probe.execute("FRF")).toBe("obstacle");
    });

    it("returns last block reason when both boundary and obstacle hit", () => {
      const probe = new Probe(gridWithObstacles, 1, 0, "NORTH");
      // F→(1,1) obstacle, then L faces WEST, F→(0,0), FFFF hits boundary
      expect(probe.execute("FLFFFFFF")).toBe("boundary");
    });
  });

  describe("visited summary", () => {
    it("tracks the complete path", () => {
      const probe = new Probe(grid, 0, 0, "EAST");
      probe.execute("FFB");
      expect(probe.visited).toEqual(["(0,0)", "(1,0)", "(2,0)", "(1,0)"]);
    });

    it("does not duplicate position for blocked moves", () => {
      const probe = new Probe(grid, 0, 0, "WEST");
      probe.forward(); // blocked at boundary
      expect(probe.visited).toEqual(["(0,0)"]);
    });
  });

  describe("edge cases", () => {
    it("works on a 1×1 grid (cannot move anywhere)", () => {
      const tinyGrid = new Grid(1);
      const probe = new Probe(tinyGrid, 0, 0, "NORTH");
      probe.execute("FFFF");
      expect(probe.x).toBe(0);
      expect(probe.y).toBe(0);
      expect(probe.visited).toEqual(["(0,0)"]);
    });

    it("handles a long command string efficiently", () => {
      const probe = new Probe(grid, 2, 2, "NORTH");
      const longCmd = "FRFL".repeat(100);
      probe.execute(longCmd);
      // Should not throw, should stay within bounds
      expect(probe.x).toBeGreaterThanOrEqual(0);
      expect(probe.x).toBeLessThan(5);
      expect(probe.y).toBeGreaterThanOrEqual(0);
      expect(probe.y).toBeLessThan(5);
    });

    it("probe in a corner can only move in limited directions", () => {
      const probe = new Probe(grid, 4, 4, "NORTH");
      probe.forward(); // blocked (north boundary)
      probe.right();
      probe.forward(); // blocked (east boundary)
      expect(probe.x).toBe(4);
      expect(probe.y).toBe(4);
    });
  });
});
