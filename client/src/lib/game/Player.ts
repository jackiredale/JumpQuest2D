import { Vector2, PlayerState, GameConfig } from './types';
import { Physics } from './Physics';

export class Player {
  public state: PlayerState;
  private config: GameConfig;
  private previousJumpPressed: boolean = false;
  private previousDashPressed: boolean = false;
  private animationTime: number = 0;
  private dustParticles: Array<{x: number, y: number, life: number}> = [];

  constructor(x: number, y: number, config: GameConfig) {
    this.state = {
      position: { x, y },
      velocity: { x: 0, y: 0 },
      size: { x: 32, y: 32 },
      onGround: false,
      facing: 'right',
      lives: 3,
      activePowerUps: new Map(),
      canDoubleJump: false,
      hasDoubleJumped: false,
      invulnerable: false,
      invulnerabilityTime: 0,
      dashCooldown: 0,
      canDash: true,
      isDashing: false,
      dashDirection: { x: 0, y: 0 },
      wallJumpCooldown: 0,
      canWallJump: false,
      onWall: false,
      wallDirection: 0,
      equippedHatEffect: null,
    };
    this.config = config;
  }

  update(deltaTime: number, leftPressed: boolean, rightPressed: boolean, jumpPressed: boolean, dashPressed: boolean = false) {
    this.animationTime += deltaTime;
    
    // Update power-ups
    this.updatePowerUps(deltaTime);
    
    // Update invulnerability
    if (this.state.invulnerable) {
      this.state.invulnerabilityTime -= deltaTime;
      if (this.state.invulnerabilityTime <= 0) {
        this.state.invulnerable = false;
      }
    }

    // Update dash cooldown
    if (this.state.dashCooldown > 0) {
      this.state.dashCooldown -= deltaTime;
      if (this.state.dashCooldown <= 0) {
        this.state.canDash = true;
      }
    }

    // Update wall jump cooldown
    if (this.state.wallJumpCooldown > 0) {
      this.state.wallJumpCooldown -= deltaTime;
    }

    // Handle dash
    const wasDashPressed = this.previousDashPressed;
    const isDashJustPressed = dashPressed && !wasDashPressed;
    this.previousDashPressed = dashPressed;

    if (isDashJustPressed && this.state.canDash && !this.state.isDashing) {
      this.performDash(leftPressed, rightPressed);
    }

    // Update dash state
    if (this.state.isDashing) {
      this.state.velocity.x = this.state.dashDirection.x * 600; // Dash speed
      this.state.velocity.y = this.state.dashDirection.y * 600;
      
      // End dash after short duration
      if (this.state.dashCooldown > 0.8) { // Dash lasts 0.2 seconds
        this.state.isDashing = false;
      }
    } else {
      // Normal movement when not dashing
      this.handleMovement(deltaTime, leftPressed, rightPressed, jumpPressed);
    }

    // Apply gravity (reduced during dash)
    const gravityMultiplier = this.state.isDashing ? 0.3 : 1;
    this.state.velocity = Physics.applyGravity(this.state.velocity, this.config.gravity * gravityMultiplier, deltaTime);

    // Clamp velocity
    this.state.velocity = Physics.clampVelocity(this.state.velocity, this.config.terminalVelocity);

    // Update position
    this.state.position.x += this.state.velocity.x * deltaTime;
    this.state.position.y += this.state.velocity.y * deltaTime;

    // Update dust particles
    this.updateDustParticles(deltaTime);

    // Create dust when moving on ground
    if (this.state.onGround && Math.abs(this.state.velocity.x) > 50) {
      if (Math.random() < 0.3) {
        this.dustParticles.push({
          x: this.state.position.x + Math.random() * this.state.size.x,
          y: this.state.position.y + this.state.size.y,
          life: 0.5
        });
      }
    }

    // Reset ground and wall states (will be set by collision detection)
    this.state.onGround = false;
    this.state.onWall = false;
  }

  public setEquippedHatEffect(effect: { type: 'speed' | 'jump' | 'lives' | 'coins'; multiplier: number } | null) {
    const previousEffect = this.state.equippedHatEffect;

    // Remove previous hat's lives bonus if it was a 'lives' hat
    if (previousEffect && previousEffect.type === 'lives') {
      this.state.lives -= previousEffect.multiplier;
    }

    this.state.equippedHatEffect = effect; // Set the new effect

    // Add new hat's lives bonus if it is a 'lives' hat
    if (effect && effect.type === 'lives') {
      this.state.lives += effect.multiplier;
    }

    this.state.lives = Math.max(0, this.state.lives);
  }

