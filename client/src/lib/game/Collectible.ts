import { CollectibleData } from './types';

export class Collectible {
  public data: CollectibleData;
  private animationTime: number = 0;

  constructor(x: number, y: number, id: number) {
    this.data = {
      x,
      y,
      size: 16,
      collected: false,
      id
    };
  }

  update(deltaTime: number) {
    this.animationTime += deltaTime;
  }

  getRect() {
    return {
      x: this.data.x,
      y: this.data.y,
      width: this.data.size,
      height: this.data.size
    };
  }

  collect() {
    this.data.collected = true;
  }

  isCollected(): boolean {
    return this.data.collected;
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.data.collected) return;

    // Animate the collectible with a floating effect
    const floatOffset = Math.sin(this.animationTime * 0.005) * 3;
    const currentY = this.data.y + floatOffset;

    // Draw golden coin with pixel art styling
    ctx.fillStyle = '#FFD700'; // Gold
    ctx.fillRect(this.data.x, currentY, this.data.size, this.data.size);
    
    // Add coin details
    ctx.fillStyle = '#FFA500'; // Orange highlight
    ctx.fillRect(this.data.x + 2, currentY + 2, this.data.size - 4, this.data.size - 4);
    
    // Inner circle
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(this.data.x + 4, currentY + 4, this.data.size - 8, this.data.size - 8);
    
    // Border
    ctx.strokeStyle = '#B8860B'; // Dark golden rod
    ctx.lineWidth = 1;
    ctx.strokeRect(this.data.x, currentY, this.data.size, this.data.size);
    
    // Sparkle effect
    const sparkleTime = this.animationTime * 0.01;
    if (Math.sin(sparkleTime) > 0.7) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(this.data.x + this.data.size - 4, currentY + 2, 2, 2);
      ctx.fillRect(this.data.x + 2, currentY + this.data.size - 4, 2, 2);
    }
  }
}
