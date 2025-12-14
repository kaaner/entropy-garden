import type { Action, GameState } from './types';
import { applyAction } from './actions';

export function replay(initialState: GameState, actions: Action[]): GameState {
  let state = initialState;
  
  for (const action of actions) {
    state = applyAction(state, action);
  }
  
  return state;
}
