import { Vector2, Rectangle } from './types';

export interface EnemyData {
  position: Vector2;
  velocity: Vector2;
  size: Vector2;
  color: string;
  health: number;
  patrolStart: number;
  patrolEnd: number;
  patrolDirection: number;
  type: 'walker' | 'jumper';
  active: boolean;
}

export class Enemy {
  public data: EnemyData;
  private animationTime: number = 0;
  private jumpCooldown: number = 0;

  constructor(x: number, y: number, type: 'walker' | 'jumper' = 'walker', patrolDistance: number = 100) {
    this.data = {
      position: { x, y },
      velocity: { x: 0, y: 0 },
      size: { x: 24, y: 24 },
      color: type === 'walker' ? '#8B0000' : '#4B0082',
      health: 1,
      patrolStart: x - patrolDistance / 2,
      patrolEnd: x + patrolDistance / 2,
      patrolDirection: 1,
      type,
      active: true
    };
  }

  update(deltaTime: number, gravity: number) {
    if (!this.data.active) return;

    this.animationTime += deltaTime;
    
    if (this.data.type === 'walker') {
      this.updateWalkerAI(deltaTime);
    } else if (this.data.type === 'jumper') {
      this.updateJumperAI(deltaTime, gravity);
    }

    // Apply gravity
    this.data.velocity.y += gravity * deltaTime;
    
    // Update position
    this.data.position.x += this.data.velocity.x * deltaTime;
    this.data.position.y += this.data.velocity.y * deltaTime;

    // Update jump cooldown
    if (this.jumpCooldown > 0) {
      this.jumpCooldown -= deltaTime;
    }
  }

  private updateWalkerAI(deltaTime: number) {
    const walkSpeed = 50;
    
    // Move in patrol direction
    this.data.velocity.x = this.data.patrolDirection * walkSpeed;
    
    // Check patrol bounds
    if (this.data.position.x <= this.data.patrolStart) {
      this.data.patrolDirection = 1;
    } else if (this.data.position.x >= this.data.patrolEnd) {
      this.data.patrolDirection = -1;
    }
  }

  private updateJumperAI(deltaTime: number, gravity: number) {
    const jumpSpeed = 300;
    const moveSpeed = 30;
    
    // Random movement with occasional jumps
    if (this.jumpCooldown <= 0 && Math.random() < 0.002) {
      this.data.velocity.y = -jumpSpeed;
      this.jumpCooldown = 2; // 2 second cooldown
      
      // Random horizontal movement when jumping
      this.data.velocity.x = (Math.random() - 0.5) * moveSpeed * 2;
    }
    
    // Slow horizontal movement decay
    this.data.velocity.x *= 0.98;
  }

  getRect(): Rectangle {
    return {
      x: this.data.position.x,
      y: this.data.position.y,
      width: this.data.size.x,
      height: this.data.size.y
    };
  }

  takeDamage() {
    this.data.health--;
    if (this.data.health <= 0) {
      this.data.active = false;
    }
  }

  isActive(): boolean {
    return this.data.active;
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.data.active) return;

    // Draw enemy with pixel art styling
    ctx.fillStyle = this.data.color;
    ctx.fillRect(this.data.position.x, this.data.position.y, this.data.size.x, this.data.size.y);
    
    // Add animated details
    const pulse = Math.sin(this.animationTime * 0.008) * 0.3 + 0.7;
    ctx.globalAlpha = pulse;
    
    // Eyes or pattern based on type
    ctx.fillStyle = '#FFFFFF';
    if (this.data.type === 'walker') {
      // Simple eyes for walker
      ctx.fillRect(this.data.position.x + 4, this.data.position.y + 6, 3, 3);
      ctx.fillRect(this.data.position.x + 14, this.data.position.y + 6, 3, 3);
    } else {
      // Pattern for jumper
      ctx.fillRect(this.data.position.x + 8, this.data.position.y + 4, 8, 2);
      ctx.fillRect(this.data.position.x + 8, this.data.position.y + 12, 8, 2);
    }
    
    ctx.globalAlpha = 1;
    
    // Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.data.position.x, this.data.position.y, this.data.size.x, this.data.size.y);
  }
}