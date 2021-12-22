import { avoidWalls, avoidYourself, info, avoidOthers } from '../src/logic'
import { Battlesnake, Coord, GameState, MoveResponse } from '../src/types';

const TEST_BOARD_WIDTH = 11
const TEST_BOARD_HEIGHT = 11

function createGameState(me: Battlesnake): GameState {
  return {
    game: {
      id: "",
      source: "test",
      ruleset: {
        name: "",
        version: "",
        settings: {
          foodSpawnChance: 5,
          minimumFood: 2,
          hazardDamagePerTurn: 14,
          royale: {
            shrinkEveryNTurns: 10
          },
          squad: {
            allowBodyCollisions: false,
            sharedElimination: true,
            sharedHealth: false,
            sharedLength: false
          }
        }
      },
      timeout: 0
    },
    turn: 0,
    board: {
      height: TEST_BOARD_HEIGHT,
      width: TEST_BOARD_WIDTH,
      food: [],
      snakes: [me],
      hazards: []
    },
    you: me
  }
}

function createBattlesnake(id: string, body: Coord[]): Battlesnake {
  return {
    id: id,
    name: id,
    health: 0,
    body: body,
    latency: "",
    head: body[0],
    length: body.length,
    shout: "",
    squad: ""
  }
}

describe('Battlesnake API Version', () => {
  it('should be api version 1', () => {
    const result = info()
    expect(result.apiversion).toBe("1")
  })
})

describe('Battlesnake avoids walls', () => {
  it('should not be able to turn left or down at origin corner', () => {
    const me = createBattlesnake(
      "me",
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 }
      ]
    )

    const gameState = createGameState(me)
    const possibleMoves = avoidWalls(gameState)
    expect(possibleMoves.left).toEqual(false)
    expect(possibleMoves.down).toEqual(false)
  })

  it('should not be able to turn right or up at top right corner', () => {
    const me = createBattlesnake(
      "me",
      [
        { x: TEST_BOARD_WIDTH - 1, y: TEST_BOARD_HEIGHT - 1 },
        { x: 10, y: 9 },
        { x: 10, y: 8 }
      ]
    )

    const gameState = createGameState(me)
    const possibleMoves = avoidWalls(gameState)

    expect(possibleMoves.right).toEqual(false)
    expect(possibleMoves.up).toEqual(false)
  })

})

describe('Battlesnake moves into open space', () => {
  it('should be able to go left if it is clear', () => {
    const me = createBattlesnake(
      "me",
      [
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 3, y: 3 }
      ]
    )

    const gameState = createGameState(me)
    let possibleMoves = avoidWalls(gameState)
    expect(possibleMoves.left).toEqual(true)

    possibleMoves = avoidYourself(gameState, possibleMoves)
    expect(possibleMoves.left).toEqual(true)
  })



  it('should be able to go right if it is clear', () => {
    const me = createBattlesnake(
      "me",
      [
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 1, y: 1 }
      ]
    )

    const gameState = createGameState(me)
    let possibleMoves = avoidWalls(gameState)
    expect(possibleMoves.right).toEqual(true)

    possibleMoves = avoidYourself(gameState, possibleMoves)
    expect(possibleMoves.right).toEqual(true)
  })



  it('should be able to go up if it is clear', () => {
    const me = createBattlesnake(
      "me",
      [
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
      ]
    )

    const gameState = createGameState(me)
    let possibleMoves = avoidWalls(gameState)
    expect(possibleMoves.up).toEqual(true)

    possibleMoves = avoidYourself(gameState, possibleMoves)
    expect(possibleMoves.up).toEqual(true)
  })

  it('should be able to go down if it is clear', () => {
    const me = createBattlesnake(
      "me",
      [
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 1, y: 1 },
        { x: 1, y: 0 },
      ]
    )

    const gameState = createGameState(me)
    let possibleMoves = avoidWalls(gameState)
    expect(possibleMoves.down).toEqual(true)

    possibleMoves = avoidYourself(gameState, possibleMoves)
    expect(possibleMoves.down).toEqual(true)
  })
})

