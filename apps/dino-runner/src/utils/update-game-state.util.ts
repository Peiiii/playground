import { GameState } from '@/types/game.type'

const GROUND_HEIGHT = 20;
const CANVAS_HEIGHT = 400;
const DINO_HEIGHT = 60;
const GRAVITY = 0.8;

export function updateGameState(prevState: GameState): GameState {
  // Update dino position
  let newY = prevState.dino.y + prevState.dino.velocity;
  let newVelocity = prevState.dino.velocity + GRAVITY; // Apply gravity

  // Ground collision detection
  if (newY + DINO_HEIGHT > CANVAS_HEIGHT - GROUND_HEIGHT) {
    newY = CANVAS_HEIGHT - GROUND_HEIGHT - DINO_HEIGHT;
    newVelocity = 0;
  }

  const newDino = {
    ...prevState.dino,
    y: newY,
    velocity: newVelocity,
  }

  // Update obstacles
  const newObstacles = prevState.obstacles.map(obstacle => ({
    ...obstacle,
    x: obstacle.x - 5, // Move obstacles to the left
  })).filter(obstacle => obstacle.x + obstacle.width > 0) // Remove off-screen obstacles

  // Add new obstacles
  if (Math.random() < 0.02) { // 2% chance each frame
    newObstacles.push({
      x: 800,
      y: CANVAS_HEIGHT - GROUND_HEIGHT - 40, // Place obstacle on the ground
      width: 20,
      height: 40,
    })
  }

  // Check for collisions
  const isGameOver = newObstacles.some(obstacle =>
    newDino.x < obstacle.x + obstacle.width &&
    newDino.x + 40 > obstacle.x &&
    newDino.y < obstacle.y + obstacle.height &&
    newDino.y + DINO_HEIGHT > obstacle.y
  )

  return {
    ...prevState,
    dino: newDino,
    obstacles: newObstacles,
    score: isGameOver ? prevState.score : prevState.score + 1,
    isGameOver,
  }
}