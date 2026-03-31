const DIRECTIONS = ["NORTH", "EAST", "SOUTH", "WEST"];

export function turnRight(direction) {
  const i = DIRECTIONS.indexOf(direction);
  return DIRECTIONS[(i + 1) % 4];
}

export function turnLeft(direction) {
  const i = DIRECTIONS.indexOf(direction);
  return DIRECTIONS[(i + 3) % 4];
}

export function delta(direction) {
  switch (direction) {
    case "NORTH": return { dx: 0, dy: 1 };
    case "EAST":  return { dx: 1, dy: 0 };
    case "SOUTH": return { dx: 0, dy: -1 };
    case "WEST":  return { dx: -1, dy: 0 };
  }
}

export default DIRECTIONS;
