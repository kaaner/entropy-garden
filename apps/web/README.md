# Entropy Garden - Web App

Next.js web application for Entropy Garden - a strategic cellular automata PvE game.

## Setup

```bash
# Install dependencies (from root)
pnpm install

# Run development server
pnpm dev:web

# Build for production
pnpm --filter @entropy-garden/web build

# Lint
pnpm --filter @entropy-garden/web lint

# Format
pnpm --filter @entropy-garden/web format
```

## Development

The web app runs on [http://localhost:3000](http://localhost:3000)

## Project Structure

```
apps/web/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # UI components
│   ├── lib/              # Game logic adapters
│   │   └── game/        # Engine/AI facades
│   ├── store/           # Zustand state management
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── package.json
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Game Engine:** @entropy-garden/engine
- **AI:** @entropy-garden/ai

## Development Status

- ✅ Sprint 0: Foundation & Scaffolding
- ⏳ Sprint 1: Playable PvE Core Loop
- ⏳ Sprint 2: Preview, Timer & Integration Tests
- ⏳ Sprint 3: Replay & Debug Tools
