export interface Hat {
  id: string;
  name: string;
  cost: number;
  description: string;
  effect: {
    type: 'speed' | 'jump' | 'lives' | 'coins';
    multiplier: number;
  };
  color: string;
  unlocked: boolean;
}

export interface ShopState {
  hats: Hat[];
  equippedHat: string | null;
  totalCoins: number;
}

export class Shop {
  private state: ShopState;

  constructor() {
    this.state = {
      hats: [
        {
          id: 'red_cap',
          name: 'Red Cap',
          cost: 500,
          description: '+20% Speed Boost',
          effect: { type: 'speed', multiplier: 1.2 },
          color: '#FF0000',
          unlocked: false
        },
        {
          id: 'blue_helmet',
          name: 'Blue Helmet',
          cost: 750,
          description: '+30% Jump Height',
          effect: { type: 'jump', multiplier: 1.3 },
          color: '#0000FF',
          unlocked: false
        },
        {
          id: 'golden_crown',
          name: 'Golden Crown',
          cost: 1000,
          description: '+1 Extra Life',
          effect: { type: 'lives', multiplier: 1 },
          color: '#FFD700',
          unlocked: false
        },
        {
          id: 'lucky_hat',
          name: 'Lucky Hat',
          cost: 1200,
          description: 'Double Coin Value',
          effect: { type: 'coins', multiplier: 2 },
          color: '#00FF00',
          unlocked: false
        },
        {
          id: 'wizard_hat',
          name: 'Wizard Hat',
          cost: 2000,
          description: 'All Boosts Combined!',
          effect: { type: 'speed', multiplier: 1.5 },
          color: '#9400D3',
          unlocked: false
        }
      ],
      equippedHat: null,
      totalCoins: 0
    };
  }

  getState(): ShopState {
    return { ...this.state };
  }

  addCoins(amount: number) {
    this.state.totalCoins += amount;
  }

  canAfford(hatId: string): boolean {
    const hat = this.state.hats.find(h => h.id === hatId);
    return hat ? this.state.totalCoins >= hat.cost : false;
  }

  buyHat(hatId: string): boolean {
    const hat = this.state.hats.find(h => h.id === hatId);
    if (hat && this.canAfford(hatId) && !hat.unlocked) {
      this.state.totalCoins -= hat.cost;
      hat.unlocked = true;
      return true;
    }
    return false;
  }

  equipHat(hatId: string): boolean {
    const hat = this.state.hats.find(h => h.id === hatId);
    if (hat && hat.unlocked) {
      this.state.equippedHat = hatId;
      return true;
    }
    return false;
  }

  unequipHat() {
    this.state.equippedHat = null;
  }

  getEquippedHat(): Hat | null {
    if (!this.state.equippedHat) return null;
    return this.state.hats.find(h => h.id === this.state.equippedHat) || null;
  }

  getSpeedMultiplier(): number {
    const hat = this.getEquippedHat();
    return hat && hat.effect.type === 'speed' ? hat.effect.multiplier : 1;
  }

  getJumpMultiplier(): number {
    const hat = this.getEquippedHat();
    return hat && hat.effect.type === 'jump' ? hat.effect.multiplier : 1;
  }

  getExtraLives(): number {
    const hat = this.getEquippedHat();
    return hat && hat.effect.type === 'lives' ? hat.effect.multiplier : 0;
  }

  getCoinMultiplier(): number {
    const hat = this.getEquippedHat();
    return hat && hat.effect.type === 'coins' ? hat.effect.multiplier : 1;
  }
}