import { CollectibleData } from './types';

export class Collectible {
  public data: CollectibleData;
  private animationTime: number = 0;

  constructor(x: number, y: number, id: number, type: 'coin' | 'gem' | 'star' = 'coin') {
    this.data = {
      x,
      y,
      size: type === 'star' ? 20 : 16,
      collected: false,
      id,
      type,
      value: this.getValueForType(type)
    };
  }

  private getValueForType(type: 'coin' | 'gem' | 'star'): number {
    switch (type) {
      case 'coin': return 25;
      case 'gem': return 100;
      case 'star': return 500;
      default: return 25;
    }
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

  getValue(): number {
    return this.data.value || 25;
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.data.collected) return;

    const floatOffset = Math.sin(this.animationTime * 0.005) * 3;
    const currentY = this.data.y + floatOffset;
    const rotationSpeed = this.data.type === 'star' ? 0.01 : 0.008;
    const rotation = this.animationTime * rotationSpeed;

    ctx.save();
    ctx.translate(this.data.x + this.data.size / 2, currentY + this.data.size / 2);
    ctx.rotate(rotation);

    switch (this.data.type) {
      case 'coin':
        this.renderCoin(ctx);
        break;
      case 'gem':
        this.renderGem(ctx);
        break;
      case 'star':
        this.renderStar(ctx);
        break;
    }

    ctx.restore();

    // Sparkle effects
    const sparkleTime = this.animationTime * 0.01;
    if (Math.sin(sparkleTime) > 0.7) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(this.data.x - 2, currentY + 2, 2, 2);
      ctx.fillRect(this.data.x + this.data.size, currentY + this.data.size - 4, 2, 2);
    }
  }

  private renderCoin(ctx: CanvasRenderingContext2D) {
    const halfSize = this.data.size / 2;
    
    // Main coin body
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-halfSize, -halfSize, this.data.size, this.data.size);
    
    // Inner highlight
    ctx.fillStyle = '#FFA500';
    ctx.fillRect(-halfSize + 2, -halfSize + 2, this.data.size - 4, this.data.size - 4);
    
    // Core
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-halfSize + 4, -halfSize + 4, this.data.size - 8, this.data.size - 8);
    
    // Border
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 1;
    ctx.strokeRect(-halfSize, -halfSize, this.data.size, this.data.size);
  }

  private renderGem(ctx: CanvasRenderingContext2D) {
    const halfSize = this.data.size / 2;
    
    // Gem shape (diamond)
    ctx.fillStyle = '#FF1493';
    ctx.beginPath();
    ctx.moveTo(0, -halfSize);
    ctx.lineTo(halfSize, 0);
    ctx.lineTo(0, halfSize);
    ctx.lineTo(-halfSize, 0);
    ctx.closePath();
    ctx.fill();
    
    // Inner facets
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.moveTo(0, -halfSize + 3);
    ctx.lineTo(halfSize - 3, 0);
    ctx.lineTo(0, halfSize - 3);
    ctx.lineTo(-halfSize + 3, 0);
    ctx.closePath();
    ctx.fill();
    
    // Highlight
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-2, -halfSize + 2, 4, 4);
    
    // Border
    ctx.strokeStyle = '#8B008B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -halfSize);
    ctx.lineTo(halfSize, 0);
    ctx.lineTo(0, halfSize);
    ctx.lineTo(-halfSize, 0);
    ctx.closePath();
    ctx.stroke();
  }

  private renderStar(ctx: CanvasRenderingContext2D) {
    const halfSize = this.data.size / 2;
    const spikes = 5;
    const outerRadius = halfSize;
    const innerRadius = halfSize * 0.4;
    
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Inner star
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = (i % 2 === 0 ? outerRadius : innerRadius) * 0.6;
      const angle = (i * Math.PI) / spikes;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    
    // Center highlight
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-2, -2, 4, 4);
    
    // Border
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }
}