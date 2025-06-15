import { useEffect, useRef, useState } from "react";
import GameCanvas from "./GameCanvas";
import GameUI from "./GameUI";
import { GameEngine } from "../lib/game/GameEngine";
import { useGame } from "../lib/stores/useGame";
import { useAudio } from "../lib/stores/useAudio";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const { phase, start, restart } = useGame();
  const { backgroundMusic, toggleMute, isMuted } = useAudio();
  const [gameStats, setGameStats] = useState({
    score: 0,
    lives: 3,
    level: 1
  });
  const [activePowerUps, setActivePowerUps] = useState<string[]>([]);

  useEffect(() => {
    if (canvasRef.current && !gameEngineRef.current) {
      gameEngineRef.current = new GameEngine(canvasRef.current, {
        onScoreChange: (score: number) => setGameStats(prev => ({ ...prev, score })),
        onLifeChange: (lives: number) => setGameStats(prev => ({ ...prev, lives })),
        onLevelChange: (level: number) => setGameStats(prev => ({ ...prev, level })),
        onGameStart: start,
        onGameEnd: () => {},
        onGameRestart: restart
      });
    }

    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.destroy();
      }
    };
  }, [start, restart]);

  useEffect(() => {
    // Handle background music
    if (backgroundMusic && phase === "playing" && !isMuted) {
      backgroundMusic.play().catch(console.log);
    } else if (backgroundMusic) {
      backgroundMusic.pause();
    }
  }, [backgroundMusic, phase, isMuted]);

  const handleStartGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.startGame();
    }
  };

  const handleRestartGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.restartGame();
      setGameStats({ score: 0, lives: 3, level: 1 });
    }
  };

  const handleToggleMute = () => {
    toggleMute();
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#87CEEB'
    }}>
      <GameCanvas ref={canvasRef} />
      <GameUI 
        phase={phase}
        stats={gameStats}
        onStartGame={handleStartGame}
        onRestartGame={handleRestartGame}
        onToggleMute={handleToggleMute}
        isMuted={isMuted}
      />
    </div>
  );
};

export default Game;
