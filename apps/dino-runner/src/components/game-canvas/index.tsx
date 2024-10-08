import { useEffect, useRef } from 'react'
import { useGameLoop } from '@/hooks/use-game-loop'
import { drawGame } from '@/utils/draw-game.util'
import { useGameState } from '@/hooks/use-game-state'

function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameState = useGameLoop()
  const { jump } = useGameState()

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && gameState) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        drawGame(ctx, gameState)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault(); // 防止页面滚动
        console.log('Space key pressed'); // 调试日志
        jump();
        console.log('Jump function called'); // 调试日志
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [gameState, jump])

  return <canvas ref={canvasRef} width={800} height={400} style={{ border: '1px solid black' }} />
}

export default GameCanvas