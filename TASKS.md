# Entropy Garden - Development Tasks

**Project Status:** Infrastructure Complete, Starting Sprint 0  
**Last Updated:** 2025-12-14

## 📚 Documentation

- [Main README](./README.md) - Project overview
- [Docker Guide](./DOCKER.md) - Container deployment
- [n8n Automation](./N8N.md) - GitHub workflow automation
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines

---

## 🔴 SPRINT 0: Foundation & Scaffolding

**Goal:** Set up Next.js App Router infrastructure with monorepo integration

### Tasks

#### S0.1: Next.js Project Setup
- [ ] Initialize Next.js 14+ with App Router in `apps/web`
- [ ] Configure TypeScript strict mode
- [ ] Set up src/app directory structure
- [ ] Add package.json with dependencies:
  - next@^14.0.0
  - react@^18.0.0
  - react-dom@^18.0.0
  - zustand@^4.4.0
  - tailwindcss@^3.3.0
- [ ] Create basic page.tsx and layout.tsx

**Acceptance:** `pnpm dev:web` starts Next.js dev server

---

#### S0.2: Monorepo Configuration
- [ ] Configure tsconfig.json for workspace references
- [ ] Add workspace dependencies in package.json:
  - @entropy-garden/engine
  - @entropy-garden/ai
- [ ] Configure next.config.js with transpilePackages
- [ ] Verify imports work from engine and ai packages

**Acceptance:** Can import and use types from packages/engine and packages/ai

---

#### S0.3: Code Quality Tools
- [ ] Add ESLint config (.eslintrc.json)
- [ ] Add Prettier config (.prettierrc)
- [ ] Add lint and format scripts to package.json
- [ ] Create .eslintignore and .prettierignore
- [ ] Run initial lint/format pass

**Acceptance:** `pnpm lint` and `pnpm format` work without errors

---

#### S0.4: Directory Structure
- [ ] Create `src/app/` (routes)
- [ ] Create `src/components/` (UI components)
- [ ] Create `src/lib/game/` (game logic adapters)
- [ ] Create `src/store/` (Zustand stores)
- [ ] Create `src/types/` (UI-specific types)
- [ ] Add README.md in apps/web with setup instructions

**Acceptance:** All directories exist with placeholder index files

---

## 🟡 SPRINT 1: Playable PvE Core Loop

**Goal:** Implement basic player vs AI gameplay

### Tasks

#### S1.1: Game Store Implementation
- [ ] Create `store/gameStore.ts` with Zustand
- [ ] State: gameState, previewState, actionDraft, history, logs
- [ ] State: status (playing/ended), winner, aiDifficulty
- [ ] Actions: newGame, selectAction, commitAction, aiTurn
- [ ] Actions: updatePreview, clearPreview, addLog

**Acceptance:** Store compiles and provides typed hooks

---

#### S1.2: Engine & AI Facades
- [ ] Create `lib/game/engineFacade.ts`
  - Wrap createInitialState, applyAction, simulate, getLegalActions, checkEnd, replay
- [ ] Create `lib/game/aiFacade.ts`
  - Wrap AI algorithm with difficulty levels (Easy/Medium)
  - Provide chooseAction(state, difficulty) interface
- [ ] Create `lib/game/actionAdapter.ts`
  - Convert UI draft to engine Action type

**Acceptance:** Facades provide clean API for UI consumption

---

#### S1.3: Commit Pipeline
- [ ] Create `lib/game/commit.ts`
  - Validate action legality
  - Apply action via engineFacade
  - Update history and logs
  - Check endgame condition
  - Return success/error result
- [ ] Integrate with gameStore commitAction

**Acceptance:** Committing an action updates state correctly

---

#### S1.4: AI Turn Orchestration
- [ ] Implement AI turn trigger after player commit
- [ ] AI chooseAction with 1s timeout
- [ ] Auto-commit AI action
- [ ] Handle AI errors gracefully
- [ ] Prevent AI turn during game end

**Acceptance:** AI responds automatically after player move

---

#### S1.5: Minimal UI Components
- [ ] `components/GameScreen.tsx` (main container)
- [ ] `components/BoardGrid.tsx` (7x7 grid renderer)
- [ ] `components/Cell.tsx` (individual cell with occupant)
- [ ] `components/HUD.tsx` (IP, active player, status)
- [ ] `components/ActionPalette.tsx` (Seed/Env/Mutate/EndTurn buttons)
- [ ] New Game button functionality

**Acceptance:** Can start game, render board, select and commit actions

---

## 🟢 SPRINT 2: Preview, Timer & Integration Tests

**Goal:** Add action preview, turn timer, and automated tests

### Tasks

#### S2.1: Action Preview System
- [ ] Create `lib/game/preview.ts`
  - Call engineFacade.simulate on action draft
  - Debounce preview generation (100-150ms)
  - Handle invalid actions gracefully
- [ ] Store previewState in gameStore
- [ ] Trigger preview on cell hover/selection

**Acceptance:** Preview generates without committing action

---

#### S2.2: Diff Overlay Visualization
- [ ] Create `lib/game/diff.ts`
  - Identify changed cells between gameState and previewState
  - Calculate IP delta
  - Detect new/removed/modified occupants
- [ ] Create `components/PreviewOverlay.tsx`
  - Highlight changed cells
  - Show IP delta in HUD
  - Visual indicators for spread/growth

**Acceptance:** Preview shows clear diff visualization

---

#### S2.3: Turn Timer Implementation
- [ ] Create `lib/game/useTurnTimer.ts` hook
  - 25s countdown
  - Reset on turn change
  - Auto EndTurn at 0
  - Does NOT pause during preview
- [ ] Display timer in HUD
- [ ] Visual warning when <5s remaining

