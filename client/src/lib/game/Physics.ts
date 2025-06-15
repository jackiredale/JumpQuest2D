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
    velocity: Vector2
  ): { position: Vector2; velocity: Vector2; onGround: boolean } {
    const result = {
      position: { x: playerRect.x, y: playerRect.y },
      velocity: { ...velocity },
      onGround: false
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
      // Horizontal collision
      if (playerRect.x < platformRect.x) {
        // Player is to the left of platform
        result.position.x = platformRect.x - playerRect.width;
      } else {
        // Player is to the right of platform
        result.position.x = platformRect.x + platformRect.width;
      }
      result.velocity.x = 0;
    } else {
      // Vertical collision
      if (playerRect.y < platformRect.y) {
        // Player is above platform (landing on top)
        result.position.y = platformRect.y - playerRect.height;
        result.velocity.y = 0;
        result.onGround = true;
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

  static applyFriction(velocity: Vector2, friction: number, deltaTime: number): Vector2 {
    const frictionForce = friction * deltaTime;
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
}
