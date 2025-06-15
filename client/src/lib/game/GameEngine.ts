import { GameConfig, GameCallbacks } from './types';
import { Player } from './Player';
import { Platform } from './Platform';
import { Collectible } from './Collectible';
import { Enemy } from './Enemy';
import { PowerUp } from './PowerUp';
import { LevelManager } from './LevelManager';
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
  private levelManager: LevelManager;
  private inputManager: InputManager;
  
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private score: number = 0;
  private level: number = 1;
  
  private spawnPoint: { x: number; y: number } = { x: 50, y: 400 };
  
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
    this.player = new Player(this.spawnPoint.x, this.spawnPoint.y, this.config);
    this.platforms = [];
    this.collectibles = [];
    this.enemies = [];
    this.powerUps = [];
    this.inputManager = new InputManager(canvas);
    
    this.initializeLevel();
    this.setupCanvas();
  }

  private setupCanvas() {
    // Set up pixel-perfect rendering
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
    this.spawnPoint = levelData.spawnPoint;
    
    // Update level number for UI
    this.level = this.levelManager.getCurrentLevelNumber();
  }

  public startGame() {
    console.log("Starting game");
    this.isRunning = true;
    this.callbacks.onGameStart();
    this.gameLoop(0);
  }

  public restartGame() {
    console.log("Restarting game");
    this.isRunning = false;
    this.score = 0;
    this.levelManager.resetToLevel(1);
    this.player.reset(this.spawnPoint.x, this.spawnPoint.y);
    
    // Reset to level 1
    this.initializeLevel();
    
    this.callbacks.onScoreChange(this.score);
    this.callbacks.onLifeChange(this.player.state.lives);
    this.callbacks.onLevelChange(this.level);
    this.callbacks.onGameRestart();
  }

  private gameLoop = (currentTime: number) => {
    if (!this.isRunning) return;

    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number) {
    // Get input
    const leftPressed = this.inputManager.isLeftPressed();
    const rightPressed = this.inputManager.isRightPressed();
    const jumpPressed = this.inputManager.isJumpPressed();

    // Update player
    this.player.update(deltaTime, leftPressed, rightPressed, jumpPressed);

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
            enemy.data.velocity
          );
          
          enemy.data.position.x = collision.position.x;
          enemy.data.position.y = collision.position.y;
          enemy.data.velocity.x = collision.velocity.x;
          enemy.data.velocity.y = collision.velocity.y;
        }
      }
      
      // Keep enemies within screen bounds
      if (enemy.data.position.y > this.canvas.height) {
        enemy.data.active = false;
      }
    });

    // Check platform collisions
    const playerRect = this.player.getRect();
    for (const platform of this.platforms) {
      const platformRect = platform.getRect();
      
      if (Physics.checkAABBCollision(playerRect, platformRect)) {
        const collision = Physics.resolveCollision(
          playerRect,
          platformRect,
          this.player.state.velocity
        );
        
        this.player.setPosition(collision.position.x, collision.position.y);
        this.player.setVelocity(collision.velocity.x, collision.velocity.y);
        this.player.setOnGround(collision.onGround);
      }
    }

    // Check enemy collisions
    this.enemies.forEach(enemy => {
      if (enemy.isActive()) {
        const enemyRect = enemy.getRect();
        if (Physics.checkAABBCollision(playerRect, enemyRect)) {
          if (this.player.hasShield()) {
            // Player has shield - destroy enemy
            enemy.takeDamage();
            this.score += 50;
            this.callbacks.onScoreChange(this.score);
            console.log("Enemy destroyed with shield!");
          } else {
            // Player takes damage
            this.player.loseLife();
            this.callbacks.onLifeChange(this.player.state.lives);
            
            if (this.player.isDead()) {
              this.endGame();
            } else {
              // Respawn player
              this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
              this.player.setVelocity(0, 0);
            }
            console.log("Player hit by enemy!");
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
          this.score += 100;
          this.callbacks.onScoreChange(this.score);
          console.log("Collectible collected!");
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
          console.log(`Power-up collected: ${powerUp.data.type}`);
        }
        powerUp.update(deltaTime);
      }
    });

    // Check if player fell off the screen
    if (this.player.state.position.y > this.canvas.height) {
      this.player.loseLife();
      this.callbacks.onLifeChange(this.player.state.lives);
      
      if (this.player.isDead()) {
        this.endGame();
      } else {
        // Respawn player
        this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
        this.player.setVelocity(0, 0);
      }
    }

    // Keep player within screen bounds (horizontal)
    if (this.player.state.position.x < 0) {
      this.player.setPosition(0, this.player.state.position.y);
      this.player.setVelocity(0, this.player.state.velocity.y);
    } else if (this.player.state.position.x + this.player.state.size.x > this.canvas.width) {
      this.player.setPosition(this.canvas.width - this.player.state.size.x, this.player.state.position.y);
      this.player.setVelocity(0, this.player.state.velocity.y);
    }

    // Check level completion
    const allCollected = this.collectibles.every(c => c.isCollected());
    if (allCollected) {
      this.nextLevel();
    }
  }

  private render() {
    // Clear canvas with level background color
    const levelData = this.levelManager.getCurrentLevel();
    this.ctx.fillStyle = levelData.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render platforms
    this.platforms.forEach(platform => platform.render(this.ctx));

    // Render collectibles
    this.collectibles.forEach(collectible => collectible.render(this.ctx));

    // Render power-ups
    this.powerUps.forEach(powerUp => powerUp.render(this.ctx));

    // Render enemies
    this.enemies.forEach(enemy => enemy.render(this.ctx));

    // Render player
    this.player.render(this.ctx);
  }

  private nextLevel() {
    const hasNextLevel = this.levelManager.nextLevel();
    
    if (hasNextLevel) {
      // Load new level
      this.initializeLevel();
      
      // Reset player position
      this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
      this.player.setVelocity(0, 0);
      
      this.callbacks.onLevelChange(this.level);
      console.log(`Level ${this.level} started: ${this.levelManager.getCurrentLevel().name}`);
    } else {
      // Game completed!
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

  public destroy() {
    this.isRunning = false;
    this.inputManager.destroy();
  }
}
