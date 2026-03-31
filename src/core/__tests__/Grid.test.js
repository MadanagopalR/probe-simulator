import { describe, it, expect } from "vitest";
import Grid from "../Grid";

describe("Grid", () => {
  describe("construction", () => {
    it("creates a grid with the given size", () => {
      const grid = new Grid(5);
      expect(grid.size).toBe(5);
    });

    it("defaults to no obstacles", () => {
      const grid = new Grid(5);
      expect(grid.obstacles.size).toBe(0);
    });

    it("stores obstacles as a Set of 'x,y' strings", () => {
      const grid = new Grid(5, [{ x: 1, y: 2 }]);
      expect(grid.obstacles.has("1,2")).toBe(true);
    });

    it("throws if size is not a positive integer", () => {
      expect(() => new Grid(0)).toThrow();
      expect(() => new Grid(-1)).toThrow();
      expect(() => new Grid(1.5)).toThrow();
    });

    it("throws if an obstacle is placed outside the grid", () => {
      expect(() => new Grid(3, [{ x: 5, y: 0 }])).toThrow();
      expect(() => new Grid(3, [{ x: 0, y: -1 }])).toThrow();
    });
  });

  describe("isValid", () => {
    const grid = new Grid(5, [{ x: 2, y: 2 }]);

    it("returns true for a valid empty cell", () => {
      expect(grid.isValid(0, 0)).toBe(true);
    });

    it("returns true for the max-boundary cell", () => {
      expect(grid.isValid(4, 4)).toBe(true);
    });

    it("returns false for an obstacle cell", () => {
      expect(grid.isValid(2, 2)).toBe(false);
    });

    it("returns false for negative x", () => {
      expect(grid.isValid(-1, 0)).toBe(false);
    });

    it("returns false for negative y", () => {
      expect(grid.isValid(0, -1)).toBe(false);
    });

    it("returns false for x beyond grid boundary", () => {
      expect(grid.isValid(5, 0)).toBe(false);
    });

    it("returns false for y beyond grid boundary", () => {
      expect(grid.isValid(0, 5)).toBe(false);
    });
  });

  describe("multiple obstacles", () => {
    it("handles many obstacles correctly", () => {
      const obstacles = [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }];
      const grid = new Grid(5, obstacles);
      expect(grid.obstacles.size).toBe(3);
      expect(grid.isValid(0, 0)).toBe(false);
      expect(grid.isValid(1, 1)).toBe(false);
      expect(grid.isValid(3, 3)).toBe(true);
    });

    it("ignores duplicate obstacles", () => {
      const grid = new Grid(5, [{ x: 1, y: 1 }, { x: 1, y: 1 }]);
      expect(grid.obstacles.size).toBe(1);
    });
  });

  describe("isOutOfBounds", () => {
    const grid = new Grid(5);

    it("returns true for negative coordinates", () => {
      expect(grid.isOutOfBounds(-1, 0)).toBe(true);
      expect(grid.isOutOfBounds(0, -1)).toBe(true);
    });

    it("returns true for coordinates beyond grid size", () => {
      expect(grid.isOutOfBounds(5, 0)).toBe(true);
      expect(grid.isOutOfBounds(0, 5)).toBe(true);
    });

    it("returns false for valid coordinates", () => {
      expect(grid.isOutOfBounds(0, 0)).toBe(false);
      expect(grid.isOutOfBounds(4, 4)).toBe(false);
    });
  });

  describe("isObstacle", () => {
    const grid = new Grid(5, [{ x: 2, y: 3 }]);

    it("returns true for an obstacle cell", () => {
      expect(grid.isObstacle(2, 3)).toBe(true);
    });

    it("returns false for an empty cell", () => {
      expect(grid.isObstacle(0, 0)).toBe(false);
    });
  });
});
