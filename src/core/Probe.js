import DIRECTIONS, { turnLeft, turnRight, delta } from "./Direction";

export default class Probe {
  constructor(grid, x, y, direction) {
    if (!grid.isValid(x, y)) {
      throw new Error(`Invalid starting position (${x},${y})`);
    }
    if (!DIRECTIONS.includes(direction)) {
      throw new Error(`Invalid direction "${direction}", must be one of ${DIRECTIONS.join(", ")}`);
    }
    this.grid = grid;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.visited = [`(${x},${y})`];
  }

  forward() {
    const { dx, dy } = delta(this.direction);
    const nx = this.x + dx;
    const ny = this.y + dy;
    if (this.grid.isValid(nx, ny)) {
      this.x = nx;
      this.y = ny;
      this.visited.push(`(${this.x},${this.y})`);
      return null;
    }
    return this.grid.isOutOfBounds(nx, ny) ? "boundary" : "obstacle";
  }

  backward() {
    const { dx, dy } = delta(this.direction);
    const nx = this.x - dx;
    const ny = this.y - dy;
    if (this.grid.isValid(nx, ny)) {
      this.x = nx;
      this.y = ny;
      this.visited.push(`(${this.x},${this.y})`);
      return null;
    }
    return this.grid.isOutOfBounds(nx, ny) ? "boundary" : "obstacle";
  }

  left() {
    this.direction = turnLeft(this.direction);
  }

  right() {
    this.direction = turnRight(this.direction);
  }

  execute(commands) {
    let blockReason = null;
    for (const cmd of commands) {
      let result;
      switch (cmd) {
        case "F": result = this.forward(); break;
        case "B": result = this.backward(); break;
        case "L": this.left(); break;
        case "R": this.right(); break;
      }
      if (result) blockReason = result;
    }
    return blockReason;
  }
}
