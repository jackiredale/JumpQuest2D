import { Platform } from './Platform';
import { Collectible } from './Collectible';
import { Enemy } from './Enemy';
import { PowerUp } from './PowerUp';

export interface LevelData {
  platforms: { x: number; y: number; width: number; height: number; color?: string }[];
  collectibles: { x: number; y: number; id: number }[];
  enemies: { x: number; y: number; type: 'walker' | 'jumper'; patrolDistance?: number }[];
  powerUps: { x: number; y: number; type: 'speed' | 'jump' | 'shield' | 'double_jump'; id: number }[];
  spawnPoint: { x: number; y: number };
  backgroundColor: string;
  name: string;
}

export class LevelManager {
  private levels: LevelData[] = [];
  private currentLevel: number = 0;

  constructor() {
    this.initializeLevels();
  }

  private initializeLevels() {
    // Level 1: Tutorial Level
    this.levels.push({
      name: "First Steps",
      backgroundColor: '#87CEEB',
      spawnPoint: { x: 50, y: 400 },
      platforms: [
        // Ground platforms
        { x: 0, y: 550, width: 200, height: 50 },
        { x: 250, y: 550, width: 200, height: 50 },
        { x: 500, y: 550, width: 300, height: 50 },
        
        // Mid-level platforms
        { x: 150, y: 450, width: 100, height: 20 },
        { x: 300, y: 350, width: 120, height: 20 },
        { x: 500, y: 400, width: 80, height: 20 },
      ],
      collectibles: [
        { x: 175, y: 420, id: 1 },
        { x: 340, y: 320, id: 2 },
        { x: 520, y: 370, id: 3 },
      ],
      enemies: [],
      powerUps: [
        { x: 360, y: 320, type: 'speed', id: 1 }
      ]
    });

    // Level 2: Enemy Introduction
    this.levels.push({
      name: "Danger Zone",
      backgroundColor: '#FFB6C1',
      spawnPoint: { x: 30, y: 400 },
      platforms: [
        // Ground level
        { x: 0, y: 550, width: 150, height: 50 },
        { x: 200, y: 550, width: 150, height: 50 },
        { x: 400, y: 550, width: 200, height: 50 },
        { x: 650, y: 550, width: 150, height: 50 },
        
        // Multiple levels
        { x: 100, y: 450, width: 80, height: 20 },
        { x: 250, y: 400, width: 100, height: 20 },
        { x: 450, y: 350, width: 120, height: 20 },
        { x: 650, y: 300, width: 100, height: 20 },
        
        // Upper platforms
        { x: 200, y: 250, width: 150, height: 20 },
        { x: 400, y: 200, width: 200, height: 20 },
      ],
      collectibles: [
        { x: 120, y: 420, id: 1 },
        { x: 280, y: 370, id: 2 },
        { x: 480, y: 320, id: 3 },
        { x: 680, y: 270, id: 4 },
        { x: 460, y: 170, id: 5 },
      ],
      enemies: [
        { x: 225, y: 520, type: 'walker', patrolDistance: 120 },
        { x: 500, y: 520, type: 'walker', patrolDistance: 150 },
      ],
      powerUps: [
        { x: 260, y: 370, type: 'jump', id: 1 },
        { x: 680, y: 270, type: 'shield', id: 2 }
      ]
    });

    // Level 3: Advanced Challenges
    this.levels.push({
      name: "Sky High",
      backgroundColor: '#DDA0DD',
      spawnPoint: { x: 50, y: 500 },
      platforms: [
        // Starting area
        { x: 0, y: 550, width: 120, height: 50 },
        
        // Jumping puzzle
        { x: 160, y: 480, width: 60, height: 15 },
        { x: 260, y: 420, width: 60, height: 15 },
        { x: 360, y: 360, width: 60, height: 15 },
        { x: 460, y: 300, width: 80, height: 15 },
        
        // Mid section with enemies
        { x: 580, y: 400, width: 120, height: 30 },
        { x: 720, y: 350, width: 80, height: 20 },
        
        // Upper challenge
        { x: 200, y: 200, width: 100, height: 20 },
        { x: 350, y: 150, width: 150, height: 20 },
        { x: 550, y: 100, width: 200, height: 20 },
        
        // Final platform
        { x: 680, y: 50, width: 120, height: 30 },
      ],
      collectibles: [
        { x: 180, y: 450, id: 1 },
        { x: 280, y: 390, id: 2 },
        { x: 380, y: 330, id: 3 },
        { x: 620, y: 370, id: 4 },
        { x: 220, y: 170, id: 5 },
        { x: 420, y: 120, id: 6 },
        { x: 720, y: 20, id: 7 },
      ],
      enemies: [
        { x: 600, y: 370, type: 'walker', patrolDistance: 100 },
        { x: 400, y: 120, type: 'jumper', patrolDistance: 80 },
        { x: 600, y: 70, type: 'walker', patrolDistance: 150 },
      ],
      powerUps: [
        { x: 480, y: 270, type: 'double_jump', id: 1 },
        { x: 370, y: 120, type: 'speed', id: 2 },
        { x: 740, y: 20, type: 'shield', id: 3 }
      ]
    });

    // Level 4: Ultimate Challenge
    this.levels.push({
      name: "Final Challenge",
      backgroundColor: '#F0E68C',
      spawnPoint: { x: 40, y: 450 },
      platforms: [
        // Complex multi-level design
        { x: 0, y: 500, width: 100, height: 30 },
        { x: 130, y: 450, width: 70, height: 15 },
        { x: 230, y: 400, width: 80, height: 20 },
        { x: 340, y: 350, width: 60, height: 15 },
        { x: 430, y: 300, width: 90, height: 20 },
        { x: 550, y: 350, width: 70, height: 15 },
        { x: 650, y: 400, width: 150, height: 50 },
        
        // Upper section
        { x: 100, y: 250, width: 80, height: 15 },
        { x: 220, y: 200, width: 100, height: 20 },
        { x: 360, y: 150, width: 120, height: 15 },
        { x: 520, y: 200, width: 80, height: 15 },
        { x: 640, y: 150, width: 100, height: 20 },
        
        // Top section
        { x: 150, y: 100, width: 200, height: 20 },
        { x: 400, y: 50, width: 300, height: 30 },
      ],
      collectibles: [
        { x: 150, y: 420, id: 1 },
        { x: 250, y: 370, id: 2 },
        { x: 360, y: 320, id: 3 },
        { x: 570, y: 320, id: 4 },
        { x: 720, y: 370, id: 5 },
        { x: 240, y: 170, id: 6 },
        { x: 420, y: 120, id: 7 },
        { x: 540, y: 170, id: 8 },
        { x: 250, y: 70, id: 9 },
        { x: 550, y: 20, id: 10 },
      ],
      enemies: [
        { x: 250, y: 370, type: 'walker', patrolDistance: 60 },
        { x: 450, y: 270, type: 'jumper', patrolDistance: 70 },
        { x: 680, y: 370, type: 'walker', patrolDistance: 120 },
        { x: 380, y: 120, type: 'jumper', patrolDistance: 100 },
        { x: 500, y: 20, type: 'walker', patrolDistance: 200 },
      ],
      powerUps: [
        { x: 450, y: 270, type: 'double_jump', id: 1 },
        { x: 240, y: 170, type: 'speed', id: 2 },
        { x: 660, y: 120, type: 'shield', id: 3 },
        { x: 200, y: 70, type: 'jump', id: 4 }
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
      new Platform(p.x, p.y, p.width, p.height, p.color)
    );

    const collectibles = levelData.collectibles.map(c => 
      new Collectible(c.x, c.y, c.id)
    );

    const enemies = levelData.enemies.map(e => 
      new Enemy(e.x, e.y, e.type, e.patrolDistance || 100)
    );

    const powerUps = levelData.powerUps.map(p => 
      new PowerUp(p.x, p.y, p.type, p.id)
    );

    return { platforms, collectibles, enemies, powerUps };
  }
}