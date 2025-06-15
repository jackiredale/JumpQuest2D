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
    this.player = new Player(this.spawnPoint.x, this.spawnPoint.y, this.config);
    this.platforms = [];
    this.collectibles = [];
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
    // Create platforms for level 1
    this.platforms = [
      // Ground platforms
      new Platform(0, 550, 200, 50),
      new Platform(250, 550, 200, 50),
      new Platform(500, 550, 300, 50),
      
      // Mid-level platforms
      new Platform(150, 450, 100, 20),
      new Platform(300, 350, 120, 20),
      new Platform(500, 400, 80, 20),
      new Platform(650, 300, 100, 20),
      
      // Upper platforms
      new Platform(100, 250, 80, 20),
      new Platform(400, 200, 120, 20),
      new Platform(600, 150, 100, 20),
    ];

    // Create collectibles
    this.collectibles = [
      new Collectible(175, 420, 1),
      new Collectible(340, 320, 2),
      new Collectible(520, 370, 3),
      new Collectible(680, 270, 4),
      new Collectible(440, 170, 5),
    ];
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
    this.level = 1;
    this.player.reset(this.spawnPoint.x, this.spawnPoint.y);
    
    // Reset collectibles
    this.collectibles.forEach(collectible => {
      collectible.data.collected = false;
    });
    
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

    // Check collectible collisions
    this.collectibles.forEach(collectible => {
      if (!collectible.isCollected()) {
        const collectibleRect = collectible.getRect();
        if (Physics.checkAABBCollision(playerRect, collectibleRect)) {
          collectible.collect();
          this.score += 100;
          this.callbacks.onScoreChange(this.score);
          
          // Play success sound (handled by audio store)
          console.log("Collectible collected!");
        }
        collectible.update(deltaTime);
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
    // Clear canvas with sky blue background
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render platforms
    this.platforms.forEach(platform => platform.render(this.ctx));

    // Render collectibles
    this.collectibles.forEach(collectible => collectible.render(this.ctx));

    // Render player
    this.player.render(this.ctx);
  }

  private nextLevel() {
    this.level++;
    this.callbacks.onLevelChange(this.level);
    
    // Reset collectibles for next level
    this.collectibles.forEach(collectible => {
      collectible.data.collected = false;
    });
    
    // Reset player position
    this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
    this.player.setVelocity(0, 0);
    
    console.log(`Level ${this.level} started!`);
  }

  private endGame() {
    console.log("Game ended");
    this.isRunning = false;
    this.callbacks.onGameEnd();
  }

  public destroy() {
    this.isRunning = false;
    this.inputManager.destroy();
  }
}
