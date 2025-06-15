import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  jumpSound: HTMLAudioElement | null;
  powerUpSound: HTMLAudioElement | null;
  enemyDestroySound: HTMLAudioElement | null;
  levelCompleteSound: HTMLAudioElement | null;
  isMuted: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  setJumpSound: (sound: HTMLAudioElement) => void;
  setPowerUpSound: (sound: HTMLAudioElement) => void;
  setEnemyDestroySound: (sound: HTMLAudioElement) => void;
  setLevelCompleteSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playJump: () => void;
  playPowerUp: () => void;
  playEnemyDestroy: () => void;
  playLevelComplete: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  jumpSound: null,
  powerUpSound: null,
  enemyDestroySound: null,
  levelCompleteSound: null,
  isMuted: true, // Start muted by default
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  setJumpSound: (sound) => set({ jumpSound: sound }),
  setPowerUpSound: (sound) => set({ powerUpSound: sound }),
  setEnemyDestroySound: (sound) => set({ enemyDestroySound: sound }),
  setLevelCompleteSound: (sound) => set({ levelCompleteSound: sound }),
  
  toggleMute: () => {
    const { isMuted } = get();
    const newMutedState = !isMuted;
    
    set({ isMuted: newMutedState });
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound && !isMuted) {
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.4;
      soundClone.play().catch(console.log);
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound && !isMuted) {
      const soundClone = successSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.5;
      soundClone.play().catch(console.log);
    }
  },

  playJump: () => {
    const { jumpSound, isMuted } = get();
    if (jumpSound && !isMuted) {
      const soundClone = jumpSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(console.log);
    }
  },

  playPowerUp: () => {
    const { powerUpSound, isMuted } = get();
    if (powerUpSound && !isMuted) {
      const soundClone = powerUpSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.6;
      soundClone.play().catch(console.log);
    }
  },

  playEnemyDestroy: () => {
    const { enemyDestroySound, isMuted } = get();
    if (enemyDestroySound && !isMuted) {
      const soundClone = enemyDestroySound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.5;
      soundClone.play().catch(console.log);
    }
  },

  playLevelComplete: () => {
    const { levelCompleteSound, isMuted } = get();
    if (levelCompleteSound && !isMuted) {
      const soundClone = levelCompleteSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.7;
      soundClone.play().catch(console.log);
    }
  }
}));