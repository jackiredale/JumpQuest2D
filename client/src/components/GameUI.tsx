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
}

const GameUI = ({ phase, stats, onStartGame, onRestartGame, onToggleMute, isMuted }: GameUIProps) => {
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
            PLAY AGAIN
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
