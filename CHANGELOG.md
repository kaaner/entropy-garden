# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned for 0.3.0 (Sprint 2)

- Action Preview System
- 25-second Turn Timer
- Preview Overlay with Diff Visualization
- Advanced Integration Tests
- Deterministic State Validation

## [0.2.0] - 2025-12-14

### Added

#### 🎮 Landing Page & Onboarding

- Immersive landing page with hero section and features showcase
- Interactive tour guide system with step-by-step walkthroughs
- Enhanced visual effects (particle system, glow effects)
- Responsive design for mobile and desktop
- "Start Playing" and "Take a Tour" CTAs

#### 🧪 Integration Testing

- Complete integration test suite for game loop
- AI vs AI deterministic replay validation
- Replay export/import roundtrip tests
- Game state consistency verification
- 4 comprehensive integration tests passing

#### 🎨 Visual Enhancements

- Particle effect system for immersive atmosphere
- Glow effects and smooth animations
- Enhanced UI components styling
- Improved accessibility and UX

#### 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly controls
- Adaptive layouts

### Changed

- README.md updated to reflect v0.2.0 features
- Development status roadmap updated
- Sprint tracking updated in TASKS.md

### Sprint 1 Completion

- Issue #5: Landing Page Implementation ✅
- Issue #6: Interactive Tour Guide ✅
- Issue #7: Integration Tests ✅
- Issue #8: Visual Enhancements ✅

## [0.1.0] - 2025-12-14

### Added

#### 📚 Documentation

- Main README.md with comprehensive project overview
- CONTRIBUTING.md with development guidelines and workflow
- DOCKER.md - Complete Docker deployment guide (392 lines)
- N8N.md - GitHub automation guide with 4 workflow templates (605 lines)
- TASKS.md - Sprint roadmap (Sprint 0-3)
- VERSIONING.md - Git Flow and semantic versioning strategy
- LICENSE - MIT License
- This CHANGELOG.md

#### 🐳 Docker Infrastructure

- Multi-stage production Dockerfile for optimized builds
- Development Dockerfile with hot reload support
- docker-compose.yml (development environment + n8n)
- docker-compose.prod.yml (production with health checks)
- Helper scripts for both platforms:
  - docker.sh (Linux/macOS)
  - docker.bat (Windows)
- .dockerignore for build optimization
- .env.example with configuration template

#### 🔧 Development Tools

- .editorconfig for consistent coding styles across editors
- ESLint configuration for Next.js
- Prettier configuration with ignore files
- GitHub Actions workflows:
  - CI workflow (lint, test, build)
  - TypeScript type checking workflow
- GitHub issue templates:
  - Bug report template
  - Feature request template
- Pull request template
- CODEOWNERS file (@kaaner)

#### 🌐 Web Application Foundation

- Next.js 14 App Router setup
- TypeScript strict mode configuration
- Tailwind CSS integration with custom theme
- PostCSS and Autoprefixer setup
- Workspace dependencies configured:
  - @entropy-garden/engine
  - @entropy-garden/ai
- Project structure:
  - `src/app/` - Next.js pages (layout, home)
  - `src/components/` - React components (placeholder)
  - `src/lib/game/` - Game logic adapters (placeholder)
  - `src/store/` - State management (placeholder)
  - `src/types/` - TypeScript definitions (placeholder)
  - `public/` - Static assets (placeholder)
- Basic landing page with project information
- Standalone output configuration for Docker deployment

#### 🔄 Automation

- n8n integration in Docker Compose
- Workflow templates for:
  - GitHub Issue → Discord notification
  - PR Merged → Deployment notification
  - Issue Closed → Sprint progress tracking
  - Daily sprint summary reports
- Automation setup documentation

#### 📦 Package Configuration

- Root package.json with workspace scripts
- apps/web/package.json with all dependencies
- Proper .gitignore files at root and web app level
- pnpm workspace setup maintained

#### 🎯 Project Management

- 18 GitHub issues created (Sprint 0-3)
- Sprint labels configured
- Task breakdown in TASKS.md
- Git Flow branching strategy
- Develop branch created

### Changed

- Updated .gitignore with comprehensive exclusions
- Enhanced .github/copilot-instructions.md with infrastructure info

### Infrastructure

- Node.js 20+ required
- pnpm 8+ required
- Docker 20.10+ support
- Docker Compose 2.0+ support

### Sprint 0 Completion

- Issue #1: Next.js Project Setup ✅
- Issue #2: Monorepo Configuration ✅
- Issue #3: Code Quality Tools ✅
- Issue #4: Directory Structure ✅

### Statistics

- 42 files created
- 2,695 lines of code/documentation added
- 5 major documentation files (2,400+ lines)
- 4 workflow templates ready
- Complete CI/CD pipeline

---

## Version History

### 0.x.x - Initial Development

- **0.1.0** - Sprint 0: Infrastructure & Foundation ✅
- **0.2.0** - Sprint 1: Landing Page, Tour & Integration Tests ✅
- **0.3.0** - Sprint 2: Preview, Timer & Advanced Features (Planned)
- **0.4.0** - Sprint 3: Replay & Debug Tools (Planned)

### 1.0.0 - Production Release (Future)

- All features complete
- Full testing coverage
- Production-ready
- Public launch

---

## Links

- [GitHub Repository](https://github.com/kaaner/entropy-garden)
- [Issues](https://github.com/kaaner/entropy-garden/issues)
- [Pull Requests](https://github.com/kaaner/entropy-garden/pulls)
- [Releases](https://github.com/kaaner/entropy-garden/releases)

---

**Legend:**

- 🎉 Major milestone
- ✨ New feature
- 🐛 Bug fix
- 📝 Documentation
- 🔧 Configuration
- 🚀 Performance
- 🔒 Security
