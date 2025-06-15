# 2D Platformer Game

## Overview

This is a 2D platformer game built with React and TypeScript on the frontend, and Express.js on the backend. The game features pixel-art styling, audio integration, and uses HTML5 Canvas for rendering. The project includes a full-stack architecture with database support using Drizzle ORM and PostgreSQL.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand for game state and audio management
- **Game Engine**: Custom HTML5 Canvas-based game engine
- **Audio**: HTML5 Audio API for sound effects and background music
- **Build Tool**: Vite with GLSL shader support

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: PostgreSQL-based session storage
- **Development**: Hot reload with Vite middleware integration

### Game Engine Components
- **Player System**: Physics-based player movement with gravity and collision detection
- **Platform System**: Static platform collision detection
- **Collectible System**: Animated coin collection mechanics
- **Input Management**: Keyboard input handling for WASD and arrow keys
- **Physics Engine**: Custom AABB collision detection and resolution

## Key Components

### Game Architecture
1. **GameEngine** (`client/src/lib/game/GameEngine.ts`): Core game loop and entity management
2. **Player** (`client/src/lib/game/Player.ts`): Player character with physics and state
3. **Platform** (`client/src/lib/game/Platform.ts`): Static collision objects
4. **Collectible** (`client/src/lib/game/Collectible.ts`): Animated collectible items
5. **Physics** (`client/src/lib/game/Physics.ts`): Collision detection and response
6. **Input** (`client/src/lib/game/Input.ts`): Keyboard input management

### UI Components
1. **Game** (`client/src/components/Game.tsx`): Main game container
2. **GameCanvas** (`client/src/components/GameCanvas.tsx`): Canvas wrapper component
3. **GameUI** (`client/src/components/GameUI.tsx`): Game HUD and controls
4. **Interface** (`client/src/components/ui/interface.tsx`): Game state management UI

### State Management
1. **useGame** (`client/src/lib/stores/useGame.tsx`): Game phase management (ready/playing/ended)
2. **useAudio** (`client/src/lib/stores/useAudio.tsx`): Audio state and playback control

## Data Flow

1. **Game Initialization**: GameEngine creates player, platforms, and collectibles
2. **Input Processing**: InputManager captures keyboard events and translates to game actions
3. **Physics Update**: Player movement and collision detection with platforms and collectibles
4. **Rendering**: Canvas-based pixel art rendering with 60 FPS game loop
5. **State Updates**: Zustand stores manage game phase transitions and audio playback
6. **UI Updates**: React components reflect game state changes

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Router
- **UI Framework**: Radix UI components with shadcn/ui styling
- **State Management**: Zustand with selector subscriptions
- **Styling**: Tailwind CSS with custom game-specific classes
- **Audio**: HTML5 Audio API for sound effects
- **Fonts**: Inter font family via Fontsource

### Backend Dependencies
- **Database**: Neon Database (PostgreSQL) with connection pooling
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Storage**: connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Frontend build tool with HMR and GLSL shader support
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Backend production bundling

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR on port 5000
- **Backend**: Express server with Vite middleware integration
- **Database**: Neon Database connection via DATABASE_URL environment variable

### Production Build
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles Express app to `dist/index.js`
3. **Static Assets**: Frontend build served by Express in production
4. **Database Migrations**: Drizzle Kit handles schema updates

### Deployment Configuration
- **Platform**: Replit with autoscale deployment target
- **Port Configuration**: Internal port 5000, external port 80
- **Environment**: NODE_ENV=production for production builds
- **Assets**: Support for GLTF models and audio files

## Changelog

```
Changelog:
- June 15, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```