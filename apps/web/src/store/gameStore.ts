import { create } from 'zustand';
import { GameEngine } from '../lib/game/engineFacade';
import { GameAI } from '../lib/game/aiFacade';
import type { GameState, Action, PlayerId, GameEnd } from '@entropy-garden/engine';
import type { Difficulty } from '@entropy-garden/ai';

interface GameStore {
  // State
  gameState: GameState | null;
  previewState: GameState | null;
  actionDraft: Action | null;
  history: GameState[];
  logs: string[];
  status: 'playing' | 'ended';
  winner: PlayerId | null;
  aiDifficulty: Difficulty;

  // Actions
  newGame: () => void;
  selectAction: (action: Action) => void;
  commitAction: () => void;
  aiTurn: () => void;
  updatePreview: (state: GameState) => void;
  clearPreview: () => void;
  addLog: (log: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  gameState: null,
  previewState: null,
  actionDraft: null,
  history: [],
  logs: [],
  status: 'ended',
  winner: null,
  aiDifficulty: 'easy',

  newGame: () => {
    const initialState = GameEngine.createInitialState();
    set({
      gameState: initialState,
      previewState: null,
      actionDraft: null,
      history: [GameEngine.cloneState(initialState)],
      logs: ['Game started'],
      status: 'playing',
      winner: null,
    });
  },

  selectAction: (action: Action) => {
    const { gameState } = get();
    if (!gameState) return;

    const result = simulate(gameState, action);
    if (result.state) {
      set({
        actionDraft: action,
        previewState: result.state,
      });
    }
  },

  commitAction: () => {
    const { gameState, previewState, actionDraft, history, aiDifficulty } = get();
    if (!gameState || !previewState || !actionDraft) return;

    // Apply the action
    let newState = cloneState(previewState);

    // Run tick for end turn
    newState = runTick(newState);

    // Switch player
    newState.currentPlayer = (1 - newState.currentPlayer) as PlayerId;
    newState.turnNumber += 1;
    newState.lastAction = actionDraft;

    // Check end
    const endCheck: GameEnd = checkEnd(newState);

    // Update store
    const newHistory = [...history, cloneState(newState)];
    const newLogs = [...get().logs, `Player ${gameState.currentPlayer} played ${actionDraft.type}`];

    set({
      gameState: newState,
      previewState: null,
      actionDraft: null,
      history: newHistory,
      logs: newLogs,
      status: endCheck.ended ? 'ended' : 'playing',
      winner: endCheck.winner || null,
    });

    // If game not ended and next player is AI (1), trigger AI turn
    if (!endCheck.ended && newState.currentPlayer === 1) {
      setTimeout(() => get().aiTurn(), 500); // Small delay for UX
    }
  },

  aiTurn: () => {
    const { gameState, history, aiDifficulty } = get();
    if (!gameState || gameState.currentPlayer !== 1) return;

    const action = generateMove(gameState, { difficulty: aiDifficulty });
    const result = simulate(gameState, action);

    if (result.state) {
      let newState = cloneState(result.state);
      newState = runTick(newState);
      newState.currentPlayer = (1 - newState.currentPlayer) as PlayerId;
      newState.turnNumber += 1;
      newState.lastAction = action;

      const endCheck = checkEnd(newState);
      const newHistory = [...history, cloneState(newState)];
      const newLogs = [...get().logs, `AI played ${action.type}`];

      set({
        gameState: newState,
        history: newHistory,
        logs: newLogs,
        status: endCheck.ended ? 'ended' : 'playing',
        winner: endCheck.winner || null,
      });

      // If not ended and back to human, continue
    }
  },

  updatePreview: (state: GameState) => {
    set({ previewState: state });
  },

  clearPreview: () => {
    set({ previewState: null, actionDraft: null });
  },

  addLog: (log: string) => {
    set({ logs: [...get().logs, log] });
  },
}));
