import { describe, it, expect } from "vitest";
import DIRECTIONS, { turnRight, turnLeft, delta } from "../Direction";

describe("Direction", () => {
  describe("DIRECTIONS constant", () => {
    it("contains exactly four cardinal directions in clockwise order", () => {
      expect(DIRECTIONS).toEqual(["NORTH", "EAST", "SOUTH", "WEST"]);
    });
  });

  describe("turnRight", () => {
    it("NORTH → EAST", () => expect(turnRight("NORTH")).toBe("EAST"));
    it("EAST → SOUTH", () => expect(turnRight("EAST")).toBe("SOUTH"));
    it("SOUTH → WEST", () => expect(turnRight("SOUTH")).toBe("WEST"));
    it("WEST → NORTH", () => expect(turnRight("WEST")).toBe("NORTH"));
  });

  describe("turnLeft", () => {
    it("NORTH → WEST", () => expect(turnLeft("NORTH")).toBe("WEST"));
    it("WEST → SOUTH", () => expect(turnLeft("WEST")).toBe("SOUTH"));
    it("SOUTH → EAST", () => expect(turnLeft("SOUTH")).toBe("EAST"));
    it("EAST → NORTH", () => expect(turnLeft("EAST")).toBe("NORTH"));
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
