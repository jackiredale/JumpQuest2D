import { forwardRef } from "react";

interface GameCanvasProps {
  width?: number;
  height?: number;
}

const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(
  ({ width = 800, height = 600 }, ref) => {
    return (
      <canvas
        ref={ref}
        width={width}
        height={height}
        style={{
          border: '4px solid #333',
          borderRadius: '8px',
          imageRendering: 'pixelated',
          backgroundColor: '#87CEEB'
        }}
      />
    );
  }
);

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
