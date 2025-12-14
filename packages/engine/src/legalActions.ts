import type { Action, GameState, Species, Direction } from './types';
import { getCell, getNeighbors } from './state';

export function getLegalActions(state: GameState): Action[] {
  const actions: Action[] = [];
  const currentIp = state.playerIp[state.currentPlayer];

  const occupiedCells = new Set<string>();
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {
      if (state.board[y][x].occupant) {
        occupiedCells.add(`${x},${y}`);
      }
    }
  }

  const candidateCells = new Set<string>();
  
  if (occupiedCells.size === 0) {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        candidateCells.add(`${x},${y}`);
      }
    }
  } else {
    for (const key of occupiedCells) {
      const [x, y] = key.split(',').map(Number);
      const neighbors = getNeighbors(x, y);
      for (const neighbor of neighbors) {
        const cell = getCell(state, neighbor.x, neighbor.y);
        if (cell && !cell.occupant) {
          candidateCells.add(`${neighbor.x},${neighbor.y}`);
        }
      }
      candidateCells.add(key);
    }
  }

  if (currentIp >= 2) {
    const species: Species[] = ['ROOT', 'SPREAD', 'MUTATION'];
    for (const key of candidateCells) {
      const [x, y] = key.split(',').map(Number);
      const cell = getCell(state, x, y);
      if (cell && !cell.occupant) {
        for (const sp of species) {
          actions.push({ type: 'SeedSpecies', species: sp, x, y });
        }
      }
    }
  }

  if (currentIp >= 1) {
    for (const key of candidateCells) {
      const [x, y] = key.split(',').map(Number);
      const cell = getCell(state, x, y);
      if (cell) {
        if (cell.nutrient < 3) {
          actions.push({ type: 'ManipulateEnv', x, y, target: 'N', delta: 1 });
        }
        if (cell.nutrient > 0) {
          actions.push({ type: 'ManipulateEnv', x, y, target: 'N', delta: -1 });
        }
        if (cell.moisture < 3) {
          actions.push({ type: 'ManipulateEnv', x, y, target: 'M', delta: 1 });
        }
        if (cell.moisture > 0) {
          actions.push({ type: 'ManipulateEnv', x, y, target: 'M', delta: -1 });
        }
      }
    }
  }

  if (currentIp >= 3) {
    const directions: Direction[] = ['N', 'E', 'S', 'W'];
    for (const key of candidateCells) {
      const [x, y] = key.split(',').map(Number);
      for (const dir of directions) {
        const neighbors = getNeighbors(x, y);
        const neighbor = neighbors.find(n => n.dir === dir);
        if (neighbor) {
          const cell = getCell(state, neighbor.x, neighbor.y);
          if (cell?.occupant) {
            actions.push({ type: 'Mutate', x, y, dir });
          }
        }
      }
    }
  }

  actions.push({ type: 'EndTurn' });

  return actions;
}
