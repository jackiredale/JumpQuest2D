import { useEffect, useState } from "react";
import Game from "./components/Game";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";

function App() {
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    // Load audio assets
    const loadAudio = async () => {
      try {
        const backgroundMusic = new Audio("/sounds/background.mp3");
        const hitSound = new Audio("/sounds/hit.mp3");
        const successSound = new Audio("/sounds/success.mp3");

        // Set loop for background music
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.3;

        // Set volumes
        hitSound.volume = 0.5;
        successSound.volume = 0.7;

        // Store in audio store
        setBackgroundMusic(backgroundMusic);
        setHitSound(hitSound);
        setSuccessSound(successSound);

        setAssetsLoaded(true);
      } catch (error) {
        console.error("Failed to load audio assets:", error);
        setAssetsLoaded(true); // Continue even if audio fails
      }
    };

    loadAudio();
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  if (!assetsLoaded) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#87CEEB',
        color: '#333',
        fontSize: '24px',
        fontFamily: 'Courier New, monospace'
      }}>
        Loading Game Assets...
      </div>
    );
  }

  return <Game />;
}

export default App;
