import { useEffect, useRef, useState } from "react";
import GameCanvas from "./GameCanvas";
import GameUI from "./GameUI";
import ShopModal from "./ShopModal";
import { GameEngine } from "../lib/game/GameEngine";
import { Shop } from "../lib/game/Shop";
import { useGame } from "../lib/stores/useGame";
import { useAudio } from "../lib/stores/useAudio";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const { phase, start, restart } = useGame();
  const { backgroundMusic, toggleMute, isMuted, playHit, playSuccess, playPowerUp, playEnemyDestroy, playLevelComplete } = useAudio();
  const [gameStats, setGameStats] = useState({
    score: 0,
    lives: 3,
    level: 1
  });
  const [activePowerUps, setActivePowerUps] = useState<string[]>([]);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [shopCoins, setShopCoins] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (canvasRef.current && !gameEngineRef.current) {
      gameEngineRef.current = new GameEngine(canvasRef.current, {
        onScoreChange: (score: number) => setGameStats(prev => ({ ...prev, score })),
        onLifeChange: (lives: number) => setGameStats(prev => ({ ...prev, lives })),
        onLevelChange: (level: number) => setGameStats(prev => ({ ...prev, level })),
        onGameStart: start,
        onGameEnd: () => {},
        onGameRestart: restart,
        onCoinCollected: () => playSuccess(),
        onPowerUpCollected: () => playPowerUp(),
        onEnemyDefeated: () => playEnemyDestroy(),
        onPlayerHurt: () => playHit(),
        onLevelComplete: () => playLevelComplete()
      });
    }

    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.destroy();
      }
    };
  }, [start, restart, playSuccess, playPowerUp, playEnemyDestroy, playHit, playLevelComplete]);

  // Poll for game state updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameEngineRef.current) {
        const powerUps = gameEngineRef.current.getPlayerActivePowerUps();
        setActivePowerUps(powerUps);
        
        const shop = gameEngineRef.current.getShop();
        setShopCoins(shop.getState().totalCoins);
        
        const timeLeft = gameEngineRef.current.getTimeRemaining();
        setTimeRemaining(timeLeft);
      }
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [phase]);

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
      setTimeRemaining(0);
    }
  };

  const handleToggleMute = () => {
    toggleMute();
  };

  const handleOpenShop = () => {
    setIsShopOpen(true);
  };

  const handleCloseShop = () => {
    setIsShopOpen(false);
  };

  const handlePurchase = (hatId: string) => {
    // Refresh UI to show new purchase
    setIsShopOpen(false);
    setTimeout(() => setIsShopOpen(true), 100);
  };

  const handleEquip = (hatId: string) => {
      if (gameEngineRef.current) {
        const shop = gameEngineRef.current.getShop();
        const previouslyEquippedHat = shop.getEquippedHat();

        // If the hat being clicked is already equipped, unequip it.
        // Otherwise, equip the new hat.
        if (previouslyEquippedHat && previouslyEquippedHat.id === hatId) {
          shop.unequipHat();
          gameEngineRef.current.updateEquippedHat(null);
          console.log(`Hat unequipped: ${hatId}`);
        } else {
          const success = shop.equipHat(hatId);
          if (success) {
            const newEquippedHat = shop.getEquippedHat();
            gameEngineRef.current.updateEquippedHat(newEquippedHat ? newEquippedHat.effect : null);
            console.log(`Hat equipped: ${hatId}`);
          } else {
            console.log(`Failed to equip hat: ${hatId}`);
          }
        }

        // Refresh shop modal to reflect equip status changes
        // This causes a quick close and reopen to force a re-render of the modal's content
        setIsShopOpen(false);
        setTimeout(() => setIsShopOpen(true), 10);
      }
    };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden'
    }}>
      <GameCanvas ref={canvasRef} />
      <GameUI 
        phase={phase}
        stats={gameStats}
        onStartGame={handleStartGame}
        onRestartGame={handleRestartGame}
        onToggleMute={handleToggleMute}
        isMuted={isMuted}
        activePowerUps={activePowerUps}
        onOpenShop={handleOpenShop}
        totalCoins={shopCoins}
        timeRemaining={timeRemaining}
      />
      {gameEngineRef.current && (
        <ShopModal
          isOpen={isShopOpen}
          onClose={handleCloseShop}
          shop={gameEngineRef.current.getShop()}
          onPurchase={handlePurchase}
          onEquip={handleEquip}
        />
      )}
    </div>
  );
};

export default Game;