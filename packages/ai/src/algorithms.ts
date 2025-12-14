import type { GameState, Action, PlayerId } from '@entropy-garden/engine';
import { getLegalActions, applyAction, checkEnd } from '@entropy-garden/engine';
import { evaluate, DEFAULT_WEIGHTS } from './evaluation';
import type { EvaluationWeights } from './types';

export function greedy(state: GameState, player: PlayerId, weights: EvaluationWeights = DEFAULT_WEIGHTS): Action {
  const actions = getLegalActions(state);
  
  let bestAction = actions[0];
  let bestScore = -Infinity;
  
  for (const action of actions) {
    const nextState = applyAction(state, action);
    const score = evaluate(nextState, player, weights);
    
    if (score > bestScore || (score === bestScore && compareActions(action, bestAction) < 0)) {
      bestScore = score;
      bestAction = action;
    }
  }
  
  return bestAction;
}

export function minimax(
  state: GameState,
  player: PlayerId,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  weights: EvaluationWeights = DEFAULT_WEIGHTS
): { score: number; action?: Action } {
  const gameEnd = checkEnd(state);
  if (gameEnd.ended || depth === 0) {
    return { score: evaluate(state, player, weights) };
  }
  
  const actions = getLegalActions(state);
  
  if (maximizingPlayer) {
    let maxScore = -Infinity;
    let bestAction: Action | undefined;
    
    for (const action of actions) {
      const nextState = applyAction(state, action);
      const result = minimax(nextState, player, depth - 1, alpha, beta, false, weights);
      
      if (result.score > maxScore || (result.score === maxScore && bestAction && compareActions(action, bestAction) < 0)) {
        maxScore = result.score;
        bestAction = action;
      }
      
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) {
        break;
      }
    }
    
    return { score: maxScore, action: bestAction };
  } else {
    let minScore = Infinity;
    let bestAction: Action | undefined;
    
    for (const action of actions) {
      const nextState = applyAction(state, action);
      const result = minimax(nextState, player, depth - 1, alpha, beta, true, weights);
      
      if (result.score < minScore || (result.score === minScore && bestAction && compareActions(action, bestAction) < 0)) {
        minScore = result.score;
        bestAction = action;
      }
      
      beta = Math.min(beta, minScore);
      if (beta <= alpha) {
        break;
      }
    }
    
    return { score: minScore, action: bestAction };
  }
}

function compareActions(a: Action, b: Action): number {
  const aStr = JSON.stringify(a);
  const bStr = JSON.stringify(b);
  return aStr.localeCompare(bStr);
}
