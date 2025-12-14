You are acting as a Tech Lead + Product Owner + Senior Next.js Engineer. 
We have a pnpm workspace monorepo "ENTROPY-GARDEN". Engine and AI packages are DONE and tested; web app is empty.
Your job: implement the Web app (Next.js App Router + TypeScript) as a playable PvE demo (player vs AI) using the existing packages.
DO NOT ask questions. Make reasonable assumptions and state them in comments where needed. 
DO NOT modify packages/engine or packages/ai code. Only consume their public exports.

REPO STRUCTURE (existing):
entropy-garden/
  packages/
    engine/src (types.ts, state.ts, actions.ts, tick.ts, simulate.ts, legalActions.ts, endgame.ts, replay.ts, index.ts) ✅
    ai/src (types.ts, evaluation.ts, algorithms.ts, index.ts) ✅
  apps/
    web/ (EMPTY)  <-- You will build this
    mobile/ (EMPTY) <-- IGNORE for now (do not touch)

PRIMARY GOALS (WEB APP):
1) Next.js App Router + TypeScript web client under apps/web
2) Import packages/engine and packages/ai and provide playable PvE flow:
   - New game start
   - Player makes a move
   - AI responds automatically
   - Endgame detected and shown
   - Replay can be viewed and exported/imported (minimum)
3) Debug/dev tools:
   - State Viewer (current state + preview state JSON)
   - Log panel (actions + errors + endgame)
   - Seed setting (if engine supports; if not, implement UI input that reuses createInitialState() but store seed as metadata)
   - Step-by-step replay viewer (minimum prev/next)
   - Step-by-step tick/simulate visibility (minimum: show preview diff + allow stepping replay)
4) Quality:
   - ESLint + Prettier
   - Typecheck
   - Build works
   - Basic integration tests in web (NOT UI tests): ensure game loop + replay roundtrip works.
5) Monorepo compatibility:
   - pnpm workspace dependencies
   - tsconfig strategy + path alias
   - Next.js config for transpiling workspace packages if necessary

CONSTRAINTS:
- UI can be minimal; focus on playability + integration + debug visibility.
- Keep components small; do not over-engineer a design system.
- Prefer client-side game execution (no SSR requirement).
- Use deterministic behavior as engine/ai provides.
- Timer: implement 25s turn timer in UI with auto EndTurn when time hits 0. Timer may optionally pause during preview to improve UX (player decision making), but this must be configurable or documented.
- Action Preview: one-step preview (simulate(action) -> previewState) and show overlay differences.

ASSUMPTIONS (if any mismatch, adapt without asking):
- engine exports: createInitialState, applyAction, simulate, getLegalActions, checkEnd, replay and types (GameState, Action, etc.) from packages/engine
- ai exports: functions to choose action (greedy/minimax) or an API you can wrap; if names differ, create a local facade in apps/web that adapts to actual exports.
- GameState contains board cells with N/M and occupant info; if structure differs, adapt UI mapping.

DELIVERABLES REQUIRED:
- apps/web fully implemented with Next.js App Router + TS
- Minimal pages:
  - "/" -> Game Screen (playable)
  - "/replays" -> Replay viewer/import/export (minimal) OR keep replay UI on main screen (acceptable) but must exist
  - Optional "/debug" -> dev-only panels if you want separate route
- Components:
  - GameScreen (root client component)
  - BoardGrid + Cell
  - HUD (active player, IP, timer, status)
  - ActionPalette (Seed/Env/Mutate/EndTurn + Confirm/Cancel)
  - PreviewOverlay (diff visualization)
  - LogPanel (history + errors)
  - StateViewer (JSON)
  - ReplayExport/ReplayImport/ReplayViewer
- lib modules (do not put logic inside components):
  - lib/game/engineFacade.ts (adapts engine exports)
  - lib/game/aiFacade.ts (adapts ai exports; supports difficulty)
  - lib/game/actionAdapter.ts (UI draft -> engine Action)
  - lib/game/commit.ts (apply action + update history + endgame)
  - lib/game/preview.ts (simulate + debounce/cooldown)
  - lib/game/useTurnTimer.ts (25s countdown)
  - lib/game/replayModel.ts (schema, serialize/validate)
  - lib/game/diff.ts (state vs previewState diff helpers)
- Store:
  - store/gameStore.ts (Zustand recommended; if not, implement React reducer + context)
  - Keep domain GameState separate from UI state fields.

IMPLEMENTATION PLAN (follow this order; treat like Sprint phases, no time estimates):
SPRINT 0 (Foundation):
A) Scaffold Next.js App Router in apps/web with TypeScript.
B) Configure pnpm workspace deps to import packages/engine and packages/ai.
C) Add tsconfig for monorepo compatibility (base tsconfig or local with references).
D) Add ESLint + Prettier config and scripts at root and/or apps/web.
E) Ensure Next can transpile workspace packages if needed (next.config transpilePackages).

