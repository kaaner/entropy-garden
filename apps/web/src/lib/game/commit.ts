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

    // Apply action (engine already handles tick, player switch for EndTurn, and lastAction)
    const newState = GameEngine.applyAction(currentState, action);

    // Check endgame
    const endCheck = GameEngine.checkGameEnd(newState);

    // Update history and logs
    const newHistory = [...history, GameEngine.cloneState(newState)];
    const actionDesc = action.type === 'SeedSpecies' 
      ? `${action.type}(${action.species} at ${action.x},${action.y})`
      : action.type === 'ManipulateEnv'
      ? `${action.type}(${action.target}${action.delta > 0 ? '+' : ''}${action.delta} at ${action.x},${action.y})`
      : action.type === 'Mutate'
      ? `${action.type}(${action.dir} at ${action.x},${action.y})`
      : action.type;
    const newLogs = [
      ...logs,
      `Player ${currentState.currentPlayer + 1} → ${actionDesc}`,
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
