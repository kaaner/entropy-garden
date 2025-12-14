import { generateMove } from '@entropy-garden/ai';
import type { GameState, Action } from '@entropy-garden/engine';
import type { Difficulty } from '@entropy-garden/ai';

/**
 * AI facade providing clean API for AI operations
 */
export class GameAI {
  /**
   * Choose an action for the AI based on difficulty
   */
  static chooseAction(state: GameState, difficulty: Difficulty): Action {
    return generateMove(state, { difficulty });
  }

  /**
   * Choose an action with easy difficulty
   */
  static chooseActionEasy(state: GameState): Action {
    return this.chooseAction(state, 'easy');
  }

  /**
   * Choose an action with medium difficulty
   */
  static chooseActionMedium(state: GameState): Action {
    return this.chooseAction(state, 'medium');
  }
}
