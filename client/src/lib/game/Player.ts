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
      lives: 3
    };
    this.config = config;
  }

  update(deltaTime: number, leftPressed: boolean, rightPressed: boolean, jumpPressed: boolean) {
    // Handle horizontal movement
    if (leftPressed) {
      this.state.velocity.x = -this.config.moveSpeed;
      this.state.facing = 'left';
    } else if (rightPressed) {
      this.state.velocity.x = this.config.moveSpeed;
      this.state.facing = 'right';
    } else {
      // Apply friction when no input
      this.state.velocity = Physics.applyFriction(this.state.velocity, this.config.friction, deltaTime);
    }

    // Handle jumping
    if (jumpPressed && this.state.onGround) {
      this.state.velocity.y = -this.config.jumpForce;
      this.state.onGround = false;
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
  }

  render(ctx: CanvasRenderingContext2D) {
    // Draw player as a pixel-art style rectangle
    ctx.fillStyle = '#FF6B6B'; // Coral red
    ctx.fillRect(this.state.position.x, this.state.position.y, this.state.size.x, this.state.size.y);
    
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
