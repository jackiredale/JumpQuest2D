import { Vector2, Rectangle } from './types';

export class Physics {
  static checkAABBCollision(rect1: Rectangle, rect2: Rectangle): boolean {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  static resolveCollision(
    playerRect: Rectangle,
    platformRect: Rectangle,
    velocity: Vector2,
    platformType: string = 'normal'
  ): { position: Vector2; velocity: Vector2; onGround: boolean; onWall: boolean; wallDirection: number } {
    const result = {
      position: { x: playerRect.x, y: playerRect.y },
      velocity: { ...velocity },
      onGround: false,
      onWall: false,
      wallDirection: 0
    };

    // Calculate overlap amounts
    const overlapX = Math.min(
      playerRect.x + playerRect.width - platformRect.x,
      platformRect.x + platformRect.width - playerRect.x
    );
    
    const overlapY = Math.min(
      playerRect.y + playerRect.height - platformRect.y,
      platformRect.y + platformRect.height - playerRect.y
    );

    // Resolve collision based on smallest overlap
    if (overlapX < overlapY) {
      // Horizontal collision (wall)
      if (playerRect.x < platformRect.x) {
        // Player is to the left of platform
        result.position.x = platformRect.x - playerRect.width;
        result.onWall = true;
        result.wallDirection = 1; // Wall is to the right
      } else {
        // Player is to the right of platform
        result.position.x = platformRect.x + platformRect.width;
        result.onWall = true;
        result.wallDirection = -1; // Wall is to the left
      }
      
      // Apply platform-specific effects for horizontal collision
      if (platformType === 'ice') {
        result.velocity.x *= 0.95; // Reduced friction on ice
      } else {
        result.velocity.x = 0;
      }
    } else {
      // Vertical collision
      if (playerRect.y < platformRect.y) {
        // Player is above platform (landing on top)
        result.position.y = platformRect.y - playerRect.height;
        result.onGround = true;
        
        // Apply platform-specific effects
        switch (platformType) {
          case 'bouncy':
            result.velocity.y = -Math.abs(velocity.y) * 1.2; // Bounce with extra force
            break;
          case 'ice':
            result.velocity.y = 0;
            // Ice platforms don't change horizontal velocity much
            break;
          default:
            result.velocity.y = 0;
            break;
        }
      } else {
        // Player is below platform (hitting from below)
        result.position.y = platformRect.y + platformRect.height;
        result.velocity.y = 0;
      }
    }

    return result;
  }

  static applyGravity(velocity: Vector2, gravity: number, deltaTime: number): Vector2 {
    return {
      x: velocity.x,
      y: velocity.y + gravity * deltaTime
    };
  }

  static applyFriction(velocity: Vector2, friction: number, deltaTime: number, platformType: string = 'normal'): Vector2 {
    let frictionMultiplier = 1;
    
    // Adjust friction based on platform type
    switch (platformType) {
      case 'ice':
        frictionMultiplier = 0.1; // Very slippery
        break;
      case 'normal':
      default:
        frictionMultiplier = 1;
        break;
    }
    
    const frictionForce = friction * deltaTime * frictionMultiplier;
    let newVelX = velocity.x;
    
    if (Math.abs(newVelX) < frictionForce) {
      newVelX = 0;
    } else if (newVelX > 0) {
      newVelX -= frictionForce;
    } else {
      newVelX += frictionForce;
    }

    return {
      x: newVelX,
      y: velocity.y
    };
  }

  static clampVelocity(velocity: Vector2, maxSpeed: number): Vector2 {
    return {
      x: Math.max(-maxSpeed, Math.min(maxSpeed, velocity.x)),
      y: Math.max(-maxSpeed, Math.min(maxSpeed, velocity.y))
    };
  }

  static getDistance(pos1: Vector2, pos2: Vector2): number {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static normalize(vector: Vector2): Vector2 {
    const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    if (length === 0) return { x: 0, y: 0 };
    return { x: vector.x / length, y: vector.y / length };
  }
}