  private handleMovement(deltaTime: number, leftPressed: boolean, rightPressed: boolean, jumpPressed: boolean) {
    const moveSpeed = this.getModifiedMoveSpeed();
    const jumpForce = this.getModifiedJumpForce();
    
    // Handle horizontal movement
    if (leftPressed) {
      this.state.velocity.x = -moveSpeed;
      this.state.facing = 'left';
    } else if (rightPressed) {
      this.state.velocity.x = moveSpeed;
      this.state.facing = 'right';
    } else {
      // Apply friction when no input
      this.state.velocity = Physics.applyFriction(this.state.velocity, this.config.friction, deltaTime);
    }

    // Handle jumping with improved mechanics
    const wasJumpPressed = this.previousJumpPressed;
    const isJumpJustPressed = jumpPressed && !wasJumpPressed;
    this.previousJumpPressed = jumpPressed;
    
    if (isJumpJustPressed) {
      if (this.state.onGround) {
        // Regular jump
        this.state.velocity.y = -jumpForce;
        this.state.onGround = false;
        this.state.hasDoubleJumped = false;
        console.log("Regular jump!");
      } else if (this.state.onWall && this.state.wallJumpCooldown <= 0) {
        // Wall jump
        this.state.velocity.y = -jumpForce * 0.9;
        this.state.velocity.x = -this.state.wallDirection * moveSpeed * 1.2;
        this.state.wallJumpCooldown = 0.3;
        this.state.facing = this.state.wallDirection > 0 ? 'left' : 'right';
        console.log("Wall jump!");
      } else if (this.state.canDoubleJump && !this.state.hasDoubleJumped && !this.state.onGround) {
        // Double jump
        this.state.velocity.y = -jumpForce * 0.8;
        this.state.hasDoubleJumped = true;
        console.log("Double jump activated!");
      }
    }

    // Reset double jump when on ground
    if (this.state.onGround) {
      this.state.hasDoubleJumped = false;
    }
  }

  private performDash(leftPressed: boolean, rightPressed: boolean) {
    let dashX = 0;
    let dashY = 0;

    // Determine dash direction
    if (leftPressed) dashX = -1;
    else if (rightPressed) dashX = 1;
    else dashX = this.state.facing === 'right' ? 1 : -1;

    // Normalize direction
    const length = Math.sqrt(dashX * dashX + dashY * dashY) || 1;
    this.state.dashDirection = { x: dashX / length, y: dashY / length };
    
    this.state.isDashing = true;
    this.state.canDash = false;
    this.state.dashCooldown = 1.0; // 1 second cooldown
    this.state.invulnerable = true;
    this.state.invulnerabilityTime = 0.2; // Brief invulnerability during dash

    console.log("Dash activated!");
  }

  private updateDustParticles(deltaTime: number) {
    this.dustParticles = this.dustParticles.filter(particle => {
      particle.life -= deltaTime;
      return particle.life > 0;
    });
  }

  private updatePowerUps(deltaTime: number) {
    const currentTime = Date.now();
    const toRemove: string[] = [];

    this.state.activePowerUps.forEach((powerUp, type) => {
      if (currentTime > powerUp.endTime) {
        toRemove.push(type);
      }
    });

    toRemove.forEach(type => {
      this.state.activePowerUps.delete(type);
      if (type === 'double_jump') {
        this.state.canDoubleJump = false;
      }
    });
  }

  addPowerUp(type: string, duration: number) {
    const currentTime = Date.now();
    this.state.activePowerUps.set(type, {
      endTime: currentTime + duration * 1000,
      type: type
    });

    if (type === 'double_jump') {
      this.state.canDoubleJump = true;
    }
  }

  private getModifiedMoveSpeed(): number {
    let speed = this.config.moveSpeed;
    if (this.state.activePowerUps.has('speed')) {
      speed *= 1.5; // Power-up multiplier
    }
    if (this.state.equippedHatEffect && this.state.equippedHatEffect.type === 'speed') {
      speed *= this.state.equippedHatEffect.multiplier; // Hat multiplier
    }
    return speed;
  }

  private getModifiedJumpForce(): number {
    let jumpForce = this.config.jumpForce;
    if (this.state.activePowerUps.has('jump')) {
      jumpForce *= 1.3; // Power-up multiplier
    }
    if (this.state.equippedHatEffect && this.state.equippedHatEffect.type === 'jump') {
      jumpForce *= this.state.equippedHatEffect.multiplier; // Hat multiplier
    }
    return jumpForce;
  }

  hasShield(): boolean {
    return this.state.activePowerUps.has('shield');
  }

  getActivePowerUps(): string[] {
    return Array.from(this.state.activePowerUps.keys());
  }

  getRect() {
    return {
      x: this.state.position.x,
      y: this.state.position.y,
      width: this.state.size.x,
      height: this.state.size.y
    };
  }

  setPosition(x: number, y: number) {
    this.state.position.x = x;
    this.state.position.y = y;
  }

  setVelocity(x: number, y: number) {
    this.state.velocity.x = x;
    this.state.velocity.y = y;
  }

