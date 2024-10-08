import React, { createContext, useState, useCallback, useRef } from 'react'
import { GameState, initialGameState } from '@/types/game.type'

const CANVAS_HEIGHT = 400;
const GROUND_HEIGHT = 20;
const DINO_HEIGHT = 60;

export interface GameContextType extends GameState {
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  jump: () => void
  isPaused: boolean
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

export const GameContext = createContext<GameContextType>({
  ...initialGameState,
  startGame: () => {},
  pauseGame: () => {},
  resumeGame: () => {},
  jump: () => {},
  isPaused: false,
  setGameState: () => {},
})

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [isPaused, setIsPaused] = useState(false)
  const animationFrameId = useRef<number | null>(null)

  const startGame = useCallback(() => {
    setGameState(initialGameState)
    setIsPaused(false)
  }, [])

  const pauseGame = useCallback(() => {
    setIsPaused(true)
  }, [])

  const resumeGame = useCallback(() => {
    setIsPaused(false)
  }, [])

  const jump = useCallback(() => {
    if (!isPaused && !gameState.isGameOver) {
      console.log('Jump function executed'); // 调试日志
      setGameState(prevState => {
        // 检查恐龙是否在地面上
        const isOnGround = prevState.dino.y >= CANVAS_HEIGHT - GROUND_HEIGHT - DINO_HEIGHT;
        console.log('Is dino on ground:', isOnGround); // 调试日志
        if (isOnGround) {
          console.log('Dino is jumping'); // 调试日志
          return {
            ...prevState,
            dino: { ...prevState.dino, velocity: -20 }, // 增加向上的初始速度
          }
        }
        return prevState;
      })
    } else {
      console.log('Jump not executed. isPaused:', isPaused, 'isGameOver:', gameState.isGameOver); // 调试日志
    }
  }, [isPaused, gameState.isGameOver])

  return (
    <GameContext.Provider value={{
      ...gameState,
      startGame,
      pauseGame,
      resumeGame,
      jump,
      isPaused,
      setGameState,
    }}>
      {children}
    </GameContext.Provider>
  )
}