import type { GameState, Action } from '@entropy-garden/engine';
import { GameEngine } from './engineFacade';

export interface PreviewResult {
  success: boolean;
  state?: GameState;
  error?: string;
}

/**
 * Generate a preview of an action without committing it
 */
export function generatePreview(state: GameState, action: Action): PreviewResult {
  const result = GameEngine.simulateAction(state, action);
  
  if (!result.state) {
    return {
      success: false,
      error: result.error || 'Invalid action',
    };
  }

  return {
    success: true,
    state: result.state,
  };
}
