# Contributing to Entropy Garden

Thank you for your interest in contributing to Entropy Garden! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming environment

## Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/kaaner/entropy-garden.git
   cd entropy-garden
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/replay-viewer`)
- `bugfix/` - Bug fixes (e.g., `bugfix/timer-reset`)
- `refactor/` - Code refactoring (e.g., `refactor/game-store`)
- `docs/` - Documentation updates (e.g., `docs/api-reference`)
- `test/` - Test additions/updates (e.g., `test/ai-algorithms`)

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(web): implement action preview system
fix(engine): correct en passant validation logic
docs(ai): add minimax algorithm explanation
test(engine): add replay roundtrip tests
```

### Code Quality

Before submitting a PR:

1. **Lint your code**
   ```bash
   pnpm lint
   ```

2. **Format your code**
   ```bash
   pnpm format
   ```

3. **Run tests**
   ```bash
   pnpm test
   ```

4. **Build packages**
   ```bash
   pnpm build
   ```

### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Link related issue(s)** in PR description
5. **Request review** from maintainers
6. **Address review feedback**

### PR Template

```markdown
## Description
Brief description of changes

## Related Issue
Fixes #(issue number)

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Code follows project style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] All tests pass
- [ ] No linting errors
```

## Project Structure

### Monorepo Organization

```
entropy-garden/
├── packages/          # Shared libraries
│   ├── engine/       # Game engine (DO NOT MODIFY - complete)
│   └── ai/           # AI algorithms (DO NOT MODIFY - complete)
└── apps/             # Applications
    ├── web/          # Next.js web app (ACTIVE DEVELOPMENT)
    └── mobile/       # Future mobile app
```

**⚠️ Important:** `packages/engine` and `packages/ai` are **complete and tested**. Do not modify them. Only consume their public exports in `apps/web`.

### Working on Web App

Focus areas for contribution:

1. **UI Components** (`apps/web/src/components/`)
   - Keep components small and focused
   - Use TypeScript strictly
   - Follow React best practices

2. **Game Logic Adapters** (`apps/web/src/lib/game/`)
   - Create facades for engine/ai packages
   - Keep business logic separate from UI
   - Add comprehensive tests

3. **State Management** (`apps/web/src/store/`)
   - Use Zustand for global state
   - Keep domain state separate from UI state
   - Document state shape and actions

4. **Testing** (`apps/web/src/**/*.test.ts`)
   - Write integration tests (not UI tests)
   - Test game loop, replay, determinism
   - Aim for meaningful coverage

## Development Sprints

See [TASKS.md](./TASKS.md) for current sprint and task breakdown.

Current active issues are labeled by sprint:
- `sprint-0` - Foundation & Scaffolding
- `sprint-1` - Playable PvE Core Loop
- `sprint-2` - Preview, Timer & Integration Tests
- `sprint-3` - Replay & Debug Tools

## Testing Guidelines

### Unit Tests
```bash
# Run tests for specific package
pnpm --filter @entropy-garden/web test

# Watch mode
pnpm --filter @entropy-garden/web test --watch
```

### Integration Tests
Focus on:
- Game loop (player action → AI response)
- Replay export/import roundtrip
- Deterministic behavior

## Style Guide

### TypeScript
- Enable strict mode
- Avoid `any` (use `unknown` if needed)
- Prefer interfaces over types for objects
- Use meaningful variable names

### React
- Use functional components
- Prefer hooks over class components
- Keep components pure when possible
- Use proper TypeScript typing for props

### CSS/Tailwind
- Use Tailwind utility classes
- Keep custom CSS minimal
- Use consistent spacing (Tailwind scale)
- Ensure responsive design

## Questions?

- **GitHub Issues:** [Report bugs or request features](https://github.com/kaaner/entropy-garden/issues)
- **Discussions:** [Ask questions or discuss ideas](https://github.com/kaaner/entropy-garden/discussions)

## Recognition

Contributors will be acknowledged in release notes and project documentation.

Thank you for contributing to Entropy Garden! 🌱
