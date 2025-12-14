'use client';

import React from 'react';
import type { Cell as GameCell } from '@entropy-garden/engine';

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

  const getSpeciesColor = (species: string) => {
    switch (species) {
      case 'ROOT': return 'bg-green-500';
      case 'SPREAD': return 'bg-blue-500';
      case 'MUTATION': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getSpeciesSymbol = (species: string) => {
    switch (species) {
      case 'ROOT': return 'R';
      case 'SPREAD': return 'S';
      case 'MUTATION': return 'M';
      default: return '?';
    }
  };

  return (
    <div
      className={`w-12 h-12 border border-gray-300 flex flex-col items-center justify-center text-xs font-bold cursor-pointer ${
        isPreview ? 'ring-2 ring-yellow-400' : ''
      }`}
      onClick={handleClick}
    >
      {/* Nutrient */}
      <div className="text-green-600">N{cell.nutrient}</div>

      {/* Occupant */}
      {cell.occupant && (
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
            getSpeciesColor(cell.occupant.species)
          } ${cell.occupant.active ? 'border-2 border-white' : 'opacity-50'}`}
        >
          {getSpeciesSymbol(cell.occupant.species)}
        </div>
      )}

      {/* Moisture */}
      <div className="text-blue-600">M{cell.moisture}</div>
    </div>
  );
};
