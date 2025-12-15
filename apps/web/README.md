# Entropy Garden - Web Application

A strategic PvE (Player vs AI) evolution game built with Next.js 14 and TypeScript.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

From the repository root:

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev:web
```

The app will be available at http://localhost:3000

## 🎮 How to Play

1. **Start a New Game** - Click the "New Game" button
2. **Select an Action** - Choose from Seed, Environment Manipulation, or Mutate
3. **Preview** - Selected actions show a preview with highlighted changes
4. **Commit** - Click "Commit" to apply the action or "Clear" to cancel
5. **Turn Timer** - You have 25 seconds per turn; timer auto-commits EndTurn at 0
6. **AI Response** - The AI automatically plays after your turn

### Actions

- **🌱 Seed Species** - Plant ROOT, SPREAD, or MUTATION organisms (2 IP)
- **🌍 Manipulate Environment** - Adjust Nutrient (N) or Moisture (M) levels (1 IP)
- **🧬 Mutate** - Evolve adjacent organisms in a direction (3 IP)
- **⏭️ End Turn** - Pass your turn to gain Initiative Points

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev          # Start Next.js dev server
pnpm build        # Build for production
pnpm start        # Start production server

# Quality
pnpm lint         # Run ESLint
pnpm format       # Run Prettier

# Testing
pnpm test         # Run integration tests
pnpm test:watch   # Run tests in watch mode
pnpm test:coverage # Generate coverage report
```

## 🎯 Features

### Implemented (Sprint 0-2)

- ✅ Next.js 14 App Router with TypeScript
- ✅ Monorepo integration with engine and AI packages
- ✅ Playable PvE gameplay (Player vs AI)
- ✅ Action preview with diff visualization
- ✅ 25-second turn timer with auto-EndTurn
- ✅ Real-time board updates with change highlighting
- ✅ IP tracking and display
- ✅ Event log panel
- ✅ State viewer (JSON debug)
- ✅ Replay export/import
- ✅ Integration tests

### In Progress (Sprint 3)

- 🚧 Replay viewer with step controls

## 🏗️ Architecture

### State Management

- **Zustand Store** - Central game state management
- **Facades Pattern** - Clean API wrappers for engine/AI
- **No business logic in components** - All game logic in `lib/game/`

### Key Design Decisions

- Deterministic gameplay via engine
- Preview without side effects (simulate)
- Timer resets via `timerKey` pattern
- Diff visualization for action feedback

## 🧪 Testing

Integration tests verify:
- Game initialization and flow
- Player action execution
- AI response
- Replay export/import roundtrip
- Deterministic replay

Run: `pnpm test`

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand
- **Testing:** Vitest
- **Engine:** @entropy-garden/engine
- **AI:** @entropy-garden/ai

## Development Status

- ✅ Sprint 0: Foundation & Scaffolding
- ✅ Sprint 1: Playable PvE Core Loop
- ✅ Sprint 2: Preview, Timer & Integration Tests
- 🚧 Sprint 3: Replay & Debug Tools (partial)
- 📋 Sprint 4: Localization & Documentation (planned)