  setOnGround(onGround: boolean) {
    this.state.onGround = onGround;
  }

  setOnWall(onWall: boolean, direction: number) {
    this.state.onWall = onWall;
    this.state.wallDirection = direction;
  }

  takeDamage() {
    if (this.state.invulnerable) return false;
    
    this.state.lives--;
    this.state.invulnerable = true;
    this.state.invulnerabilityTime = 2.0; // 2 seconds of invulnerability
    return true;
  }

  isDead(): boolean {
    return this.state.lives <= 0;
  }

  reset(x: number, y: number) {
    this.state.position = { x, y };
    this.state.velocity = { x: 0, y: 0 };
    this.state.onGround = false;
    this.state.facing = 'right';

    this.state.lives = 3; // Always reset to base lives first. Hat effect will be applied by GameEngine.

    this.state.activePowerUps.clear();
    this.state.canDoubleJump = false;
    this.state.hasDoubleJumped = false;
    this.state.invulnerable = false;
    this.state.invulnerabilityTime = 0;
    this.state.dashCooldown = 0;
    this.state.canDash = true;
    this.state.isDashing = false;
    this.state.wallJumpCooldown = 0;
    this.state.onWall = false;
    this.previousJumpPressed = false;
    this.previousDashPressed = false;
    this.dustParticles = [];
    // Note: this.state.equippedHatEffect is NOT reset here as it's managed by GameEngine / persisted.
  }

  render(ctx: CanvasRenderingContext2D) {
    // Render dust particles
    this.dustParticles.forEach(particle => {
      const alpha = particle.life / 0.5;
      ctx.globalAlpha = alpha * 0.6;
      ctx.fillStyle = '#D2B48C';
      ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
    });
    ctx.globalAlpha = 1;

    // Flicker effect when invulnerable
    if (this.state.invulnerable && Math.floor(this.animationTime * 10) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // Draw player with enhanced visuals
    let playerColor = '#FF6B6B';
    
    // Change color based on active power-ups
    if (this.state.activePowerUps.has('shield')) {
      playerColor = '#4169E1';
    } else if (this.state.activePowerUps.has('speed')) {
      playerColor = '#00FF00';
    } else if (this.state.isDashing) {
      playerColor = '#FFD700';
    }
    
    // Main body
    ctx.fillStyle = playerColor;
    ctx.fillRect(this.state.position.x, this.state.position.y, this.state.size.x, this.state.size.y);
    
    // Dash trail effect
    if (this.state.isDashing) {
      ctx.globalAlpha = 0.3;
      for (let i = 1; i <= 3; i++) {
        ctx.fillStyle = playerColor;
        ctx.fillRect(
          this.state.position.x - this.state.dashDirection.x * i * 8,
          this.state.position.y - this.state.dashDirection.y * i * 8,
          this.state.size.x,
          this.state.size.y
        );
      }
      ctx.globalAlpha = 1;
    }
    
    // Power-up glow effect
    if (this.state.activePowerUps.size > 0) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(this.state.position.x - 2, this.state.position.y - 2, this.state.size.x + 4, this.state.size.y + 4);
      ctx.globalAlpha = 1;
    }
    
    // Enhanced pixel art details
    ctx.fillStyle = '#FFFFFF';
    const eyeSize = 4;
    const eyeY = this.state.position.y + 8;
    
    // Eyes with direction
    if (this.state.facing === 'right') {
      ctx.fillRect(this.state.position.x + 20, eyeY, eyeSize, eyeSize);
      ctx.fillRect(this.state.position.x + 26, eyeY, eyeSize, eyeSize);
    } else {
      ctx.fillRect(this.state.position.x + 2, eyeY, eyeSize, eyeSize);
      ctx.fillRect(this.state.position.x + 8, eyeY, eyeSize, eyeSize);
    }

    // Mouth (changes based on state)
    ctx.fillStyle = '#000000';
    if (this.state.isDashing) {
      // Determined expression
      ctx.fillRect(this.state.position.x + 12, this.state.position.y + 20, 8, 2);
    } else if (this.state.velocity.y < -100) {
      // Happy jumping expression
      ctx.fillRect(this.state.position.x + 10, this.state.position.y + 18, 12, 4);
    }
    
    // Body outline
    ctx.strokeStyle = this.state.invulnerable ? '#FFFFFF' : '#CC5555';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.state.position.x, this.state.position.y, this.state.size.x, this.state.size.y);
    
    // Dash cooldown indicator
    if (!this.state.canDash && this.state.dashCooldown > 0) {
      const cooldownProgress = 1 - (this.state.dashCooldown / 1.0);
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(
        this.state.position.x,
        this.state.position.y - 6,
        this.state.size.x * cooldownProgress,
        2
      );
    }

    ctx.globalAlpha = 1;
  }
}