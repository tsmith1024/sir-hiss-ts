import { InfoResponse, GameState, MoveResponse, Game, Coord } from "./types"
import { coordDown, coordLeft, coordRight, coordUp } from "./typeLogic"

export function info(): InfoResponse {
  console.log("INFO")
  const response: InfoResponse = {
    apiversion: "1",
    author: "",
    color: "#888888",
    head: "comet",
    tail: "comet"
  }
  return response
}

export function start(gameState: GameState): void {
  console.log(`${gameState.game.id} START`)
}

export function end(gameState: GameState): void {
  console.log(`${gameState.game.id} END\n`)
}

export function move(gameState: GameState): MoveResponse {
  let possibleMoves = avoidWalls(gameState)

  possibleMoves = avoidYourself(gameState, possibleMoves)

  possibleMoves = avoidOthers(gameState, possibleMoves)

  // let possibleMoves: { [key: string]: boolean } = {
  //   up: true,
  //   down: true,
  //   left: true,
  //   right: true
  // }

  // Step 0: Don't let your Battlesnake move back on it's own neck
  // const myHead = gameState.you.head
  // const myNeck = gameState.you.body[1]
  // console.log(`myHead (${myHead.x}, ${myHead.y})\nmyNeck (${myNeck.x}, ${myNeck.y})`)
  // // if (myNeck.x < myHead.x) {
  // //   possibleMoves.left = false
  // // } else if (myNeck.x > myHead.x) {
  // //   possibleMoves.right = false
  // // } else if (myNeck.y < myHead.y) {
  // //   possibleMoves.down = false
  // // } else if (myNeck.y > myHead.y) {
  // //   possibleMoves.up = false
  // // }

  // // // TODO: Step 2 - Don't hit yourself.
  // // // Use information in gameState to prevent your Battlesnake from colliding with itself.
  // // const mybody = gameState.you.body
  // // for (const section of mybody) {
  // //   if (myHead.x === section.x + 1) {
  // //     possibleMoves.left = false
  // //   } else if (myHead.x === section.x - 1) {
  // //     possibleMoves.right = false
  // //   } else if (myHead.y === section.y + 1) {
  // //     possibleMoves.down = false
  // //   } else if (myHead.y === section.y - 1) {
  // //     possibleMoves.up = false
  // //   }
  // // }

  // TODO: Step 3 - Don't collide with others.
  // Use information in gameState to prevent your Battlesnake from colliding with others.

  // TODO: Step 4 - Find food.
  // Use information in gameState to seek out and find food.

  // Finally, choose a move from the available safe moves.
  // TODO: Step 5 - Select a move to make based on strategy, rather than random.
  const moveChoices = Object.keys(possibleMoves).filter(key => possibleMoves[key])
  console.log(moveChoices)
  const response: MoveResponse = {
    move: moveChoices[Math.floor(Math.random() * moveChoices.length)],
  }

  console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
  return response
}

export function avoidWalls(gameState: GameState): { [key: string]: boolean } {
  const { height: boardHeight, width: boardWidth } = gameState.board
  const { body, head } = gameState.you

  let safeMoves: { [key: string]: boolean } = {
    up: true,
    down: true,
    left: true,
    right: true
  }

  // if at the origin
  if (head.x === 0) {
    safeMoves.left = false
  }

  if (head.x === boardWidth - 1) {
    safeMoves.right = false
  }

  if (head.y === 0) {
    safeMoves.down = false
  }

  if (head.y === boardHeight - 1) {
    safeMoves.up = false
  }

  return safeMoves
}

export function avoidYourself(gameState: GameState, possibleMoves: { [key: string]: boolean }): { [key: string]: boolean } {
  const { head, body } = gameState.you
  if (possibleMoves.up) {
    const topCoord: Coord = coordUp(head)
    if (coordinateIsOccupied(topCoord, body)) {
      possibleMoves.up = false
    }
  }

  if (possibleMoves.down) {
    const bottomCoord: Coord = coordDown(head)
    if (coordinateIsOccupied(bottomCoord, body)) {
      possibleMoves.down = false
    }
  }

  if (possibleMoves.left) {
    const leftCoord: Coord = coordLeft(head)
    if (coordinateIsOccupied(leftCoord, body)) {
      possibleMoves.left = false
    }
  }

  if (possibleMoves.right) {
    const rightCoord: Coord = coordRight(head)
    if (coordinateIsOccupied(rightCoord, body)) {
      possibleMoves.right = false
    }
  }
  return possibleMoves
}

export function avoidOthers(gameState: GameState, possibleMoves: { [key: string]: boolean }): { [key: string]: boolean } {
  const { head } = gameState.you
  const { snakes } = gameState.board

  let coords = snakes.flatMap(snake => snake.body)

  if (possibleMoves.up) {
    const coord = coordUp(head)
    if (coordinateIsOccupied(coord, coords)) {
      possibleMoves.up = false
    }
  }

  if (possibleMoves.down) {
    const coord = coordDown(head)
    if (coordinateIsOccupied(coord, coords)) {
      possibleMoves.down = false
    }
  }

  if (possibleMoves.left) {
    const coord = coordLeft(head)
    if (coordinateIsOccupied(coord, coords)) {
      possibleMoves.left = false
    }
  }

  if (possibleMoves.right) {
    const coord = coordRight(head)
    if (coordinateIsOccupied(coord, coords)) {
      possibleMoves.right = false
    }
  }

  return possibleMoves
}

function coordinateIsOccupied(coord: Coord, testSet: Coord[]): boolean {
  const coordIndex = testSet.findIndex((testCoord) =>
    compareCoordinates(coord, testCoord)
  )
  // if index is -1, it's not occupied
  return coordIndex != -1
}

function compareCoordinates(lhs: Coord, rhs: Coord): boolean {
  return lhs.x == rhs.x && lhs.y == rhs.y
}