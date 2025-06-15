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
  timeRemaining?: number;
}

const GameUI = ({ 
  phase, 
  stats, 
  onStartGame, 
  onRestartGame, 
  onToggleMute, 
  isMuted, 
  activePowerUps = [], 
  onOpenShop, 
  totalCoins = 0,
  timeRemaining = 0
}: GameUIProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Enhanced Game Stats HUD */}
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
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '15px',
          borderRadius: '10px',
          border: '2px solid #333',
          minWidth: '200px'
        }}>
          <div style={{ marginBottom: '5px' }}>Score: {stats.score.toLocaleString()}</div>
          <div style={{ marginBottom: '5px' }}>Lives: {'❤️'.repeat(stats.lives)}</div>
          <div style={{ marginBottom: '5px' }}>Level: {stats.level}</div>
          <div style={{ marginBottom: '5px' }}>Coins: 💰 {totalCoins}</div>
          {timeRemaining > 0 && (
            <div style={{ 
              color: timeRemaining < 30 ? '#FF0000' : '#333',
              fontWeight: 'bold'
            }}>
              Time: {formatTime(timeRemaining)}
            </div>
          )}
        </div>
      )}

      {/* Enhanced Power-ups Display */}
      {phase === "playing" && activePowerUps.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          color: '#333',
          fontFamily: 'Courier New, monospace',
          fontSize: '14px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(255,255,255,0.8)',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '15px',
          borderRadius: '10px',
          border: '2px solid #333',
          minWidth: '180px'
        }}>
          <div style={{ marginBottom: '8px', textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
            Active Power-ups
          </div>
          {activePowerUps.map((powerUp, index) => (
            <div key={index} style={{
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.8), rgba(240, 240, 240, 0.8))',
              padding: '8px 12px',
              margin: '5px 0',
              borderRadius: '8px',
              border: '2px solid #4A90E2',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {powerUp === 'speed' && (
                <>
                  <span style={{ fontSize: '16px' }}>🏃</span>
                  <span>Speed Boost</span>
                </>
              )}
              {powerUp === 'jump' && (
                <>
                  <span style={{ fontSize: '16px' }}>🦘</span>
                  <span>Jump Boost</span>
                </>
              )}
              {powerUp === 'shield' && (
                <>
                  <span style={{ fontSize: '16px' }}>🛡️</span>
                  <span>Shield</span>
                </>
              )}
              {powerUp === 'double_jump' && (
                <>
                  <span style={{ fontSize: '16px' }}>↕️</span>
                  <span>Double Jump</span>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Audio Control */}
      <button
        onClick={onToggleMute}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          background: '#4A90E2',
          color: 'white',
          border: 'none',
          padding: '12px 18px',
          borderRadius: '50%',
          fontFamily: 'Courier New, monospace',
          fontSize: '18px',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        }}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {/* Enhanced Start Screen */}
      {phase === "ready" && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#333',
          fontFamily: 'Courier New, monospace',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '20px',
          border: '4px solid #333',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
        }}>
          <h1 style={{ 
            fontSize: '56px', 
            margin: '0 0 20px 0', 
            textShadow: '4px 4px 8px rgba(0,0,0,0.3)',
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            SUPER PLATFORMER
          </h1>
          <p style={{ fontSize: '18px', margin: '0 0 15px 0', color: '#666' }}>
            Master the art of platforming with enhanced mechanics!
          </p>
          <div style={{
            background: 'rgba(240, 240, 240, 0.8)',
            padding: '15px',
            borderRadius: '10px',
            margin: '0 0 20px 0',
            border: '2px solid #DDD'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Controls:</div>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div>🎮 WASD / Arrow Keys: Move</div>
              <div>🚀 Space: Jump (Double jump available!)</div>
              <div>⚡ Shift / X: Dash</div>
              <div>🧱 Wall Jump: Jump while touching walls</div>
            </div>
          </div>
          <div style={{ 
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            padding: '15px',
            borderRadius: '10px',
            margin: '0 0 30px 0',
            border: '2px solid #B8860B',
            color: '#333'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>💰 Total Coins: {totalCoins}</div>
            <div style={{ fontSize: '14px', marginTop: '5px' }}>Collect coins, gems, and stars for points!</div>
          </div>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onStartGame}
              style={{
                background: 'linear-gradient(45deg, #F39C12, #E67E22)',
                color: 'white',
                border: 'none',
                padding: '18px 36px',
                fontSize: '22px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: 'Courier New, monospace',
                boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                transition: 'all 0.2s ease',
                fontWeight: 'bold'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
              }}
            >
              🎮 START ADVENTURE
            </button>
            {onOpenShop && (
              <button
                onClick={onOpenShop}
                style={{
                  background: 'linear-gradient(45deg, #4A90E2, #357ABD)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 36px',
                  fontSize: '22px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontFamily: 'Courier New, monospace',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s ease',
                  fontWeight: 'bold'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
                }}
              >
                🎩 HAT SHOP
              </button>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Game Over Screen */}
      {phase === "ended" && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#333',
          fontFamily: 'Courier New, monospace',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '20px',
          border: '4px solid #333',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
        }}>
          <h1 style={{ 
            fontSize: '48px', 
            margin: '0 0 20px 0', 
            textShadow: '3px 3px 6px rgba(255,255,255,0.8)',
            color: '#E74C3C'
          }}>
            🏆 ADVENTURE COMPLETE!
          </h1>
          <div style={{
            background: 'linear-gradient(45deg, #3498DB, #2980B9)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            margin: '0 0 20px 0',
            border: '2px solid #2471A3'
          }}>
            <p style={{ fontSize: '28px', margin: '0 0 10px 0', fontWeight: 'bold' }}>
              Final Score: {stats.score.toLocaleString()}
            </p>
            <p style={{ fontSize: '20px', margin: '0 0 10px 0' }}>
              Levels Completed: {stats.level}
            </p>
            <p style={{ fontSize: '18px', margin: '0' }}>
              Total Coins Earned: {totalCoins}
            </p>
          </div>
          <div style={{
            background: 'rgba(240, 240, 240, 0.8)',
            padding: '15px',
            borderRadius: '10px',
            margin: '0 0 30px 0',
            border: '2px solid #DDD'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>🎉 Congratulations!</div>
            <div style={{ fontSize: '14px' }}>You've mastered the platforming challenges!</div>
          </div>
          <button
            onClick={onRestartGame}
            style={{
              background: 'linear-gradient(45deg, #F39C12, #E67E22)',
              color: 'white',
              border: 'none',
              padding: '18px 36px',
              fontSize: '22px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontFamily: 'Courier New, monospace',
              boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
            }}
          >
            🔄 PLAY AGAIN
          </button>
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
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '30px',
          borderRadius: '15px',
          border: '3px solid #FF6B6B',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ fontSize: '36px', margin: '0 0 15px 0', color: '#FF6B6B' }}>
            💀 GAME OVER!
          </h2>
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            padding: '15px',
            borderRadius: '10px',
            margin: '0 0 20px 0',
            border: '2px solid #FF6B6B'
          }}>
            <p style={{ fontSize: '18px', margin: '0 0 10px 0' }}>
              Score: {stats.score.toLocaleString()}
            </p>
            <p style={{ fontSize: '16px', margin: '0 0 10px 0' }}>
              Level Reached: {stats.level}
            </p>
            <p style={{ fontSize: '14px', margin: '0' }}>
              Coins Collected: {totalCoins}
            </p>
          </div>
          <button
            onClick={onRestartGame}
            style={{
              background: 'linear-gradient(45deg, #FF6B6B, #E55353)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              fontSize: '18px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: 'Courier New, monospace',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            }}
          >
            🔄 TRY AGAIN
          </button>
        </div>
      )}

      {/* Enhanced Instructions */}
      {phase === "playing" && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          color: '#333',
          fontFamily: 'Courier New, monospace',
          fontSize: '12px',
          textAlign: 'left',
          textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #DDD',
          maxWidth: '300px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>🎮 Controls:</div>
          <div>WASD/Arrows: Move • Space: Jump • Shift/X: Dash</div>
          <div style={{ marginTop: '5px', fontSize: '11px', color: '#666' }}>
            💡 Tip: Use wall jumps and dash to reach higher platforms!
          </div>
        </div>
      )}
    </>
  );
};

export default GameUI;