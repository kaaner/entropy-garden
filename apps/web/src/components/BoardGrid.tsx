'use client';

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
      <div className="aspect-square w-full max-w-2xl mx-auto border-2 border-dashed border-muted flex items-center justify-center rounded-xl bg-muted/20">
        <div className="text-center space-y-2">
          <div className="text-6xl">🌱</div>
          <span className="text-muted-foreground">Click "New Game" to start</span>
        </div>
      </div>
    );
  }

  const displayState = previewState || gameState;

  return (
    <div className="game-board rounded-2xl p-6">
      <div className="grid grid-cols-7 gap-2 w-full max-w-2xl mx-auto">
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
    </div>
  );
};