describe('Battlesnake avoids itself', () => {
  it('should not run into itself to the bottom', () => {
    const me = createBattlesnake(
      "me",
      [
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ]
    )

    const gameState = createGameState(me)
    let possibleMoves = avoidWalls(gameState)
    expect(possibleMoves.down).toEqual(true)

    possibleMoves = avoidYourself(gameState, possibleMoves)
    expect(possibleMoves.down).toEqual(false)
  })

  it('should not run into itself to the top', () => {
    const me = createBattlesnake(
      "me",
      [
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 3 },
      ]
    )

    const gameState = createGameState(me)
    let possibleMoves = avoidWalls(gameState)
    expect(possibleMoves.up).toEqual(true)

    possibleMoves = avoidYourself(gameState, possibleMoves)
    expect(possibleMoves.up).toEqual(false)
  })

  it('should not run into itself to the right', () => {
    const me = createBattlesnake(
      "me",
      [
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 3, y: 3 }
      ]
    )

    const gameState = createGameState(me)
    let possibleMoves = avoidWalls(gameState)
    expect(possibleMoves.right).toEqual(true)

    possibleMoves = avoidYourself(gameState, possibleMoves)
    expect(possibleMoves.right).toEqual(false)
  })

  it('should not run into itself to the left', () => {
    const me = createBattlesnake(
      "me",
      [
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 1, y: 1 }
      ]
    )

    const gameState = createGameState(me)
    let possibleMoves = avoidWalls(gameState)
    expect(possibleMoves.left).toEqual(true)

    possibleMoves = avoidYourself(gameState, possibleMoves)
    expect(possibleMoves.left).toEqual(false)
  })
})

describe('Battlesnake avoids other snakes', () => {
  it('should not run into snake while moving up', () => {
    const me = createBattlesnake(
      "me",
      [
        { x: 2, y: 2 },
        { x: 2, y: 1 },
        { x: 2, y: 0 }
      ]
    )

    const blocker = createBattlesnake(
      "me",
      [
        { x: 1, y: 3 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
      ]
    )

    const gameState = createGameState(me)
    gameState.board.snakes = [me, blocker]

    let possibleMoves = avoidWalls(gameState)
    expect(possibleMoves.up).toEqual(true)

    possibleMoves = avoidYourself(gameState, possibleMoves)
    expect(possibleMoves.up).toEqual(true)

    possibleMoves = avoidOthers(gameState, possibleMoves)
    expect(possibleMoves.up).toEqual(false)
  })

  it('should not run into snake while moving down', () => {
    const me = createBattlesnake(
      "me",
      [
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 2, y: 4 }
      ]
    )

    const blocker = createBattlesnake(
      "me",
      [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
      ]
    )

    const gameState = createGameState(me)
    gameState.board.snakes = [me, blocker]

    let possibleMoves = avoidWalls(gameState)
    expect(possibleMoves.down).toEqual(true)

    possibleMoves = avoidYourself(gameState, possibleMoves)
    expect(possibleMoves.down).toEqual(true)

    possibleMoves = avoidOthers(gameState, possibleMoves)
    expect(possibleMoves.down).toEqual(false)
  })

  it('should not run into snake while moving left', () => {
    const me = createBattlesnake(
      "me",
      [
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 4, y: 2 }
      ]
    )

    const blocker = createBattlesnake(
      "me",
      [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
      ]
    )

    const gameState = createGameState(me)
    gameState.board.snakes = [me, blocker]

    let possibleMoves = avoidWalls(gameState)
    expect(possibleMoves.left).toEqual(true)

    possibleMoves = avoidYourself(gameState, possibleMoves)
    expect(possibleMoves.left).toEqual(true)

    possibleMoves = avoidOthers(gameState, possibleMoves)
    expect(possibleMoves.left).toEqual(false)
  })

  it('should not run into snake while moving right', () => {
    const me = createBattlesnake(
      "me",
      [
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 0, y: 2 }
      ]
    )

    const blocker = createBattlesnake(
      "me",
      [
        { x: 3, y: 1 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
      ]
    )

    const gameState = createGameState(me)
    gameState.board.snakes = [me, blocker]

    let possibleMoves = avoidWalls(gameState)
    expect(possibleMoves.right).toEqual(true)

    possibleMoves = avoidYourself(gameState, possibleMoves)
    expect(possibleMoves.right).toEqual(true)

    possibleMoves = avoidOthers(gameState, possibleMoves)
    expect(possibleMoves.right).toEqual(false)
  })
})

describe('Battlesnake moves toward food', () => {
})