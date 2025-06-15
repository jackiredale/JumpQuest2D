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
}

export interface PlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface CollectibleData {
  x: number;
  y: number;
  size: number;
  collected: boolean;
  id: number;
}
