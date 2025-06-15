export class InputManager {
  private keys: Set<string> = new Set();
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Focus canvas to receive keyboard events
    this.canvas.setAttribute('tabindex', '0');
    this.canvas.focus();

    document.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      console.log(`Key pressed: ${e.code}`);
    });

    document.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
      console.log(`Key released: ${e.code}`);
    });

    // Prevent context menu on canvas
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  isKeyPressed(key: string): boolean {
    return this.keys.has(key);
  }

  isLeftPressed(): boolean {
    return this.isKeyPressed('KeyA') || this.isKeyPressed('ArrowLeft');
  }

  isRightPressed(): boolean {
    return this.isKeyPressed('KeyD') || this.isKeyPressed('ArrowRight');
  }

  isJumpPressed(): boolean {
    return this.isKeyPressed('KeyW') || this.isKeyPressed('ArrowUp') || this.isKeyPressed('Space');
  }

  isDashPressed(): boolean {
    return this.isKeyPressed('ShiftLeft') || this.isKeyPressed('ShiftRight') || this.isKeyPressed('KeyX');
  }

  destroy() {
    // Remove event listeners if needed
    this.keys.clear();
  }
}