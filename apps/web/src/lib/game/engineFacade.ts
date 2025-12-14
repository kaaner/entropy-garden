import {
  createInitialState,
  applyAction,
  simulate,
  getLegalActions,
  checkEnd,
  replay,
  runTick,
  cloneState,
} from '@entropy-garden/engine';
import type { GameState, Action } from '@entropy-garden/engine';

/**
 * Engine facade providing clean API for game engine operations
 */
export class GameEngine {
  /**
   * Create a new initial game state
   */
  static createInitialState(): GameState {
    return createInitialState();
  }

  /**
   * Apply an action to a game state
   */
  static applyAction(state: GameState, action: Action): GameState {
    return applyAction(state, action);
  }

  /**
   * Simulate an action on a game state
   */
  static simulateAction(state: GameState, action: Action): { state?: GameState; error?: string } {
    return simulate(state, action);
  }

  /**
   * Get all legal actions for the current player
   */
  static getLegalActions(state: GameState): Action[] {
    return getLegalActions(state);
  }

  /**
   * Check if the game has ended
   */
  static checkGameEnd(state: GameState) {
    return checkEnd(state);
  }

  /**
   * Run the game tick (end turn mechanics)
   */
  static runTick(state: GameState): GameState {
    return runTick(state);
  }

  /**
   * Replay a sequence of actions from an initial state
   */
  static replayFromState(initialState: GameState, actions: Action[]): GameState {
    return replay(initialState, actions);
  }

  /**
   * Clone a game state
   */
  static cloneState(state: GameState): GameState {
    return cloneState(state);
  }
}