**Acceptance:** Timer auto-commits EndTurn when expired

---

#### S2.4: Integration Tests
- [ ] Set up Vitest in apps/web
- [ ] Test: New game → player action → AI responds
- [ ] Test: Replay export/import roundtrip
- [ ] Test: Deterministic replay (same actions = same state)
- [ ] Add test script to package.json

**Acceptance:** `pnpm test` passes all integration tests

---

## 🔵 SPRINT 3: Replay & Debug Tools

**Goal:** Add replay functionality and developer tools

### Tasks

#### S3.1: Replay Data Model
- [ ] Create `lib/game/replayModel.ts`
  - Schema: initialState, actions[], metadata (seed, difficulty, timestamp)
  - Serialize/deserialize functions
  - Runtime validation (optional: zod)

**Acceptance:** Can create valid replay JSON

---

#### S3.2: Replay Export/Import
- [ ] Export: Download replay JSON file
- [ ] Import: Upload and validate JSON
- [ ] Add to game UI or separate /replays route
- [ ] Handle import errors gracefully

**Acceptance:** Can export game and reimport successfully

---

#### S3.3: Replay Viewer
- [ ] Use engineFacade.replay or progressive state computation
- [ ] Prev/Next step controls
- [ ] Display current step number
- [ ] Show state at each step
- [ ] Jump to specific step (optional)

**Acceptance:** Can step through replay forward/backward

---

#### S3.4: Debug Panels
- [ ] Create `components/StateViewer.tsx`
  - Show gameState JSON
  - Show previewState JSON
  - Copy to clipboard button
- [ ] Create `components/LogPanel.tsx`
  - Display action history
  - Show errors and warnings
  - Endgame reason display
- [ ] Toggle visibility (collapsible or /debug route)

**Acceptance:** Debug tools provide state visibility

---

#### S3.5: Documentation & Polish
- [ ] Write apps/web/README.md
  - Installation steps
  - Development commands
  - Build instructions
  - Testing guide
- [ ] Add inline code comments where needed
- [ ] Final lint/typecheck/build pass
- [ ] Update root package.json scripts if needed

**Acceptance:** New developer can run app following README

---

## 📋 Definition of Done (Overall)

- [ ] All Sprint 0-3 tasks completed
- [ ] `pnpm dev:web` runs playable PvE game
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes
- [ ] Replay export/import works
- [ ] Timer auto-commits EndTurn
- [ ] Preview shows action effects
- [ ] Debug tools accessible
- [ ] README documentation complete

---

## 🟣 SPRINT 4: Localization & Documentation

**Goal:** Add i18n support and comprehensive user documentation

### Tasks

#### S4.1: Localization Infrastructure
- [ ] Add next-intl or react-i18next to apps/web
- [ ] Create `src/locales/` directory structure
- [ ] Add language files: en.json, tr.json (English, Turkish)
- [ ] Configure locale detection and switching
- [ ] Wrap app with i18n provider
- [ ] Create language switcher component
- [ ] Translate all UI strings (buttons, labels, messages)
- [ ] Translate game terminology (Seed, Spread, Mutate, etc.)
- [ ] Add locale persistence (localStorage/cookie)

**Acceptance:** User can switch between English and Turkish languages

---

#### S4.2: User Guide & Tutorial
- [ ] Create `components/UserGuide.tsx` or `/guide` route
- [ ] Document game objectives and win conditions
- [ ] Explain resource system (IP/Initiative Points)
- [ ] Tutorial for each action type:
  - Seed: How to create new organisms
  - Spread: Environmental expansion mechanics
  - Mutate: Evolution and direction system
  - EndTurn: Turn management
- [ ] Show example turn sequences
- [ ] Add visual diagrams/screenshots
- [ ] Make guide accessible from main menu

**Acceptance:** New player can understand basic gameplay from guide

---

#### S4.3: Game Rules Documentation
- [ ] Create `components/RulesReference.tsx` or `/rules` route
- [ ] Document legal action requirements:
  - What makes an action valid/invalid
  - IP costs for each action
  - Cell occupancy rules
  - Spread limitations
  - Mutation constraints
- [ ] Explain turn phases and timing
- [ ] Document timer behavior (25s, auto-EndTurn)
- [ ] Win/loss conditions with examples
- [ ] Add quick reference table/cheatsheet

**Acceptance:** Players can look up specific rules easily

---

#### S4.4: FAQ & Tooltips
- [ ] Create `components/FAQ.tsx` or `/faq` route
- [ ] Common questions:
  - Why can't I perform this action? (illegal action explanations)
  - What happens when timer runs out?
  - How does AI difficulty work?
  - How to read the board state?
  - What do preview overlays mean?
  - How to use replay system?
  - How to report bugs?
- [ ] Add contextual tooltips in UI:
  - Hover over action buttons → explain action
  - Hover over cells → show occupant details
  - Hover over IP → explain resource system
  - Hover over timer → explain turn timeout
- [ ] Link to GitHub issues for bug reports
- [ ] Add keyboard shortcuts reference

**Acceptance:** Common player questions are answered in-app

---

#### S4.5: Error Messages & Feedback
- [ ] Improve action validation error messages
- [ ] Translate error messages to selected language
- [ ] Add helpful context for illegal actions:
  - "Not enough IP" → Show current IP and required cost
  - "Cell occupied" → Explain occupancy rules
  - "Invalid target" → Highlight valid targets
- [ ] Toast/notification system for feedback
- [ ] Success confirmations for actions
- [ ] Clear endgame announcements with reason

**Acceptance:** Players understand why actions fail

---

## Notes

- Engine and AI packages are complete - DO NOT modify
- Focus on minimal viable implementation
- Prioritize functionality over visual polish
- Keep components simple and typed
- All game logic in lib/game, not components
