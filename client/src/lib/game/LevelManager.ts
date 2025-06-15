import { Platform } from './Platform';
import { Collectible } from './Collectible';
import { Enemy } from './Enemy';
import { PowerUp } from './PowerUp';
import { Checkpoint } from './Checkpoint';

export interface LevelData {
  platforms: { x: number; y: number; width: number; height: number; color?: string; type?: 'normal' | 'moving' | 'breakable' | 'bouncy' | 'ice' }[];
  collectibles: { x: number; y: number; id: number; type?: 'coin' | 'gem' | 'star' }[];
  enemies: { x: number; y: number; type: 'walker' | 'jumper'; patrolDistance?: number }[];
  powerUps: { x: number; y: number; type: 'speed' | 'jump' | 'shield' | 'double_jump'; id: number }[];
  checkpoints: { x: number; y: number; id: number }[];
  spawnPoint: { x: number; y: number };
  backgroundColor: string;
  name: string;
  timeLimit?: number; // Optional time limit in seconds
}

export class LevelManager {
  private levels: LevelData[] = [];
  private currentLevel: number = 0;

  constructor() {
    this.initializeLevels();
  }

  private initializeLevels() {
    // Level 1: Enhanced Tutorial
    this.levels.push({
      name: "Welcome to Adventure",
      backgroundColor: '#87CEEB',
      spawnPoint: { x: 50, y: 400 },
      timeLimit: 120,
      platforms: [
        // Ground platforms
        { x: 0, y: 550, width: 200, height: 50 },
        { x: 250, y: 550, width: 200, height: 50 },
        { x: 500, y: 550, width: 300, height: 50 },
        
        // Tutorial platforms with different types
        { x: 150, y: 450, width: 100, height: 20, type: 'bouncy' },
        { x: 300, y: 350, width: 120, height: 20, type: 'moving' },
        { x: 500, y: 400, width: 80, height: 20, type: 'ice' },
        { x: 650, y: 300, width: 100, height: 20, type: 'breakable' },
      ],
      collectibles: [
        { x: 175, y: 420, id: 1, type: 'coin' },
        { x: 340, y: 320, id: 2, type: 'gem' },
        { x: 520, y: 370, id: 3, type: 'coin' },
        { x: 680, y: 270, id: 4, type: 'star' },
      ],
      enemies: [],
      powerUps: [
        { x: 360, y: 320, type: 'speed', id: 1 },
        { x: 680, y: 270, type: 'double_jump', id: 2 }
      ],
      checkpoints: [
        { x: 400, y: 500, id: 1 }
      ]
    });

    // Level 2: Platform Mastery
    this.levels.push({
      name: "Platform Paradise",
      backgroundColor: '#FFB6C1',
      spawnPoint: { x: 30, y: 400 },
      timeLimit: 180,
      platforms: [
        // Ground level
        { x: 0, y: 550, width: 150, height: 50 },
        { x: 200, y: 550, width: 150, height: 50, type: 'ice' },
        { x: 400, y: 550, width: 200, height: 50 },
        { x: 650, y: 550, width: 150, height: 50 },
        
        // Moving and special platforms
        { x: 100, y: 450, width: 80, height: 20, type: 'moving' },
        { x: 250, y: 400, width: 100, height: 20, type: 'bouncy' },
        { x: 450, y: 350, width: 120, height: 20, type: 'breakable' },
        { x: 650, y: 300, width: 100, height: 20, type: 'ice' },
        
        // Upper challenge area
        { x: 200, y: 250, width: 150, height: 20, type: 'moving' },
        { x: 400, y: 200, width: 200, height: 20 },
        { x: 100, y: 150, width: 100, height: 20, type: 'bouncy' },
      ],
      collectibles: [
        { x: 120, y: 420, id: 1, type: 'coin' },
        { x: 280, y: 370, id: 2, type: 'coin' },
        { x: 480, y: 320, id: 3, type: 'gem' },
        { x: 680, y: 270, id: 4, type: 'coin' },
        { x: 460, y: 170, id: 5, type: 'star' },
        { x: 130, y: 120, id: 6, type: 'gem' },
      ],
      enemies: [
        { x: 225, y: 520, type: 'walker', patrolDistance: 120 },
        { x: 500, y: 520, type: 'walker', patrolDistance: 150 },
        { x: 450, y: 170, type: 'jumper', patrolDistance: 100 },
      ],
      powerUps: [
        { x: 260, y: 370, type: 'jump', id: 1 },
        { x: 680, y: 270, type: 'shield', id: 2 },
        { x: 430, y: 170, type: 'speed', id: 3 }
      ],
      checkpoints: [
        { x: 350, y: 500, id: 1 },
        { x: 550, y: 150, id: 2 }
      ]
    });

    // Level 3: Advanced Challenges
    this.levels.push({
      name: "Sky High Challenge",
      backgroundColor: '#DDA0DD',
      spawnPoint: { x: 50, y: 500 },
      timeLimit: 240,
      platforms: [
        // Starting area
        { x: 0, y: 550, width: 120, height: 50 },
        
        // Complex jumping puzzle with various platform types
        { x: 160, y: 480, width: 60, height: 15, type: 'ice' },
        { x: 260, y: 420, width: 60, height: 15, type: 'bouncy' },
        { x: 360, y: 360, width: 60, height: 15, type: 'breakable' },
        { x: 460, y: 300, width: 80, height: 15, type: 'moving' },
        
        // Mid section with enemies and hazards
        { x: 580, y: 400, width: 120, height: 30 },
        { x: 720, y: 350, width: 80, height: 20, type: 'ice' },
        { x: 600, y: 250, width: 100, height: 20, type: 'breakable' },
        
        // Upper challenge with mixed platform types
        { x: 200, y: 200, width: 100, height: 20, type: 'bouncy' },
        { x: 350, y: 150, width: 150, height: 20, type: 'moving' },
        { x: 550, y: 100, width: 200, height: 20 },
        
        // Final platform
        { x: 680, y: 50, width: 120, height: 30, type: 'bouncy' },
      ],
      collectibles: [
        { x: 180, y: 450, id: 1, type: 'coin' },
        { x: 280, y: 390, id: 2, type: 'coin' },
        { x: 380, y: 330, id: 3, type: 'gem' },
        { x: 620, y: 370, id: 4, type: 'coin' },
        { x: 220, y: 170, id: 5, type: 'gem' },
        { x: 420, y: 120, id: 6, type: 'coin' },
        { x: 720, y: 20, id: 7, type: 'star' },
      ],
      enemies: [
        { x: 600, y: 370, type: 'walker', patrolDistance: 100 },
        { x: 400, y: 120, type: 'jumper', patrolDistance: 80 },
        { x: 600, y: 70, type: 'walker', patrolDistance: 150 },
        { x: 300, y: 170, type: 'jumper', patrolDistance: 60 },
      ],
      powerUps: [
        { x: 480, y: 270, type: 'double_jump', id: 1 },
        { x: 370, y: 120, type: 'speed', id: 2 },
        { x: 740, y: 20, type: 'shield', id: 3 },
        { x: 630, y: 220, type: 'jump', id: 4 }
      ],
      checkpoints: [
        { x: 480, y: 270, id: 1 },
        { x: 520, y: 70, id: 2 }
      ]
    });

    // Level 4: Ultimate Challenge
    this.levels.push({
      name: "Master's Trial",
      backgroundColor: '#F0E68C',
      spawnPoint: { x: 40, y: 450 },
      timeLimit: 300,
      platforms: [
        // Complex multi-level design with all platform types
        { x: 0, y: 500, width: 100, height: 30 },
        { x: 130, y: 450, width: 70, height: 15, type: 'ice' },
        { x: 230, y: 400, width: 80, height: 20, type: 'bouncy' },
        { x: 340, y: 350, width: 60, height: 15, type: 'breakable' },
        { x: 430, y: 300, width: 90, height: 20, type: 'moving' },
        { x: 550, y: 350, width: 70, height: 15, type: 'ice' },
        { x: 650, y: 400, width: 150, height: 50 },
        
        // Challenging upper section
        { x: 100, y: 250, width: 80, height: 15, type: 'breakable' },
        { x: 220, y: 200, width: 100, height: 20, type: 'moving' },
        { x: 360, y: 150, width: 120, height: 15, type: 'bouncy' },
        { x: 520, y: 200, width: 80, height: 15, type: 'ice' },
        { x: 640, y: 150, width: 100, height: 20, type: 'breakable' },
        
        // Final gauntlet
        { x: 150, y: 100, width: 200, height: 20, type: 'moving' },
        { x: 400, y: 50, width: 300, height: 30 },
        { x: 750, y: 25, width: 50, height: 15, type: 'bouncy' },
      ],
      collectibles: [
        { x: 150, y: 420, id: 1, type: 'coin' },
        { x: 250, y: 370, id: 2, type: 'coin' },
        { x: 360, y: 320, id: 3, type: 'gem' },
        { x: 570, y: 320, id: 4, type: 'coin' },
        { x: 720, y: 370, id: 5, type: 'gem' },
        { x: 240, y: 170, id: 6, type: 'coin' },
        { x: 420, y: 120, id: 7, type: 'gem' },
        { x: 540, y: 170, id: 8, type: 'coin' },
        { x: 250, y: 70, id: 9, type: 'star' },
        { x: 550, y: 20, id: 10, type: 'star' },
        { x: 775, y: -5, id: 11, type: 'star' },
      ],
      enemies: [
        { x: 250, y: 370, type: 'walker', patrolDistance: 60 },
        { x: 450, y: 270, type: 'jumper', patrolDistance: 70 },
        { x: 680, y: 370, type: 'walker', patrolDistance: 120 },
        { x: 380, y: 120, type: 'jumper', patrolDistance: 100 },
        { x: 500, y: 20, type: 'walker', patrolDistance: 200 },
        { x: 150, y: 220, type: 'jumper', patrolDistance: 50 },
      ],
      powerUps: [
        { x: 450, y: 270, type: 'double_jump', id: 1 },
        { x: 240, y: 170, type: 'speed', id: 2 },
        { x: 660, y: 120, type: 'shield', id: 3 },
        { x: 200, y: 70, type: 'jump', id: 4 },
        { x: 520, y: 170, type: 'speed', id: 5 }
      ],
      checkpoints: [
        { x: 350, y: 450, id: 1 },
        { x: 480, y: 270, id: 2 },
        { x: 250, y: 70, id: 3 }
      ]
    });
  }

