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
      className={`w-16 h-16 border border-gray-300 flex flex-col items-center justify-center text-xs cursor-pointer transition-all hover:bg-gray-50 ${
        isPreview ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''
      }`}
      onClick={handleClick}
    >
      {/* Nutrient (top) */}
      <div className="text-green-600 text-[10px] font-semibold">N{cell.nutrient}</div>

      {/* Occupant (center - with icon) */}
      {cell.occupant && (
        <div
          className={`flex items-center justify-center ${
            cell.occupant.active ? '' : 'opacity-40 grayscale'
          }`}
        >
          <SpeciesIcon
            species={cell.occupant.species as SpeciesType}
            ownerId={cell.occupant.ownerId}
            size={28}
            className={cell.occupant.active ? '' : 'inactive-species'}
          />
        </div>
      )}

      {/* Moisture (bottom) */}
      <div className="text-blue-600 text-[10px] font-semibold">M{cell.moisture}</div>
    </div>
  );
};
