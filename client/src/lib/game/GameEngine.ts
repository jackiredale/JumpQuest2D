import { GameConfig, GameCallbacks } from './types';
import { Player } from './Player';
import { Platform } from './Platform';
import { Collectible } from './Collectible';
import { Enemy } from './Enemy';
import { PowerUp } from './PowerUp';
import { Checkpoint } from './Checkpoint';
import { ParticleSystem } from './ParticleSystem';
import { LevelManager } from './LevelManager';
import { Shop } from './Shop';
import { InputManager } from './Input';
import { Physics } from './Physics';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: GameConfig;
  private callbacks: GameCallbacks;
  
  private player: Player;
  private platforms: Platform[];
  private collectibles: Collectible[];
  private enemies: Enemy[];
  private powerUps: PowerUp[];
  private checkpoints: Checkpoint[];
  private particleSystem: ParticleSystem;
  private levelManager: LevelManager;
  private shop: Shop;
  private inputManager: InputManager;
  
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private score: number = 0;
  private level: number = 1;
  private timeRemaining: number = 0;
  private levelStartTime: number = 0;
  
  private spawnPoint: { x: number; y: number } = { x: 50, y: 400 };
  private lastCheckpoint: { x: number; y: number } = { x: 50, y: 400 };
  
  // Camera system
  private camera: { x: number; y: number } = { x: 0, y: 0 };
  
  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.callbacks = callbacks;
    
    this.config = {
      gravity: 800,
      jumpForce: 400,
      moveSpeed: 200,
      friction: 800,
      terminalVelocity: 600
    };
    
    // Initialize game objects
    this.levelManager = new LevelManager();
    this.shop = new Shop();
    this.player = new Player(this.spawnPoint.x, this.spawnPoint.y, this.config);
    this.platforms = [];
    this.collectibles = [];
    this.enemies = [];
    this.powerUps = [];
    this.checkpoints = [];
    this.particleSystem = new ParticleSystem();
    this.inputManager = new InputManager(canvas);
    
    this.initializeLevel();
    this.setupCanvas();
  }

  private setupCanvas() {
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.style.imageRendering = 'pixelated';
  }

  private initializeLevel() {
    const levelData = this.levelManager.getCurrentLevel();
    const gameObjects = this.levelManager.createGameObjects(levelData);
    
    this.platforms = gameObjects.platforms;
    this.collectibles = gameObjects.collectibles;
    this.enemies = gameObjects.enemies;
    this.powerUps = gameObjects.powerUps;
    this.checkpoints = gameObjects.checkpoints;
    this.spawnPoint = levelData.spawnPoint;
    this.lastCheckpoint = { ...this.spawnPoint };
    
    // Set up level timer
    this.timeRemaining = levelData.timeLimit || 300;
    this.levelStartTime = Date.now();
    
    this.level = this.levelManager.getCurrentLevelNumber();
    
    // Reset particle system
    this.particleSystem.clear();
  }

  private updateCamera() {
    // Follow player with smooth camera
    const targetX = this.player.state.position.x - this.canvas.width / 2;
    const targetY = this.player.state.position.y - this.canvas.height / 2;
    
    // Smooth camera movement
    this.camera.x += (targetX - this.camera.x) * 0.1;
    this.camera.y += (targetY - this.camera.y) * 0.1;
    
    // Keep camera within reasonable bounds
    this.camera.x = Math.max(0, this.camera.x);
    this.camera.y = Math.max(-200, Math.min(200, this.camera.y));
  }

  public startGame() {
    console.log("Starting game");
    this.isRunning = true;

    this.player.reset(this.spawnPoint.x, this.spawnPoint.y);

    const equippedHat = this.shop.getEquippedHat();
    if (equippedHat) {
      this.player.setEquippedHatEffect(equippedHat.effect);
    } else {
      this.player.setEquippedHatEffect(null);
    }
    this.callbacks.onLifeChange(this.player.state.lives);

    this.callbacks.onGameStart();
    this.levelStartTime = Date.now();
    this.gameLoop(0);
  }

  public restartGame() {
    console.log("Restarting game");
    this.isRunning = false;
    this.score = 0;
    this.levelManager.resetToLevel(1);

    this.player.reset(this.spawnPoint.x, this.spawnPoint.y);
    this.camera = { x: 0, y: 0 };
    
    this.initializeLevel();

    const equippedHat = this.shop.getEquippedHat();
    if (equippedHat) {
      this.player.setEquippedHatEffect(equippedHat.effect);
    } else {
      this.player.setEquippedHatEffect(null);
    }
    
    this.callbacks.onScoreChange(this.score);
    this.callbacks.onLifeChange(this.player.state.lives);
    this.callbacks.onLevelChange(this.level);
    this.callbacks.onGameRestart();
  }

  public updateEquippedHat(hatEffect: { type: 'speed' | 'jump' | 'lives' | 'coins'; multiplier: number } | null) {
    const oldLives = this.player.state.lives;
    this.player.setEquippedHatEffect(hatEffect);

    if (this.player.state.lives !== oldLives) {
      this.callbacks.onLifeChange(this.player.state.lives);
    }
  }

  private gameLoop = (currentTime: number) => {
    if (!this.isRunning) return;

    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.016); // Cap at 60 FPS
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number) {
    // Update timer
    const currentTime = Date.now();
    const elapsedTime = (currentTime - this.levelStartTime) / 1000;
    const levelData = this.levelManager.getCurrentLevel();
    if (levelData.timeLimit) {
      this.timeRemaining = Math.max(0, levelData.timeLimit - elapsedTime);
      if (this.timeRemaining <= 0) {
        this.player.takeDamage();
        this.callbacks.onPlayerHurt();
        if (this.player.isDead()) {
          this.endGame();
          return;
        } else {
          this.respawnPlayer();
        }
      }
    }

    // Get input
    const leftPressed = this.inputManager.isLeftPressed();
    const rightPressed = this.inputManager.isRightPressed();
    const jumpPressed = this.inputManager.isJumpPressed();
    const dashPressed = this.inputManager.isDashPressed();

    // Update player
    this.player.update(deltaTime, leftPressed, rightPressed, jumpPressed, dashPressed);

    // Update platforms
    this.platforms.forEach(platform => {
      platform.update(deltaTime);
    });

    // Update enemies
    this.enemies.forEach(enemy => {
      enemy.update(deltaTime, this.config.gravity);
      
      // Check enemy-platform collisions
      const enemyRect = enemy.getRect();
      for (const platform of this.platforms) {
        const platformRect = platform.getRect();
        
        if (Physics.checkAABBCollision(enemyRect, platformRect)) {
          const collision = Physics.resolveCollision(
            enemyRect,
            platformRect,
            enemy.data.velocity,
            platform.data.type
          );
          
          enemy.data.position.x = collision.position.x;
          enemy.data.position.y = collision.position.y;
          enemy.data.velocity.x = collision.velocity.x;
          enemy.data.velocity.y = collision.velocity.y;
        }
      }
      
      if (enemy.data.position.y > this.canvas.height + 200) {
        enemy.data.active = false;
      }
    });

    // Update checkpoints
    this.checkpoints.forEach(checkpoint => {
      checkpoint.update(deltaTime);
      
      if (!checkpoint.isActivated()) {
        const checkpointRect = checkpoint.getRect();
        const playerRect = this.player.getRect();
        
        if (Physics.checkAABBCollision(playerRect, checkpointRect)) {
          checkpoint.activate();
          this.lastCheckpoint = { x: checkpoint.data.x, y: checkpoint.data.y - 50 };
          this.particleSystem.addExplosion(
            { x: checkpoint.data.x + 12, y: checkpoint.data.y + 24 },
            '#00FF00',
            12
          );
          console.log("Checkpoint activated!");
        }
      }
    });

    // Check platform collisions
    const playerRect = this.player.getRect();
    let currentPlatformType = 'normal';
    
    for (const platform of this.platforms) {
      const platformRect = platform.getRect();
      
      if (Physics.checkAABBCollision(playerRect, platformRect)) {
        const collision = Physics.resolveCollision(
          playerRect,
          platformRect,
          this.player.state.velocity,
          platform.data.type
        );
        
        this.player.setPosition(collision.position.x, collision.position.y);
        this.player.setVelocity(collision.velocity.x, collision.velocity.y);
        this.player.setOnGround(collision.onGround);
        this.player.setOnWall(collision.onWall, collision.wallDirection);
        
        currentPlatformType = platform.data.type || 'normal';
        
        // Handle breakable platforms
        if (platform.data.type === 'breakable' && collision.onGround) {
          if (platform.takeDamage()) {
            // Platform destroyed
            this.platforms = this.platforms.filter(p => p !== platform);
            this.particleSystem.addExplosion(
              { x: platform.data.x + platform.data.width / 2, y: platform.data.y + platform.data.height / 2 },
              '#CD853F',
              8
            );
          }
        }
      }
    }

    // Apply platform-specific friction when on ground
    if (this.player.state.onGround) {
      this.player.state.velocity = Physics.applyFriction(
        this.player.state.velocity,
        this.config.friction,
        deltaTime,
        currentPlatformType
      );
    }

    // Check enemy collisions
    this.enemies.forEach(enemy => {
      if (enemy.isActive()) {
        const enemyRect = enemy.getRect();
        if (Physics.checkAABBCollision(playerRect, enemyRect)) {
          if (this.player.hasShield() || this.player.state.isDashing) {
            // Player destroys enemy
            enemy.takeDamage();
            this.score += 50;
            this.callbacks.onScoreChange(this.score);
            this.callbacks.onEnemyDefeated();
            
            // Add explosion effect
            this.particleSystem.addExplosion(
              { x: enemy.data.position.x + enemy.data.size.x / 2, y: enemy.data.position.y + enemy.data.size.y / 2 },
              '#FF4500',
              6
            );
            
            console.log("Enemy destroyed!");
          } else {
            // Player takes damage
            if (this.player.takeDamage()) {
              this.callbacks.onLifeChange(this.player.state.lives);
              this.callbacks.onPlayerHurt();
              
              if (this.player.isDead()) {
                this.endGame();
                return;
              } else {
                this.respawnPlayer();
              }
            }
          }
        }
      }
    });

    // Check collectible collisions
    this.collectibles.forEach(collectible => {
      if (!collectible.isCollected()) {
        const collectibleRect = collectible.getRect();
        if (Physics.checkAABBCollision(playerRect, collectibleRect)) {
          collectible.collect();
          const baseValue = collectible.getValue();
          const multiplier = this.shop.getCoinMultiplier();
          const coinsEarned = baseValue * multiplier;
          
          this.score += baseValue * 4; // Score multiplier
          this.shop.addCoins(coinsEarned);
          this.callbacks.onScoreChange(this.score);
          this.callbacks.onCoinCollected();
          
          // Add collection effect
          this.particleSystem.addExplosion(
            { x: collectible.data.x + collectible.data.size / 2, y: collectible.data.y + collectible.data.size / 2 },
            collectible.data.type === 'star' ? '#FFD700' : collectible.data.type === 'gem' ? '#FF1493' : '#FFD700',
            collectible.data.type === 'star' ? 10 : 6
          );
          
          console.log(`Collectible collected! Earned ${coinsEarned} coins`);
        }
        collectible.update(deltaTime);
      }
    });

    // Check power-up collisions
    this.powerUps.forEach(powerUp => {
      if (!powerUp.isCollected()) {
        const powerUpRect = powerUp.getRect();
        if (Physics.checkAABBCollision(playerRect, powerUpRect)) {
          powerUp.collect();
          this.player.addPowerUp(powerUp.data.type, powerUp.data.duration);
          this.score += 200;
          this.callbacks.onScoreChange(this.score);
          this.callbacks.onPowerUpCollected();
          
          // Add power-up effect
          this.particleSystem.addExplosion(
            { x: powerUp.data.position.x + powerUp.data.size.x / 2, y: powerUp.data.position.y + powerUp.data.size.y / 2 },
            powerUp.getColor(),
            8
          );
          
          console.log(`Power-up collected: ${powerUp.data.type}`);
        }
        powerUp.update(deltaTime);
      }
    });

    // Check if player fell off the screen
    if (this.player.state.position.y > this.canvas.height + 200) {
      if (this.player.takeDamage()) {
        this.callbacks.onLifeChange(this.player.state.lives);
        this.callbacks.onPlayerHurt();
        
        if (this.player.isDead()) {
          this.endGame();
          return;
        } else {
          this.respawnPlayer();
        }
      }
    }

    // Keep player within horizontal screen bounds
    if (this.player.state.position.x < -50) {
      this.player.setPosition(-50, this.player.state.position.y);
      this.player.setVelocity(0, this.player.state.velocity.y);
    }

    // Update particle system
    this.particleSystem.update(deltaTime);

    // Add dash trail
    if (this.player.state.isDashing) {
      this.particleSystem.addTrail(
        { x: this.player.state.position.x + 16, y: this.player.state.position.y + 16 },
        this.player.state.velocity,
        '#FFD700'
      );
    }

    // Update camera
    this.updateCamera();

    // Check level completion
    const allCollected = this.collectibles.every(c => c.isCollected());
    if (allCollected) {
      this.nextLevel();
    }
  }

  private respawnPlayer() {
    this.player.setPosition(this.lastCheckpoint.x, this.lastCheckpoint.y);
    this.player.setVelocity(0, 0);
    
    // Add respawn effect
    this.particleSystem.addExplosion(
      { x: this.lastCheckpoint.x + 16, y: this.lastCheckpoint.y + 16 },
      '#4169E1',
      10
    );
  }

  private render() {
    // Clear canvas
    const levelData = this.levelManager.getCurrentLevel();
    this.ctx.fillStyle = levelData.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply camera transform
    this.ctx.save();
    this.ctx.translate(-this.camera.x, -this.camera.y);

    // Render platforms
    this.platforms.forEach(platform => platform.render(this.ctx));

    // Render checkpoints
    this.checkpoints.forEach(checkpoint => checkpoint.render(this.ctx));

    // Render collectibles
    this.collectibles.forEach(collectible => collectible.render(this.ctx));

    // Render power-ups
    this.powerUps.forEach(powerUp => powerUp.render(this.ctx));

    // Render enemies
    this.enemies.forEach(enemy => enemy.render(this.ctx));

    // Render particle effects
    this.particleSystem.render(this.ctx);

    // Render player
    this.player.render(this.ctx);

    // Restore camera transform
    this.ctx.restore();

    // Render UI elements (not affected by camera)
    this.renderUI();
  }

  private renderUI() {
    // Timer display
    const levelData = this.levelManager.getCurrentLevel();
    if (levelData.timeLimit) {
      const minutes = Math.floor(this.timeRemaining / 60);
      const seconds = Math.floor(this.timeRemaining % 60);
      const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      this.ctx.fillStyle = this.timeRemaining < 30 ? '#FF0000' : '#333';
      this.ctx.font = 'bold 20px Courier New';
      this.ctx.fillText(`Time: ${timeString}`, this.canvas.width - 150, 30);
    }

    // Performance info
    this.ctx.fillStyle = '#666';
    this.ctx.font = '12px Courier New';
    this.ctx.fillText(`Particles: ${this.particleSystem.getParticleCount()}`, 10, this.canvas.height - 20);
  }

  private nextLevel() {
    const hasNextLevel = this.levelManager.nextLevel();
    
    if (hasNextLevel) {
      this.callbacks.onLevelComplete();
      
      // Level completion bonus
      const timeBonus = Math.floor(this.timeRemaining * 10);
      this.score += timeBonus;
      this.callbacks.onScoreChange(this.score);
      
      // Add celebration effect
      for (let i = 0; i < 20; i++) {
        this.particleSystem.addExplosion(
          { x: this.player.state.position.x + 16, y: this.player.state.position.y + 16 },
          ['#FFD700', '#FF1493', '#00FF00', '#4169E1'][Math.floor(Math.random() * 4)],
          1
        );
      }
      
      // Load new level
      this.initializeLevel();
      
      // Reset player position
      this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
      this.player.setVelocity(0, 0);
      
      this.callbacks.onLevelChange(this.level);
      console.log(`Level ${this.level} started: ${this.levelManager.getCurrentLevel().name}`);
    } else {
      console.log("All levels completed!");
      this.endGame();
    }
  }

  private endGame() {
    console.log("Game ended");
    this.isRunning = false;
    this.callbacks.onGameEnd();
  }

  public getPlayerActivePowerUps(): string[] {
    return this.player.getActivePowerUps();
  }

  public getShop(): Shop {
    return this.shop;
  }

  public getTimeRemaining(): number {
    return this.timeRemaining;
  }

  public destroy() {
    this.isRunning = false;
    this.inputManager.destroy();
  }
}