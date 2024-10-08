import { useGameState } from '@/hooks/use-game-state'

function Controls() {
  const { isGameOver, startGame, pauseGame } = useGameState()

  return (
    <div className="controls">
      {isGameOver ? (
        <button onClick={startGame}>Start Game</button>
      ) : (
        <button onClick={pauseGame}>Pause</button>
      )}
    </div>
  )
}

export default Controls