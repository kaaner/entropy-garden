import { create } from 'zustand';
import { GameEngine } from '../lib/game/engineFacade';
import { GameAI } from '../lib/game/aiFacade';
import { CommitPipeline } from '../lib/game/commit';
import type { GameState, Action, PlayerId } from '@entropy-garden/engine';
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
  timerKey: number; // Used to reset timer

  // Actions
  newGame: () => void;
  selectAction: (action: Action) => void;
  commitAction: () => void;
  aiTurn: () => void;
  updatePreview: (state: GameState) => void;
  clearPreview: () => void;
  addLog: (log: string) => void;
  resetTimer: () => void;
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
  timerKey: 0,

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
      timerKey: Date.now(),
    });
  },

  selectAction: (action: Action) => {
    const { gameState } = get();
    if (!gameState) return;

    const result = GameEngine.simulateAction(gameState, action);
    if (result.state) {
      set({
        actionDraft: action,
        previewState: result.state,
      });
    }
  },

  commitAction: () => {
    const { gameState, actionDraft, history, logs } = get();
    if (!gameState || !actionDraft) {
      get().addLog('Error: No action to commit');
      return;
    }

    // Use CommitPipeline
    const result = CommitPipeline.commitAction(gameState, actionDraft, history, logs);

    if (!result.success) {
      get().addLog(`Error: ${result.error}`);
      return;
    }

    // Update store with result
    set({
      gameState: result.newState!,
      previewState: null,
      actionDraft: null,
      history: result.history!,
      logs: result.logs!,
      status: result.ended ? 'ended' : 'playing',
      winner: result.winner || null,
      timerKey: Date.now(), // Reset timer on commit
    });

    // If game not ended and next player is AI (1), trigger AI turn
    if (!result.ended && result.newState!.currentPlayer === 1) {
      setTimeout(() => get().aiTurn(), 500); // Small delay for UX
    }
  },

  aiTurn: () => {
    const { gameState, history, logs, aiDifficulty } = get();
    if (!gameState || gameState.currentPlayer !== 1) return;

    // Generate AI move
    const action = GameAI.chooseAction(gameState, aiDifficulty);
    
    if (!action) {
      get().addLog('Error: AI failed to generate move');
      return;
    }

    // Use CommitPipeline for AI action too
    const result = CommitPipeline.commitAction(gameState, action, history, logs);

    if (!result.success) {
      get().addLog(`AI Error: ${result.error}`);
      return;
    }

    // Update store
    set({
      gameState: result.newState!,
      history: result.history!,
      logs: result.logs!,
      status: result.ended ? 'ended' : 'playing',
      winner: result.winner || null,
      timerKey: Date.now(), // Reset timer after AI turn
    });
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

  resetTimer: () => {
    set({ timerKey: Date.now() });
  },
}));
