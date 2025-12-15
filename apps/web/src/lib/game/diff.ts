import type { GameState, Cell } from '@entropy-garden/engine';

export interface CellDiff {
  x: number;
  y: number;
  type: 'new' | 'removed' | 'modified' | 'activated' | 'deactivated';
  oldCell?: Cell;
  newCell: Cell;
}

export interface StateDiff {
  cells: CellDiff[];
  ipDelta: number;
}

/**
 * Calculate differences between two game states
 */
export function calculateDiff(oldState: GameState, newState: GameState): StateDiff {
  const cells: CellDiff[] = [];
  let ipDelta = 0;

  // Check IP changes for current player
  const currentPlayer = oldState.currentPlayer;
  ipDelta = newState.playerIp[currentPlayer] - oldState.playerIp[currentPlayer];

  // Check each cell for changes
  for (let y = 0; y < oldState.board.length; y++) {
    for (let x = 0; x < oldState.board[y].length; x++) {
      const oldCell = oldState.board[y][x];
      const newCell = newState.board[y][x];

      // Check for occupant changes
      const hadOccupant = oldCell.occupant !== null;
      const hasOccupant = newCell.occupant !== null;

      if (!hadOccupant && hasOccupant) {
        cells.push({ x, y, type: 'new', newCell, oldCell });
      } else if (hadOccupant && !hasOccupant) {
        cells.push({ x, y, type: 'removed', newCell, oldCell });
      } else if (hadOccupant && hasOccupant) {
        const oldActive = oldCell.occupant!.active;
        const newActive = newCell.occupant!.active;
        
        if (oldActive !== newActive) {
          cells.push({
            x,
            y,
            type: newActive ? 'activated' : 'deactivated',
            newCell,
            oldCell,
          });
        } else if (
          oldCell.nutrient !== newCell.nutrient ||
          oldCell.moisture !== newCell.moisture ||
          oldCell.occupant!.traits.spreadBias !== newCell.occupant!.traits.spreadBias
        ) {
          cells.push({ x, y, type: 'modified', newCell, oldCell });
        }
      }

      // Check for environment changes even without occupant
      if (!hadOccupant && !hasOccupant) {
        if (oldCell.nutrient !== newCell.nutrient || oldCell.moisture !== newCell.moisture) {
          cells.push({ x, y, type: 'modified', newCell, oldCell });
        }
      }
    }
  }

  return { cells, ipDelta };
}
