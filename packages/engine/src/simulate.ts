import type { Action, GameState, SimulationResult } from './types';
import { applyAction } from './actions';

export function simulate(state: GameState, action: Action): SimulationResult {
  try {
    const nextState = applyAction(state, action);
    
    if (nextState === state) {
      return { error: 'Invalid action' };
    }
    
    return { state: nextState };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
