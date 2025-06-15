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
    
    // Just update the muted state
    set({ isMuted: newMutedState });
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },

  playJump: () => {
    const { jumpSound, isMuted } = get();
    if (jumpSound && !isMuted) {
      const soundClone = jumpSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.4;
      soundClone.play().catch(console.log);
    }
  },

  playPowerUp: () => {
    const { powerUpSound, isMuted } = get();
    if (powerUpSound && !isMuted) {
      powerUpSound.currentTime = 0;
      powerUpSound.volume = 0.6;
      powerUpSound.play().catch(console.log);
    }
  },

  playEnemyDestroy: () => {
    const { enemyDestroySound, isMuted } = get();
    if (enemyDestroySound && !isMuted) {
      enemyDestroySound.currentTime = 0;
      enemyDestroySound.volume = 0.5;
      enemyDestroySound.play().catch(console.log);
    }
  },

  playLevelComplete: () => {
    const { levelCompleteSound, isMuted } = get();
    if (levelCompleteSound && !isMuted) {
      levelCompleteSound.currentTime = 0;
      levelCompleteSound.volume = 0.7;
      levelCompleteSound.play().catch(console.log);
    }
  }
}));
