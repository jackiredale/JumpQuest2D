import { Vector2, Rectangle } from './types';

export interface PowerUpData {
  position: Vector2;
  size: Vector2;
  type: 'speed' | 'jump' | 'shield' | 'double_jump';
  collected: boolean;
  duration: number; // Duration in seconds
  id: number;
}

export class PowerUp {
  public data: PowerUpData;
  private animationTime: number = 0;

  constructor(x: number, y: number, type: 'speed' | 'jump' | 'shield' | 'double_jump', id: number) {
    this.data = {
      position: { x, y },
      size: { x: 20, y: 20 },
      type,
      collected: false,
      duration: this.getDuration(type),
      id
    };
  }

  private getDuration(type: string): number {
    switch (type) {
      case 'speed': return 8;
      case 'jump': return 10;
      case 'shield': return 5;
      case 'double_jump': return 12;
      default: return 5;
    }
  }

  update(deltaTime: number) {
    this.animationTime += deltaTime;
  }

  getRect(): Rectangle {
    return {
      x: this.data.position.x,
      y: this.data.position.y,
      width: this.data.size.x,
      height: this.data.size.y
    };
  }

  collect() {
    this.data.collected = true;
  }

  isCollected(): boolean {
    return this.data.collected;
  }

  getColor(): string {
    switch (this.data.type) {
      case 'speed': return '#00FF00'; // Green
      case 'jump': return '#FF4500'; // Orange Red
      case 'shield': return '#4169E1'; // Royal Blue
      case 'double_jump': return '#FF1493'; // Deep Pink
      default: return '#FFFFFF';
    }
  }

  getSymbol(): string {
    switch (this.data.type) {
      case 'speed': return '→';
      case 'jump': return '↑';
      case 'shield': return '⚡';
      case 'double_jump': return '↕';
      default: return '?';
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.data.collected) return;

    // Floating animation
    const floatOffset = Math.sin(this.animationTime * 0.008) * 4;
    const currentY = this.data.position.y + floatOffset;

    // Pulsing glow effect
    const glowIntensity = Math.sin(this.animationTime * 0.01) * 0.3 + 0.7;
    
    // Draw outer glow
    ctx.globalAlpha = glowIntensity * 0.3;
    ctx.fillStyle = this.getColor();
    ctx.fillRect(
      this.data.position.x - 4, 
      currentY - 4, 
      this.data.size.x + 8, 
      this.data.size.y + 8
    );
    
    ctx.globalAlpha = 1;
    
    // Draw main power-up
    ctx.fillStyle = this.getColor();
    ctx.fillRect(this.data.position.x, currentY, this.data.size.x, this.data.size.y);
    
    // Draw inner highlight
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(
      this.data.position.x + 2, 
      currentY + 2, 
      this.data.size.x - 4, 
      this.data.size.y - 4
    );
    
    // Draw core
    ctx.fillStyle = this.getColor();
    ctx.fillRect(
      this.data.position.x + 4, 
      currentY + 4, 
      this.data.size.x - 8, 
      this.data.size.y - 8
    );
    
    // Draw symbol/pattern
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(
      this.getSymbol(),
      this.data.position.x + this.data.size.x / 2,
      currentY + this.data.size.y / 2 + 4
    );
    
    // Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.data.position.x, currentY, this.data.size.x, this.data.size.y);
    
    // Sparkle effects
    if (Math.sin(this.animationTime * 0.015) > 0.8) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(this.data.position.x - 2, currentY + 2, 2, 2);
      ctx.fillRect(this.data.position.x + this.data.size.x, currentY + this.data.size.y - 4, 2, 2);
    }
  }
}