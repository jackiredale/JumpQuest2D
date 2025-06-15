import { PlatformData } from './types';

export class Platform {
  public data: PlatformData;

  constructor(x: number, y: number, width: number, height: number, color: string = '#8B4513') {
    this.data = {
      x,
      y,
      width,
      height,
      color
    };
  }

  getRect() {
    return {
      x: this.data.x,
      y: this.data.y,
      width: this.data.width,
      height: this.data.height
    };
  }

  render(ctx: CanvasRenderingContext2D) {
    // Draw platform with pixel art styling
    ctx.fillStyle = this.data.color;
    ctx.fillRect(this.data.x, this.data.y, this.data.width, this.data.height);
    
    // Add simple texture/pattern
    ctx.fillStyle = '#A0522D'; // Lighter brown for highlights
    const tileSize = 16;
    for (let x = this.data.x; x < this.data.x + this.data.width; x += tileSize) {
      for (let y = this.data.y; y < this.data.y + this.data.height; y += tileSize) {
        // Add some simple texture dots
        ctx.fillRect(x + 2, y + 2, 2, 2);
        ctx.fillRect(x + 10, y + 10, 2, 2);
      }
    }
    
    // Border
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.data.x, this.data.y, this.data.width, this.data.height);
  }
}
