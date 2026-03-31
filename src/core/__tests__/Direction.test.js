import { describe, it, expect } from "vitest";
import DIRECTIONS, { turnRight, turnLeft, delta } from "../Direction";

describe("Direction", () => {
  describe("DIRECTIONS constant", () => {
    it("contains exactly four cardinal directions in clockwise order", () => {
      expect(DIRECTIONS).toEqual(["NORTH", "EAST", "SOUTH", "WEST"]);
    });
  });

  describe("turnRight", () => {
    it("turns NORTH → EAST", () => {
      expect(turnRight("NORTH")).toBe("EAST");
    });

    it("turns EAST → SOUTH", () => {
      expect(turnRight("EAST")).toBe("SOUTH");
    });

    it("turns SOUTH → WEST", () => {
      expect(turnRight("SOUTH")).toBe("WEST");
    });

    it("turns WEST → NORTH (wraps around)", () => {
      expect(turnRight("WEST")).toBe("NORTH");
    });

    it("completes a full 360° rotation back to the start", () => {
      let dir = "NORTH";
      for (let i = 0; i < 4; i++) dir = turnRight(dir);
      expect(dir).toBe("NORTH");
    });
  });

  describe("turnLeft", () => {
    it("turns NORTH → WEST", () => {
      expect(turnLeft("NORTH")).toBe("WEST");
    });

    it("turns WEST → SOUTH", () => {
      expect(turnLeft("WEST")).toBe("SOUTH");
    });

    it("turns SOUTH → EAST", () => {
      expect(turnLeft("SOUTH")).toBe("EAST");
    });

    it("turns EAST → NORTH (wraps around)", () => {
      expect(turnLeft("EAST")).toBe("NORTH");
    });

    it("completes a full 360° counter-clockwise rotation", () => {
      let dir = "NORTH";
      for (let i = 0; i < 4; i++) dir = turnLeft(dir);
      expect(dir).toBe("NORTH");
    });
  });

  describe("turnLeft and turnRight are inverses", () => {
    it.each(DIRECTIONS)("turnLeft(turnRight(%s)) === %s", (dir) => {
      expect(turnLeft(turnRight(dir))).toBe(dir);
    });

    it.each(DIRECTIONS)("turnRight(turnLeft(%s)) === %s", (dir) => {
      expect(turnRight(turnLeft(dir))).toBe(dir);
    });
  });

  describe("delta", () => {
    it("NORTH moves +y", () => {
      expect(delta("NORTH")).toEqual({ dx: 0, dy: 1 });
    });

    it("EAST moves +x", () => {
      expect(delta("EAST")).toEqual({ dx: 1, dy: 0 });
    });

    it("SOUTH moves -y", () => {
      expect(delta("SOUTH")).toEqual({ dx: 0, dy: -1 });
    });

    it("WEST moves -x", () => {
      expect(delta("WEST")).toEqual({ dx: -1, dy: 0 });
    });

    it("returns undefined for an invalid direction", () => {
      expect(delta("UP")).toBeUndefined();
    });
  });
});
