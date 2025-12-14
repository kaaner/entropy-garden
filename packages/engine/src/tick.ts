import type { GameState, Occupant } from './types';
import { cloneState, getCell, getNeighbors } from './state';

export function runTick(state: GameState): GameState {
  let nextState = cloneState(state);

  recomputeActiveFlags(nextState);
  performSpreadExpansion(nextState);
  performConsumption(nextState);
  deactivateEmptyCells(nextState);

  return nextState;
}

function recomputeActiveFlags(state: GameState): void {
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {
      const cell = state.board[y][x];
      if (cell.occupant) {
        cell.occupant.active = isActive(cell.occupant, cell.nutrient, cell.moisture);
      }
    }
  }
}

function isActive(occupant: Occupant, nutrient: number, moisture: number): boolean {
  if (occupant.species === 'ROOT') {
    return nutrient + moisture >= 2;
  } else if (occupant.species === 'SPREAD') {
    return nutrient >= 1;
  } else if (occupant.species === 'MUTATION') {
    return moisture >= 1;
  }
  return false;
}

function performSpreadExpansion(state: GameState): void {
  const spreads: Array<{ x: number; y: number; occupant: Occupant }> = [];

  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {
      const occ = state.board[y][x].occupant;
      if (occ && occ.species === 'SPREAD' && occ.active) {
        spreads.push({ x, y, occupant: occ });
      }
    }
  }

  for (const spread of spreads) {
    const neighbors = getNeighbors(spread.x, spread.y);
    const candidates: Array<{ x: number; y: number; score: number; dir: string }> = [];

    for (const neighbor of neighbors) {
      const cell = getCell(state, neighbor.x, neighbor.y);
      if (cell && !cell.occupant) {
        const score = calculateSpreadScore(
          state,
          neighbor.x,
          neighbor.y,
          spread.occupant.traits.spreadBias,
          spread.occupant.ownerId
        );
        candidates.push({ x: neighbor.x, y: neighbor.y, score, dir: neighbor.dir });
      }
    }

    if (candidates.length === 0) continue;

    candidates.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.y !== b.y) return a.y - b.y;
      if (a.x !== b.x) return a.x - b.x;
      const dirOrder = ['N', 'E', 'S', 'W'];
      return dirOrder.indexOf(a.dir) - dirOrder.indexOf(b.dir);
    });

    const target = candidates[0];
    const targetCell = state.board[target.y][target.x];
    targetCell.occupant = {
      ownerId: spread.occupant.ownerId,
      species: 'SPREAD',
      traits: { ...spread.occupant.traits },
      active: false,
    };
  }
}

function calculateSpreadScore(
  state: GameState,
  x: number,
  y: number,
  spreadBias: number,
  ownerId: number
): number {
  const cell = getCell(state, x, y);
  if (!cell) return -1000;

  let score = cell.nutrient + cell.moisture + spreadBias;

  const neighbors = getNeighbors(x, y);
  for (const neighbor of neighbors) {
    const nCell = getCell(state, neighbor.x, neighbor.y);
    if (nCell?.occupant && nCell.occupant.species === 'ROOT' && nCell.occupant.ownerId !== ownerId) {
      score -= 1;
      break;
    }
  }

  return score;
}

function performConsumption(state: GameState): void {
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {
      const cell = state.board[y][x];
      if (cell.occupant && cell.occupant.active) {
        cell.nutrient = Math.max(0, cell.nutrient - 1);
      }
    }
  }
}

function deactivateEmptyCells(state: GameState): void {
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {
      const cell = state.board[y][x];
      if (cell.occupant && cell.nutrient === 0 && cell.moisture === 0) {
        cell.occupant.active = false;
      }
    }
  }
}
