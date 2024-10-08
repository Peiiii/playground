import { useContext } from 'react'
import { GameContext } from '@/contexts/game-context'

export function useGameState() {
  return useContext(GameContext)
}