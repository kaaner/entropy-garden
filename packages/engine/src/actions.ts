import type { Action, GameState, Direction } from './types';
import { cloneState, getCell, getAdjacentOccupant, countActiveSpecies, countPassiveSpecies } from './state';
import { runTick } from './tick';

export function applyAction(state: GameState, action: Action): GameState {
  const validation = validateAction(state, action);
  if (!validation.valid) {
    return state;
  }

  let nextState = cloneState(state);

  if (action.type === 'SeedSpecies') {
    const cell = nextState.board[action.y][action.x];
    cell.occupant = {
      ownerId: nextState.currentPlayer,
      species: action.species,
      traits: { spreadBias: 0, envTolerance: 0 },
      active: false,
    };
    nextState.playerIp[nextState.currentPlayer] -= 2;
  } else if (action.type === 'ManipulateEnv') {
    const cell = nextState.board[action.y][action.x];
    if (action.target === 'N') {
      cell.nutrient = Math.max(0, Math.min(3, cell.nutrient + action.delta));
    } else {
      cell.moisture = Math.max(0, Math.min(3, cell.moisture + action.delta));
    }
    nextState.playerIp[nextState.currentPlayer] -= 1;
  } else if (action.type === 'Mutate') {
    const adj = getAdjacentOccupant(nextState, action.x, action.y, action.dir);
    if (adj) {
      const deltaSpread = action.dir === 'N' || action.dir === 'E' ? 1 : -1;
      const newBias = Math.max(-1, Math.min(1, adj.occupant.traits.spreadBias + deltaSpread)) as -1 | 0 | 1;
      adj.occupant.traits.spreadBias = newBias;
    }
    nextState.playerIp[nextState.currentPlayer] -= 3;
  } else if (action.type === 'EndTurn') {
    nextState.currentPlayer = (1 - nextState.currentPlayer) as 0 | 1;
    nextState.turnNumber++;

    const activeCount = countActiveSpecies(nextState, nextState.currentPlayer);
    const passiveCount = countPassiveSpecies(nextState, nextState.currentPlayer);
    const opponent = (1 - nextState.currentPlayer) as 0 | 1;
    const oppActiveCount = countActiveSpecies(nextState, opponent);

    let ecoBonus = 0;
    if (activeCount >= 3) ecoBonus = 1;
    else if (passiveCount >= 3) ecoBonus = -1;

    nextState.playerIp[nextState.currentPlayer] += 2 + ecoBonus;
  }

  nextState.lastAction = action;

  nextState = runTick(nextState);

  return nextState;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

function validateAction(state: GameState, action: Action): ValidationResult {
  if (action.type === 'SeedSpecies') {
    if (state.playerIp[state.currentPlayer] < 2) {
      return { valid: false, error: 'Insufficient IP' };
    }
    const cell = getCell(state, action.x, action.y);
    if (!cell) {
      return { valid: false, error: 'Invalid coordinates' };
    }
    if (cell.occupant) {
      return { valid: false, error: 'Cell occupied' };
    }
    return { valid: true };
  } else if (action.type === 'ManipulateEnv') {
    if (state.playerIp[state.currentPlayer] < 1) {
      return { valid: false, error: 'Insufficient IP' };
    }
    const cell = getCell(state, action.x, action.y);
    if (!cell) {
      return { valid: false, error: 'Invalid coordinates' };
    }
    const currentVal = action.target === 'N' ? cell.nutrient : cell.moisture;
    const newVal = currentVal + action.delta;
    if (newVal < 0 || newVal > 3) {
      return { valid: false, error: 'Value out of range' };
    }
    return { valid: true };
  } else if (action.type === 'Mutate') {
    if (state.playerIp[state.currentPlayer] < 3) {
      return { valid: false, error: 'Insufficient IP' };
    }
    const cell = getCell(state, action.x, action.y);
    if (!cell) {
      return { valid: false, error: 'Invalid coordinates' };
    }
    const adj = getAdjacentOccupant(state, action.x, action.y, action.dir);
    if (!adj) {
      return { valid: false, error: 'No adjacent occupant in that direction' };
    }
    return { valid: true };
  } else if (action.type === 'EndTurn') {
    return { valid: true };
  }

  return { valid: false, error: 'Unknown action type' };
}
