import { CheckpointData } from './types';

export class Checkpoint {
  public data: CheckpointData;
  private animationTime: number = 0;

  constructor(x: number, y: number, id: number) {
    this.data = {
      x,
      y,
      activated: false,
      id
    };
  }

  update(deltaTime: number) {
    this.animationTime += deltaTime;
  }

  activate() {
    this.data.activated = true;
  }

  isActivated(): boolean {
    return this.data.activated;
  }

  getRect() {
    return {
      x: this.data.x,
      y: this.data.y,
      width: 24,
      height: 48
    };
  }

  render(ctx: CanvasRenderingContext2D) {
    const flagHeight = 48;
    const flagWidth = 24;
    const poleWidth = 4;
    
    // Flag pole
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(this.data.x, this.data.y, poleWidth, flagHeight);
    
    // Flag
    const flagColor = this.data.activated ? '#00FF00' : '#FF0000';
    ctx.fillStyle = flagColor;
    
    if (this.data.activated) {
      // Animated waving flag
      const wave = Math.sin(this.animationTime * 0.01) * 2;
      ctx.fillRect(this.data.x + poleWidth, this.data.y + 8, flagWidth - 4 + wave, 16);
      
      // Flag details
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(this.data.x + poleWidth + 2, this.data.y + 10, 4, 4);
      ctx.fillRect(this.data.x + poleWidth + 8, this.data.y + 10, 4, 4);
      ctx.fillRect(this.data.x + poleWidth + 14, this.data.y + 10, 4, 4);
    } else {
      // Static flag
      ctx.fillRect(this.data.x + poleWidth, this.data.y + 8, flagWidth - 4, 16);
    }
    
    // Glow effect when activated
    if (this.data.activated) {
      const glowIntensity = Math.sin(this.animationTime * 0.008) * 0.3 + 0.7;
      ctx.globalAlpha = glowIntensity * 0.4;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(this.data.x - 4, this.data.y - 4, flagWidth + 8, flagHeight + 8);
      ctx.globalAlpha = 1;
    }
    
    // Border
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.data.x, this.data.y, poleWidth, flagHeight);
    ctx.strokeRect(this.data.x + poleWidth, this.data.y + 8, flagWidth - 4, 16);
  }
}