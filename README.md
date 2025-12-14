# Entropy Garden

A strategic cellular automata PvE game built with TypeScript and Next.js.

## Overview

Entropy Garden is a turn-based strategy game where players compete against AI opponents by seeding, mutating, and managing cellular organisms on a grid. The game combines elements of cellular automata, resource management, and strategic decision-making.

## Project Structure

This is a **pnpm workspace monorepo** containing:

```
entropy-garden/
├── packages/
│   ├── engine/          # Core game engine (rules, state, simulation)
│   └── ai/              # AI algorithms (greedy, minimax)
├── apps/
│   ├── web/             # Next.js web application
│   └── mobile/          # Mobile app (future)
└── TASKS.md             # Development roadmap
```

## Tech Stack

- **Language:** TypeScript
- **Package Manager:** pnpm (workspace)
- **Game Engine:** Custom cellular automata engine
- **AI:** Minimax with alpha-beta pruning
- **Web App:** Next.js 14 (App Router), React 18, Tailwind CSS, Zustand
- **Testing:** Vitest
- **Linting:** ESLint, Prettier

## Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Clone repository
git clone https://github.com/kaaner/entropy-garden.git
cd entropy-garden

# Install dependencies
pnpm install
```

### Development

**Local Development:**
```bash
# Run web app in development mode
pnpm dev:web

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint all packages
pnpm lint
```

**Docker Development:**
```bash
# Start with Docker Compose (includes n8n)
docker-compose up

# Or use helper scripts
./docker.sh dev:up        # Linux/macOS
docker.bat dev:up         # Windows
```

See [DOCKER.md](./DOCKER.md) for complete Docker documentation.

## Packages

### @entropy-garden/engine

Core game engine implementing:
- Game state management
- Action validation and execution
- Tick simulation (cellular automata)
- Legal move generation
- Endgame detection (checkmate/stalemate)
- Replay system

### @entropy-garden/ai

AI opponent implementations:
- Greedy algorithm (fast, tactical)
- Minimax with alpha-beta pruning (strategic)
- Difficulty levels (Easy, Medium)

### @entropy-garden/web

Next.js web application featuring:
- Playable PvE matches
- Action preview system
- 25-second turn timer
- Replay export/import
- Debug tools (state viewer, logs)

## Development Status

- ✅ **Packages (engine, ai)** - Complete and tested
- 🚧 **Web App** - In development
  - ✅ Sprint 0: Foundation & Scaffolding
  - ⏳ Sprint 1: Playable PvE Core Loop
  - ⏳ Sprint 2: Preview, Timer & Integration Tests
  - ⏳ Sprint 3: Replay & Debug Tools
- 📅 **Mobile App** - Planned

See [TASKS.md](./TASKS.md) for detailed roadmap.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Repository

- **GitHub:** [kaaner/entropy-garden](https://github.com/kaaner/entropy-garden)
- **Issues:** [Issue Tracker](https://github.com/kaaner/entropy-garden/issues)

## Docker

Run the entire stack with Docker:

```bash
# Development (hot reload + n8n)
docker-compose up

# Production
docker-compose -f docker-compose.prod.yml up -d
```

See [DOCKER.md](./DOCKER.md) for full Docker guide.

## Automation

Automate your GitHub workflow with n8n:

```bash
# n8n is included in Docker Compose
docker-compose up

# Access n8n at http://localhost:5678
# Default: admin / changeme (change in .env)
```

See [N8N.md](./N8N.md) for complete automation guide with workflow templates.

## Links

- [Web App README](./apps/web/README.md)
- [Docker Guide](./DOCKER.md)
- [n8n Automation Guide](./N8N.md)
- [Task Roadmap](./TASKS.md)
- [Engine Documentation](./packages/engine/README.md)
- [AI Documentation](./packages/ai/README.md)
