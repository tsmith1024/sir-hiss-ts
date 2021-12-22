import { Coord } from "./types"

export function coordUp(originalCoord: Coord): Coord {
  return offsetCoordinate(originalCoord, 0, 1)
}

export function coordDown(originalCoord: Coord): Coord {
  return offsetCoordinate(originalCoord, 0, -1)
}

export function coordLeft(originalCoord: Coord): Coord {
  return offsetCoordinate(originalCoord, -1, 0)
}

export function coordRight(originalCoord: Coord): Coord {
  return offsetCoordinate(originalCoord, 1, 0)
}

function offsetCoordinate(originalCoord: Coord, xOffset: number, yOffset: number): Coord {
  return { x: originalCoord.x + xOffset, y: originalCoord.y + yOffset }
}