import React from 'react';
import { Cell } from './Cell';
import type { GameState } from '@entropy-garden/engine';

interface BoardGridProps {
  gameState: GameState | null;
  previewState: GameState | null;
  onCellClick?: (x: number, y: number) => void;
}

export const BoardGrid: React.FC<BoardGridProps> = ({
  gameState,
  previewState,
  onCellClick
}) => {
  if (!gameState) {
    return (
      <div className="w-96 h-96 border-2 border-dashed border-gray-300 flex items-center justify-center">
        <span className="text-gray-500">No game in progress</span>
      </div>
    );
  }

  const displayState = previewState || gameState;

  return (
    <div className="grid grid-cols-7 gap-1 p-4 bg-gray-100 rounded-lg">
      {displayState.board.map((row, y) =>
        row.map((cell, x) => (
          <Cell
            key={`${x}-${y}`}
            cell={cell}
            x={x}
            y={y}
            onClick={onCellClick}
            isPreview={!!previewState}
          />
        ))
      )}
    </div>
  );
};
