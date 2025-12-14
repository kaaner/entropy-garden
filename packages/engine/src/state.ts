import type { Cell, GameState, Occupant, PlayerId } from './types';

export function createInitialState(): GameState {
  const board: Cell[][] = [];
  for (let y = 0; y < 7; y++) {
    board[y] = [];
    for (let x = 0; x < 7; x++) {
      board[y][x] = {
        nutrient: 2,
        moisture: 2,
        occupant: null,
      };
    }
  }

  return {
    board,
    currentPlayer: 0,
    playerIp: [4, 4],
    turnNumber: 1,
    lastAction: null,
  };
}

export function cloneState(state: GameState): GameState {
  return {
    board: state.board.map(row =>
      row.map(cell => ({
        nutrient: cell.nutrient,
        moisture: cell.moisture,
        occupant: cell.occupant
          ? {
              ownerId: cell.occupant.ownerId,
              species: cell.occupant.species,
              traits: { ...cell.occupant.traits },
              active: cell.occupant.active,
            }
          : null,
      }))
    ),
    currentPlayer: state.currentPlayer,
    playerIp: [...state.playerIp] as [number, number],
    turnNumber: state.turnNumber,
    lastAction: state.lastAction ? { ...state.lastAction } : null,
  };
}

export function getCell(state: GameState, x: number, y: number): Cell | null {
  if (y < 0 || y >= 7 || x < 0 || x >= 7) return null;
  return state.board[y][x];
}

export function countActiveSpecies(state: GameState, player: PlayerId): number {
  let count = 0;
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {
      const occ = state.board[y][x].occupant;
      if (occ && occ.ownerId === player && occ.active) {
        count++;
      }
    }
  }
  return count;
}

export function countPassiveSpecies(state: GameState, player: PlayerId): number {
  let count = 0;
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {
      const occ = state.board[y][x].occupant;
      if (occ && occ.ownerId === player && !occ.active) {
        count++;
      }
    }
  }
  return count;
}

export function hashState(state: GameState): string {
  return JSON.stringify(state);
}

const DIR_OFFSETS: Record<string, [number, number]> = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0],
};

export function getNeighbors(x: number, y: number): Array<{ x: number; y: number; dir: string }> {
  const result: Array<{ x: number; y: number; dir: string }> = [];
  for (const [dir, [dx, dy]] of Object.entries(DIR_OFFSETS)) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < 7 && ny >= 0 && ny < 7) {
      result.push({ x: nx, y: ny, dir });
    }
  }
  return result;
}

export function getAdjacentOccupant(
  state: GameState,
  x: number,
  y: number,
  dir: string
): { occupant: Occupant; x: number; y: number } | null {
  const offset = DIR_OFFSETS[dir];
  if (!offset) return null;
  const [dx, dy] = offset;
  const nx = x + dx;
  const ny = y + dy;
  const cell = getCell(state, nx, ny);
  if (!cell || !cell.occupant) return null;
  return { occupant: cell.occupant, x: nx, y: ny };
}
