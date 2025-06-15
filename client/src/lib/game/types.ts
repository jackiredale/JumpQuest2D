export interface Vector2 {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameConfig {
  gravity: number;
  jumpForce: number;
  moveSpeed: number;
  friction: number;
  terminalVelocity: number;
}

export interface GameCallbacks {
  onScoreChange: (score: number) => void;
  onLifeChange: (lives: number) => void;
  onLevelChange: (level: number) => void;
  onGameStart: () => void;
  onGameEnd: () => void;
  onGameRestart: () => void;
  onCoinCollected: () => void;
  onPowerUpCollected: () => void;
  onEnemyDefeated: () => void;
  onPlayerHurt: () => void;
  onLevelComplete: () => void;
}

export interface GameObject {
  position: Vector2;
  velocity: Vector2;
  size: Vector2;
  color: string;
  active: boolean;
}

export interface PlayerState {
  position: Vector2;
  velocity: Vector2;
  size: Vector2;
  onGround: boolean;
  facing: 'left' | 'right';
  lives: number;
  activePowerUps: Map<string, { endTime: number; type: string }>;
  canDoubleJump: boolean;
  hasDoubleJumped: boolean;
  invulnerable: boolean;
  invulnerabilityTime: number;
  dashCooldown: number;
  canDash: boolean;
  isDashing: boolean;
  dashDirection: Vector2;
  wallJumpCooldown: number;
  canWallJump: boolean;
  onWall: boolean;
  wallDirection: number;
}

export interface PlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  type?: 'normal' | 'moving' | 'breakable' | 'bouncy' | 'ice';
  movePattern?: {
    startX: number;
    endX: number;
    startY: number;
    endY: number;
    speed: number;
    direction: number;
  };
  health?: number;
  maxHealth?: number;
}

export interface CollectibleData {
  x: number;
  y: number;
  size: number;
  collected: boolean;
  id: number;
  type?: 'coin' | 'gem' | 'star';
  value?: number;
}

export interface ParticleData {
  position: Vector2;
  velocity: Vector2;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'spark' | 'dust' | 'explosion' | 'trail';
}

export interface CheckpointData {
  x: number;
  y: number;
  activated: boolean;
  id: number;
}