  getCurrentLevel(): LevelData {
    return this.levels[this.currentLevel];
  }

  getCurrentLevelNumber(): number {
    return this.currentLevel + 1;
  }

  getTotalLevels(): number {
    return this.levels.length;
  }

  nextLevel(): boolean {
    if (this.currentLevel < this.levels.length - 1) {
      this.currentLevel++;
      return true;
    }
    return false;
  }

  resetToLevel(level: number) {
    this.currentLevel = Math.max(0, Math.min(level - 1, this.levels.length - 1));
  }

  isLastLevel(): boolean {
    return this.currentLevel >= this.levels.length - 1;
  }

  createGameObjects(levelData: LevelData) {
    const platforms = levelData.platforms.map(p => 
      new Platform(p.x, p.y, p.width, p.height, p.color, p.type)
    );

    const collectibles = levelData.collectibles.map(c => 
      new Collectible(c.x, c.y, c.id, c.type)
    );

    const enemies = levelData.enemies.map(e => 
      new Enemy(e.x, e.y, e.type, e.patrolDistance || 100)
    );

    const powerUps = levelData.powerUps.map(p => 
      new PowerUp(p.x, p.y, p.type, p.id)
    );

    const checkpoints = levelData.checkpoints.map(c =>
      new Checkpoint(c.x, c.y, c.id)
    );

    return { platforms, collectibles, enemies, powerUps, checkpoints };
  }
}