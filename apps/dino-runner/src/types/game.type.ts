export interface Dino {
  x: number
  y: number
  velocity: number
}

export interface Obstacle {
  x: number
  y: number
  width: number
  height: number
}

export interface GameState {
  dino: Dino
  obstacles: Obstacle[]
  score: number
  highScore: number
  isGameOver: boolean
}

export const initialGameState: GameState = {
  dino: { x: 50, y: 340, velocity: 0 }, // 调整 y 值，使恐龙位于地面上方
  obstacles: [],
  score: 0,
  highScore: 0,
  isGameOver: false,
}