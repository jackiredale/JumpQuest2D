import { Vector2, PlayerState, GameConfig } from './types';
import { Physics } from './Physics';

export class Player {
  public state: PlayerState;
  private config: GameConfig;

  constructor(x: number, y: number, config: GameConfig) {
    this.state = {
      position: { x, y },
      velocity: { x: 0, y: 0 },
      size: { x: 32, y: 32 },
      onGround: false,
      facing: 'right',
      lives: 3,
      activePowerUps: new Map(),
      canDoubleJump: false,
      hasDoubleJumped: false
    };
    this.config = config;
  }

  update(deltaTime: number, leftPressed: boolean, rightPressed: boolean, jumpPressed: boolean) {
    // Update power-ups
    this.updatePowerUps(deltaTime);
    
    // Get modified speeds based on power-ups
    const moveSpeed = this.getModifiedMoveSpeed();
    const jumpForce = this.getModifiedJumpForce();
    
    // Handle horizontal movement
    if (leftPressed) {
      this.state.velocity.x = -moveSpeed;
      this.state.facing = 'left';
    } else if (rightPressed) {
      this.state.velocity.x = moveSpeed;
      this.state.facing = 'right';
    } else {
      // Apply friction when no input
      this.state.velocity = Physics.applyFriction(this.state.velocity, this.config.friction, deltaTime);
    }

    // Handle jumping
    if (jumpPressed) {
      if (this.state.onGround) {
        // Regular jump
        this.state.velocity.y = -jumpForce;
        this.state.onGround = false;
        this.state.hasDoubleJumped = false;
      } else if (this.state.canDoubleJump && !this.state.hasDoubleJumped && !this.state.onGround) {
        // Double jump
        this.state.velocity.y = -jumpForce * 0.8; // Slightly weaker double jump
        this.state.hasDoubleJumped = true;
      }
    }

    // Reset double jump when on ground
    if (this.state.onGround) {
      this.state.hasDoubleJumped = false;
    }

    // Apply gravity
    this.state.velocity = Physics.applyGravity(this.state.velocity, this.config.gravity, deltaTime);

    // Clamp velocity
    this.state.velocity = Physics.clampVelocity(this.state.velocity, this.config.terminalVelocity);

    // Update position
    this.state.position.x += this.state.velocity.x * deltaTime;
    this.state.position.y += this.state.velocity.y * deltaTime;

    // Reset ground state (will be set by collision detection)
    this.state.onGround = false;
  }

  getRect() {
    return {
      x: this.state.position.x,
      y: this.state.position.y,
      width: this.state.size.x,
      height: this.state.size.y
    };
  }

  setPosition(x: number, y: number) {
    this.state.position.x = x;
    this.state.position.y = y;
  }

  setVelocity(x: number, y: number) {
    this.state.velocity.x = x;
    this.state.velocity.y = y;
  }

  setOnGround(onGround: boolean) {
    this.state.onGround = onGround;
  }

  loseLife() {
    this.state.lives--;
  }

  isDead(): boolean {
    return this.state.lives <= 0;
  }

  reset(x: number, y: number) {
    this.state.position = { x, y };
    this.state.velocity = { x: 0, y: 0 };
    this.state.onGround = false;
    this.state.facing = 'right';
    this.state.lives = 3;
    this.state.activePowerUps.clear();
    this.state.canDoubleJump = false;
    this.state.hasDoubleJumped = false;
  }

  private updatePowerUps(deltaTime: number) {
    const currentTime = Date.now();
    const toRemove: string[] = [];

    this.state.activePowerUps.forEach((powerUp, type) => {
      if (currentTime > powerUp.endTime) {
        toRemove.push(type);
      }
    });

    toRemove.forEach(type => {
      this.state.activePowerUps.delete(type);
      if (type === 'double_jump') {
        this.state.canDoubleJump = false;
      }
    });
  }

  addPowerUp(type: string, duration: number) {
    const currentTime = Date.now();
    this.state.activePowerUps.set(type, {
      endTime: currentTime + duration * 1000,
      type: type
    });

    if (type === 'double_jump') {
      this.state.canDoubleJump = true;
    }
  }

  private getModifiedMoveSpeed(): number {
    let speed = this.config.moveSpeed;
    if (this.state.activePowerUps.has('speed')) {
      speed *= 1.5; // 50% speed boost
    }
    return speed;
  }

  private getModifiedJumpForce(): number {
    let jumpForce = this.config.jumpForce;
    if (this.state.activePowerUps.has('jump')) {
      jumpForce *= 1.3; // 30% jump boost
    }
    return jumpForce;
  }

  hasShield(): boolean {
    return this.state.activePowerUps.has('shield');
  }

  getActivePowerUps(): string[] {
    return Array.from(this.state.activePowerUps.keys());
  }

  render(ctx: CanvasRenderingContext2D) {
    // Draw player with power-up effects
    let playerColor = '#FF6B6B'; // Default coral red
    
    // Change color based on active power-ups
    if (this.state.activePowerUps.has('shield')) {
      playerColor = '#4169E1'; // Blue when shielded
    } else if (this.state.activePowerUps.has('speed')) {
      playerColor = '#00FF00'; // Green when speedy
    }
    
    ctx.fillStyle = playerColor;
    ctx.fillRect(this.state.position.x, this.state.position.y, this.state.size.x, this.state.size.y);
    
    // Add glow effect for power-ups
    if (this.state.activePowerUps.size > 0) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(this.state.position.x - 2, this.state.position.y - 2, this.state.size.x + 4, this.state.size.y + 4);
      ctx.globalAlpha = 1;
    }
    
    // Add simple pixel art details
    ctx.fillStyle = '#FFFFFF';
    // Eyes
    const eyeSize = 4;
    const eyeY = this.state.position.y + 8;
    if (this.state.facing === 'right') {
      ctx.fillRect(this.state.position.x + 20, eyeY, eyeSize, eyeSize);
      ctx.fillRect(this.state.position.x + 26, eyeY, eyeSize, eyeSize);
    } else {
      ctx.fillRect(this.state.position.x + 2, eyeY, eyeSize, eyeSize);
      ctx.fillRect(this.state.position.x + 8, eyeY, eyeSize, eyeSize);
    }
    
    // Simple body outline
    ctx.strokeStyle = '#CC5555';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.state.position.x, this.state.position.y, this.state.size.x, this.state.size.y);
  }
}
