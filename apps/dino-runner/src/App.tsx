import './App.css'
import GameCanvas from '@/components/game-canvas'
import ScoreBoard from '@/components/score-board'
import Controls from '@/components/controls'
import { GameProvider } from '@/contexts/game-context'

function App() {
  return (
    <GameProvider>
      <div className="game-container">
        <h1>Dino Runner</h1>
        <GameCanvas />
        <ScoreBoard />
        <Controls />
      </div>
    </GameProvider>
  )
}

export default App
