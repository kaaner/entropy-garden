'use client';

import React from 'react';
import type { Cell as GameCell } from '@entropy-garden/engine';
import { SpeciesIcon } from './Icons/SpeciesIcon';
import type { SpeciesType } from '@/lib/icons/iconRegistry';

interface CellProps {
  cell: GameCell;
  x: number;
  y: number;
  onClick?: (x: number, y: number) => void;
  isPreview?: boolean;
}

export const Cell: React.FC<CellProps> = ({ cell, x, y, onClick, isPreview }) => {
  const handleClick = () => {
    if (onClick) onClick(x, y);
  };

  return (
    <div
      className={`cell aspect-square flex flex-col items-center justify-between p-2 cursor-pointer rounded-lg ${
        isPreview ? 'cell-preview' : ''
      }`}
      onClick={handleClick}
      title={`Position: (${x}, ${y})`}
    >
      {/* Nutrient (top) */}
      <div className="nutrient-indicator text-xs font-bold tracking-wide">
        N{cell.nutrient}
      </div>

      {/* Occupant (center - with icon) */}
      <div className="flex-1 flex items-center justify-center">
        {cell.occupant && (
          <SpeciesIcon
            species={cell.occupant.species as SpeciesType}
            ownerId={cell.occupant.ownerId}
            size={32}
            className={cell.occupant.active ? '' : 'inactive-species'}
          />
        )}
      </div>

      {/* Moisture (bottom) */}
      <div className="moisture-indicator text-xs font-bold tracking-wide">
        M{cell.moisture}
      </div>
    </div>
  );
};
