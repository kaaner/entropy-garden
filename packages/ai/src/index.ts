import type { GameState, Action, PlayerId } from '@entropy-garden/engine';
import { greedy, minimax } from './algorithms';
import { DEFAULT_WEIGHTS } from './evaluation';
import type { AIConfig, Difficulty, EvaluationWeights } from './types';

export function generateMove(state: GameState, config: AIConfig): Action {
  const player = state.currentPlayer;
  const weights: EvaluationWeights = { ...DEFAULT_WEIGHTS, ...config.weights };
  
  if (config.difficulty === 'easy') {
    return greedy(state, player, weights);
  } else {
    const result = minimax(state, player, 2, -Infinity, Infinity, true, weights);
    return result.action || greedy(state, player, weights);
  }
}

export * from './types';
export * from './evaluation';
export * from './algorithms';
