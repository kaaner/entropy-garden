import { GameEngine } from './engineFacade';
import type { GameState, Action, PlayerId } from '@entropy-garden/engine';

export interface CommitResult {
  success: boolean;
  newState?: GameState;
  history?: GameState[];
  logs?: string[];
  ended?: boolean;
  winner?: PlayerId;
  error?: string;
}

/**
 * Commit pipeline for actions
 * Validates, applies, and updates state
 */
export class CommitPipeline {
  /**
   * Commit an action to the game state
   */
  static commitAction(
    currentState: GameState,
    action: Action,
    history: GameState[],
    logs: string[]
  ): CommitResult {
    // Validate action legality
    const legalActions = GameEngine.getLegalActions(currentState);
    const isLegal = legalActions.some(legal =>
      JSON.stringify(legal) === JSON.stringify(action)
    );

    if (!isLegal) {
      return {
        success: false,
        error: 'Action is not legal',
      };
    }

    // Apply action
    const result = GameEngine.simulateAction(currentState, action);
    if (!result.state) {
      return {
        success: false,
        error: result.error || 'Failed to apply action',
      };
    }

    let newState = GameEngine.cloneState(result.state);

    // Run tick for end turn
    newState = GameEngine.runTick(newState);

    // Switch player
    newState.currentPlayer = (1 - newState.currentPlayer) as PlayerId;
    newState.turnNumber += 1;
    newState.lastAction = action;

    // Check endgame
    const endCheck = GameEngine.checkGameEnd(newState);

    // Update history and logs
    const newHistory = [...history, GameEngine.cloneState(newState)];
    const newLogs = [
      ...logs,
      `Player ${currentState.currentPlayer} played ${action.type}`,
    ];

    return {
      success: true,
      newState,
      history: newHistory,
      logs: newLogs,
      ended: endCheck.ended,
      winner: endCheck.winner,
    };
  }
}
