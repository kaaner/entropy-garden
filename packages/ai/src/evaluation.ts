import type { GameState, PlayerId } from '@entropy-garden/engine';
import { countActiveSpecies, countPassiveSpecies, getLegalActions } from '@entropy-garden/engine';
import type { EvaluationWeights } from './types';

export const DEFAULT_WEIGHTS: EvaluationWeights = {
  myActiveWeight: 10,
  oppActiveWeight: -8,
  oppLegalMovesWeight: -2,
  myPassiveWeight: -3,
  ipAdvantageWeight: 5,
  spreadFootprintWeight: 4,
};

export function evaluate(state: GameState, player: PlayerId, weights: EvaluationWeights = DEFAULT_WEIGHTS): number {
  const opponent = (1 - player) as PlayerId;
  
  const myActive = countActiveSpecies(state, player);
  const oppActive = countActiveSpecies(state, opponent);
  const myPassive = countPassiveSpecies(state, player);
  const oppLegalMoves = getLegalActions(state).length;
  const ipAdvantage = state.playerIp[player] - state.playerIp[opponent];
  
  const spreadFootprintDiff = calculateSpreadFootprint(state, player) - calculateSpreadFootprint(state, opponent);
  
  const score =
    myActive * weights.myActiveWeight +
    oppActive * weights.oppActiveWeight +
    oppLegalMoves * weights.oppLegalMovesWeight +
    myPassive * weights.myPassiveWeight +
    ipAdvantage * weights.ipAdvantageWeight +
    spreadFootprintDiff * weights.spreadFootprintWeight;
  
  return score;
}

function calculateSpreadFootprint(state: GameState, player: PlayerId): number {
  let count = 0;
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {
      const occ = state.board[y][x].occupant;
      if (occ && occ.ownerId === player && occ.species === 'SPREAD') {
        count++;
      }
    }
  }
  return count;
}
