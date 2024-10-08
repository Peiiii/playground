import { useGameState } from '@/hooks/use-game-state'

function ScoreBoard() {
  const { score, highScore } = useGameState()

  return (
    <div className="score-board">
      <div>Score: {score}</div>
      <div>High Score: {highScore}</div>
    </div>
  )
}

export default ScoreBoard