SPRINT 1 (Playable PvE core loop):
A) Implement game store with:
   - gameState (engine GameState)
   - previewState (GameState | null)
   - selected action mode (Seed/Env/Mutate/EndTurn)
   - actionDraft params (species, env target/delta, mutate dir, selected cell)
   - history (actions[])
   - status (playing/ended)
   - winner/reason if ended
   - logs (events/errors)
   - aiDifficulty (Easy/Medium)
   - activePlayer metadata if not included in state
B) Implement actionAdapter to build engine Action from UI selection.
C) Implement commit pipeline:
   - validate action
   - call engine.applyAction
   - update history/logs
   - call engine.checkEnd after each commit; if ended set status
D) Implement AI turn orchestration:
   - after player commit, if game not ended, trigger AI chooseAction and commit it
   - AI must run under 1s budget; if needed do setTimeout(0) to avoid blocking
E) Build minimal UI:
   - Grid renders 7x7
   - HUD shows IP, active player, status
   - Action palette allows selecting an action and committing it
   - New Game resets everything

SPRINT 2 (Preview + Timer + Integration tests):
A) Implement preview generation:
   - On hover/tap a cell with selected action draft, call engine.simulate (no side effects) and store previewState
   - Add cooldown/debounce 100-150ms to prevent spam
   - If invalid preview, show reason but do not crash
B) Implement diff overlay:
   - Identify changed cells between gameState and previewState
   - Highlight newly created occupants
   - Fade cells whose occupant becomes inactive
   - Mark spread expansions minimally (e.g., highlight target cell and show arrow indicator)
   - Show IP delta in HUD (based on action cost; if state contains IP, compute delta from store)
C) Implement 25s turn timer:
   - Start/reset on turn change
   - Does not pause during preview
   - On 0 -> auto commit EndTurn
D) Add integration tests (non-UI):
   - New game -> perform a player action -> AI responds -> assert state changed
   - Replay export/import roundtrip -> engine.replay yields same final state
   - Determinism smoke: replay same actions twice -> same final state hash (implement simple stable hash function in test)

SPRINT 3 (Replay + Debug tools):
A) Replay model:
   - Build a replay JSON containing initialState + actions[] + createdAt + winner/reason + optional metadata (seed, difficulty)
B) Export:
   - Download replay JSON file
C) Import:
   - Upload JSON and validate with runtime checks (lightweight; zod optional)
D) Replay viewer:
   - Use engine.replay incrementally or compute states by applying actions progressively
   - Provide next/prev step controls
E) Debug panels:
   - StateViewer: show gameState and previewState JSON with copy-to-clipboard
   - LogPanel: show history and errors
   - Optional StepControls for stepping through history while playing (dev-only)

NON-FUNCTIONAL REQUIREMENTS:
- Keep all game logic in lib/game + store, not scattered in UI components.
- Components must be simple and mostly presentational; hook into store actions.
- Avoid over-design; minimal CSS/Tailwind is fine.
- Provide accessible controls (buttons with labels, keyboard focus where possible).
- Provide clear empty states (e.g., "Select an action", "Game ended", etc.)
- Ensure build passes.

TECH CHOICES (recommended, but not mandatory):
- State: Zustand
- Styling: Tailwind (minimal) OR simple CSS modules
- No heavy UI kit required; if you add shadcn, keep it minimal (Button/Panel only)

OUTPUT REQUIREMENTS:
1) Create all necessary files under apps/web.
2) Update root/workspace scripts as needed (without breaking packages).
3) Provide a short README in apps/web explaining how to run:
   - pnpm -w install
   - pnpm -w dev:web (or similar)
   - pnpm -w test
   - pnpm -w build
4) Ensure everything compiles and lint/typecheck/test passes.

NOW IMPLEMENT:
- Start by creating apps/web with Next.js App Router structure in apps/web/src/app
- Then implement the store, lib/game modules, and components as described.
- Make sure to add the integration tests.
- Do not leave TODO placeholders. If an engine/ai export name differs, adapt via engineFacade/aiFacade.
- Keep code clean, typed, and deterministic.

Acceptance Criteria (must satisfy):
- Running apps/web locally shows a playable PvE match: New Game -> player move -> AI move -> repeat until end -> end shown.
- Action preview works (simulate) and does not commit until confirm.
- Timer auto EndTurn works and does not pause during preview.
- Replay export/import works; replay viewer steps through.
- Debug panels show state and logs.
- Lint/typecheck/build/test scripts succeed in workspace.
