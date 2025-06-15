import { ParticleData, Vector2 } from './types';

export class ParticleSystem {
  private particles: ParticleData[] = [];

  update(deltaTime: number) {
    // Update existing particles
    this.particles = this.particles.filter(particle => {
      particle.position.x += particle.velocity.x * deltaTime;
      particle.position.y += particle.velocity.y * deltaTime;
      particle.life -= deltaTime;
      
      // Apply gravity to some particle types
      if (particle.type === 'explosion' || particle.type === 'spark') {
        particle.velocity.y += 200 * deltaTime; // Gravity
      }
      
      // Fade particles over time
      particle.velocity.x *= 0.98;
      particle.velocity.y *= 0.98;
      
      return particle.life > 0;
    });
  }

  addParticle(position: Vector2, velocity: Vector2, type: 'spark' | 'dust' | 'explosion' | 'trail', color: string = '#FFFFFF', life: number = 1.0) {
    this.particles.push({
      position: { ...position },
      velocity: { ...velocity },
      life,
      maxLife: life,
      color,
      size: type === 'explosion' ? 6 : type === 'spark' ? 4 : 2,
      type
    });
  }

  addExplosion(position: Vector2, color: string = '#FFD700', particleCount: number = 8) {
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 100 + Math.random() * 100;
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      };
      
      this.addParticle(position, velocity, 'explosion', color, 0.8 + Math.random() * 0.4);
    }
  }

  addTrail(position: Vector2, velocity: Vector2, color: string = '#FFFFFF') {
    // Add multiple trail particles
    for (let i = 0; i < 3; i++) {
      const trailVelocity = {
        x: velocity.x * 0.3 + (Math.random() - 0.5) * 50,
        y: velocity.y * 0.3 + (Math.random() - 0.5) * 50
      };
      
      this.addParticle(
        { x: position.x + (Math.random() - 0.5) * 8, y: position.y + (Math.random() - 0.5) * 8 },
        trailVelocity,
        'trail',
        color,
        0.3 + Math.random() * 0.2
      );
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.globalAlpha = alpha;
      
      ctx.fillStyle = particle.color;
      
      if (particle.type === 'trail') {
        // Render trail as a line
        ctx.fillRect(
          particle.position.x - particle.size / 2,
          particle.position.y - particle.size / 2,
          particle.size,
          particle.size
        );
      } else {
        // Render other particles as squares
        ctx.fillRect(
          particle.position.x - particle.size / 2,
          particle.position.y - particle.size / 2,
          particle.size,
          particle.size
        );
      }
    });
    
    ctx.globalAlpha = 1;
  }

  clear() {
    this.particles = [];
  }

  getParticleCount(): number {
    return this.particles.length;
  }
}