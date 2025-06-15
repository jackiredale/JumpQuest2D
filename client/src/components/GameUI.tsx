import { GamePhase } from "../lib/stores/useGame";

interface GameUIProps {
  phase: GamePhase;
  stats: {
    score: number;
    lives: number;
    level: number;
  };
  onStartGame: () => void;
  onRestartGame: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  activePowerUps?: string[];
  onOpenShop?: () => void;
  totalCoins?: number;
}

const GameUI = ({ phase, stats, onStartGame, onRestartGame, onToggleMute, isMuted, activePowerUps = [], onOpenShop, totalCoins = 0 }: GameUIProps) => {
  return (
    <>
      {/* Game Stats HUD */}
      {phase === "playing" && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: '#333',
          fontFamily: 'Courier New, monospace',
          fontSize: '18px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(255,255,255,0.8)',
          zIndex: 10
        }}>
          <div>Score: {stats.score}</div>
          <div>Lives: {stats.lives}</div>
          <div>Level: {stats.level}</div>
          <div>Coins: {totalCoins}</div>
        </div>
      )}

      {/* Power-ups Display */}
      {phase === "playing" && activePowerUps.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '120px',
          left: '20px',
          color: '#333',
          fontFamily: 'Courier New, monospace',
          fontSize: '14px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(255,255,255,0.8)',
          zIndex: 10
        }}>
          <div style={{ marginBottom: '5px' }}>Active Power-ups:</div>
          {activePowerUps.map((powerUp, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '2px 8px',
              margin: '2px 0',
              borderRadius: '3px',
              border: '1px solid #333'
            }}>
              {powerUp === 'speed' && '🏃 Speed Boost'}
              {powerUp === 'jump' && '🦘 Jump Boost'}
              {powerUp === 'shield' && '🛡️ Shield'}
              {powerUp === 'double_jump' && '↕️ Double Jump'}
            </div>
          ))}
        </div>
      )}

      {/* Audio Control */}
      <button
        onClick={onToggleMute}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: '#4A90E2',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          fontFamily: 'Courier New, monospace',
          fontSize: '14px',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {/* Start Screen */}
      {phase === "ready" && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#333',
          fontFamily: 'Courier New, monospace',
          zIndex: 10
        }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', textShadow: '3px 3px 6px rgba(255,255,255,0.8)' }}>
            2D PLATFORMER
          </h1>
          <p style={{ fontSize: '18px', margin: '0 0 30px 0' }}>
            Use WASD or Arrow Keys to move and jump!
          </p>
          <button
            onClick={onStartGame}
            style={{
              background: '#F39C12',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              fontSize: '20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Courier New, monospace',
              boxShadow: '4px 4px 8px rgba(0,0,0,0.3)'
            }}
          >
            START GAME
          </button>
        </div>
      )}

      {/* Game Over Screen */}
      {phase === "ended" && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#333',
          fontFamily: 'Courier New, monospace',
          zIndex: 10
        }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', textShadow: '3px 3px 6px rgba(255,255,255,0.8)' }}>
            GAME OVER
          </h1>
          <p style={{ fontSize: '24px', margin: '0 0 10px 0' }}>
            Final Score: {stats.score}
          </p>
          <p style={{ fontSize: '18px', margin: '0 0 30px 0' }}>
            Level Reached: {stats.level}
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={onRestartGame}
              style={{
                background: '#F39C12',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                fontSize: '20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'Courier New, monospace',
                boxShadow: '4px 4px 8px rgba(0,0,0,0.3)'
              }}
            >
              RESTART GAME
            </button>
          </div>
        </div>
      )}

      {/* Death Screen (when lives lost but not game over) */}
      {stats.lives <= 0 && phase === "playing" && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#333',
          fontFamily: 'Courier New, monospace',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '30px',
          borderRadius: '15px',
          border: '3px solid #FF6B6B'
        }}>
          <h2 style={{ fontSize: '36px', margin: '0 0 15px 0', color: '#FF6B6B' }}>
            YOU DIED!
          </h2>
          <p style={{ fontSize: '18px', margin: '0 0 20px 0' }}>
            Score: {stats.score} | Level: {stats.level}
          </p>
          <button
            onClick={onRestartGame}
            style={{
              background: '#FF6B6B',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              fontSize: '16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Courier New, monospace',
              boxShadow: '3px 3px 6px rgba(0,0,0,0.3)'
            }}
          >
            RESTART
          </button>
        </div>
      )}

      {/* Instructions */}
      {phase === "playing" && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#333',
          fontFamily: 'Courier New, monospace',
          fontSize: '14px',
          textAlign: 'center',
          textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
          zIndex: 10
        }}>
          WASD / Arrow Keys: Move • Space: Jump • Collect coins to score!
        </div>
      )}
    </>
  );
};

export default GameUI;
