export default class Grid {
  constructor(size, obstacleList = []) {
    if (!Number.isInteger(size) || size < 1) {
      throw new Error(`Grid size must be a positive integer, got ${size}`);
    }
    this.size = size;

    for (const { x, y } of obstacleList) {
      if (x < 0 || x >= size || y < 0 || y >= size) {
        throw new Error(`Obstacle (${x},${y}) is outside the ${size}×${size} grid`);
      }
    }
    this.obstacles = new Set(obstacleList.map(({ x, y }) => `${x},${y}`));
  }

  isValid(x, y) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size && !this.obstacles.has(`${x},${y}`);
  }

  isOutOfBounds(x, y) {
    return x < 0 || x >= this.size || y < 0 || y >= this.size;
  }

  isObstacle(x, y) {
    return this.obstacles.has(`${x},${y}`);
  }
}
