import { useState, useEffect, useRef } from 'react'
import { updateGameState } from '@/utils/update-game-state.util'
import { useGameState } from '@/hooks/use-game-state'
import { GameState, initialGameState } from '@/types/game.type'

export function useGameLoop() {
  const { isPaused, setGameState } = useGameState()
  const [gameState, setLocalGameState] = useState<GameState>(initialGameState)
  const animationFrameId = useRef<number | null>(null)

  useEffect(() => {
    const loop = () => {
      if (!isPaused) {
        setLocalGameState(prevState => {
          const newState = updateGameState(prevState)
          setGameState(newState)
          return newState
        })
      }
      animationFrameId.current = requestAnimationFrame(loop)
    }

    animationFrameId.current = requestAnimationFrame(loop)

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [isPaused, setGameState])

  return gameState
}