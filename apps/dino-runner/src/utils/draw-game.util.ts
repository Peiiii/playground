import { GameState } from '@/types/game.type'

const dinoImage = new Image()
dinoImage.src = 'https://dinorunner.com/static/images/default/logo.png'

let isImageLoaded = false
dinoImage.onload = () => {
  isImageLoaded = true
  console.log('Dino image loaded successfully')
}

dinoImage.onerror = (error) => {
  console.error('Error loading dino image:', error)
}

export function drawGame(ctx: CanvasRenderingContext2D, gameState: GameState) {
  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Draw the ground
  ctx.fillStyle = 'black'
  ctx.fillRect(0, ctx.canvas.height - 20, ctx.canvas.width, 20)

  // Draw the dino
  if (isImageLoaded) {
    ctx.drawImage(dinoImage, gameState.dino.x, gameState.dino.y, 60, 60)
    // console.log('Drawing dino at:', gameState.dino.x, gameState.dino.y)
  } else {
    // 如果图片还没加载完成，先画一个占位符
    ctx.fillStyle = 'green'
    ctx.fillRect(gameState.dino.x, gameState.dino.y, 60, 60)
    // console.log('Drawing placeholder at:', gameState.dino.x, gameState.dino.y)
  }

  // Draw obstacles
  ctx.fillStyle = 'red'
  gameState.obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
    // console.log('Drawing obstacle at:', obstacle.x, obstacle.y)
  })

  // Draw score
  ctx.fillStyle = 'black'
  ctx.font = '20px Arial'
  ctx.fillText(`Score: ${gameState.score}`, 10, 30)

  // Debug info
  ctx.fillText(`Canvas size: ${ctx.canvas.width}x${ctx.canvas.height}`, 10, 60)
  ctx.fillText(`Dino position: (${gameState.dino.x}, ${gameState.dino.y})`, 10, 90)
  ctx.fillText(`Game state: ${gameState.isGameOver ? 'Game Over' : 'Playing'}`, 10, 120)
  ctx.fillText(`Obstacles: ${gameState.obstacles.length}`, 10, 150)
}