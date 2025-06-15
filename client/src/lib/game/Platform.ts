import { PlatformData } from './types';

export class Platform {
  public data: PlatformData;
  private animationTime: number = 0;

  constructor(x: number, y: number, width: number, height: number, color: string = '#8B4513', type: 'normal' | 'moving' | 'breakable' | 'bouncy' | 'ice' = 'normal') {
    this.data = {
      x,
      y,
      width,
      height,
      color,
      type,
      health: type === 'breakable' ? 3 : undefined,
      maxHealth: type === 'breakable' ? 3 : undefined
    };

    // Set up moving platform pattern
    if (type === 'moving') {
      this.data.movePattern = {
        startX: x,
        endX: x + 100, // Default movement range
        startY: y,
        endY: y,
        speed: 50,
        direction: 1
      };
    }
  }

  update(deltaTime: number) {
    this.animationTime += deltaTime;

    // Update moving platforms
    if (this.data.type === 'moving' && this.data.movePattern) {
      const pattern = this.data.movePattern;
      
      // Move horizontally
      if (pattern.startX !== pattern.endX) {
        this.data.x += pattern.direction * pattern.speed * deltaTime;
        
        if (this.data.x <= pattern.startX || this.data.x >= pattern.endX) {
          pattern.direction *= -1;
          this.data.x = Math.max(pattern.startX, Math.min(pattern.endX, this.data.x));
        }
      }
      
      // Move vertically
      if (pattern.startY !== pattern.endY) {
        this.data.y += pattern.direction * pattern.speed * deltaTime;
        
        if (this.data.y <= pattern.startY || this.data.y >= pattern.endY) {
          pattern.direction *= -1;
          this.data.y = Math.max(pattern.startY, Math.min(pattern.endY, this.data.y));
        }
      }
    }
  }

  takeDamage(): boolean {
    if (this.data.type === 'breakable' && this.data.health !== undefined) {
      this.data.health--;
      return this.data.health <= 0;
    }
    return false;
  }

  getRect() {
    return {
      x: this.data.x,
      y: this.data.y,
      width: this.data.width,
      height: this.data.height
    };
  }

  getTypeColor(): string {
    switch (this.data.type) {
      case 'moving': return '#9370DB';
      case 'breakable': return '#CD853F';
      case 'bouncy': return '#32CD32';
      case 'ice': return '#87CEEB';
      default: return this.data.color;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const baseColor = this.getTypeColor();
    
    // Main platform
    ctx.fillStyle = baseColor;
    ctx.fillRect(this.data.x, this.data.y, this.data.width, this.data.height);
    
    // Type-specific effects
    switch (this.data.type) {
      case 'moving':
        // Animated glow for moving platforms
        const glowIntensity = Math.sin(this.animationTime * 0.01) * 0.3 + 0.7;
        ctx.globalAlpha = glowIntensity * 0.5;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.data.x - 2, this.data.y - 2, this.data.width + 4, this.data.height + 4);
        ctx.globalAlpha = 1;
        break;
        
      case 'breakable':
        // Cracks based on damage
        if (this.data.health !== undefined && this.data.maxHealth !== undefined) {
          const damageRatio = 1 - (this.data.health / this.data.maxHealth);
          if (damageRatio > 0.33) {
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.data.x + this.data.width * 0.3, this.data.y);
            ctx.lineTo(this.data.x + this.data.width * 0.7, this.data.y + this.data.height);
            ctx.stroke();
          }
          if (damageRatio > 0.66) {
            ctx.beginPath();
            ctx.moveTo(this.data.x, this.data.y + this.data.height * 0.5);
            ctx.lineTo(this.data.x + this.data.width, this.data.y + this.data.height * 0.3);
            ctx.stroke();
          }
        }
        break;
        
      case 'bouncy':
        // Bouncy animation
        const bounce = Math.sin(this.animationTime * 0.02) * 2;
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(this.data.x + 2, this.data.y + 2 + bounce, this.data.width - 4, this.data.height - 4);
        break;
        
      case 'ice':
        // Ice shine effect
        ctx.fillStyle = '#E0F6FF';
        ctx.fillRect(this.data.x + 2, this.data.y + 2, this.data.width - 4, this.data.height - 4);
        
        // Sparkles
        if (Math.sin(this.animationTime * 0.015) > 0.7) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(this.data.x + this.data.width * 0.2, this.data.y + 2, 2, 2);
          ctx.fillRect(this.data.x + this.data.width * 0.8, this.data.y + 2, 2, 2);
        }
        break;
    }
    
    // Add texture pattern
    ctx.fillStyle = this.data.type === 'ice' ? '#B0E0E6' : '#A0522D';
    const tileSize = 16;
    for (let x = this.data.x; x < this.data.x + this.data.width; x += tileSize) {
      for (let y = this.data.y; y < this.data.y + this.data.height; y += tileSize) {
        ctx.fillRect(x + 2, y + 2, 2, 2);
        ctx.fillRect(x + 10, y + 10, 2, 2);
      }
    }
    
    // Border
    ctx.strokeStyle = this.data.type === 'ice' ? '#4682B4' : '#654321';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.data.x, this.data.y, this.data.width, this.data.height);
  }
}