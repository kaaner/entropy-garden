import type { GameEnd, GameState, PlayerId } from './types';
import { countActiveSpecies } from './state';

export function checkEnd(state: GameState): GameEnd {
  const currentIp = state.playerIp[state.currentPlayer];
  const activeCount = countActiveSpecies(state, state.currentPlayer);

  if (currentIp === 0 && activeCount === 0) {
    const winner = (1 - state.currentPlayer) as PlayerId;
    return {
      ended: true,
      winner,
      reason: `Player ${state.currentPlayer} has no IP and no active species`,
    };
  }

  return { ended: false };
}
