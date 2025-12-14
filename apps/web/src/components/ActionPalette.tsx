'use client';

import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ActionAdapter } from '../lib/game/actionAdapter';
import type { Species, Direction } from '@entropy-garden/engine';

export const ActionPalette: React.FC = () => {
  const { gameState, selectAction, commitAction, clearPreview } = useGameStore();
  const [selectedSpecies, setSelectedSpecies] = useState<Species>('ROOT');
  const [selectedDirection, setSelectedDirection] = useState<Direction>('N');
  const [selectedX, setSelectedX] = useState<number>(0);
  const [selectedY, setSelectedY] = useState<number>(0);

  if (!gameState) return null;

  const handleSeedSpecies = () => {
    const action = ActionAdapter.seedSpecies(selectedSpecies, selectedX, selectedY);
    selectAction(action);
  };

  const handleManipulateEnv = (target: 'N' | 'M', delta: 1 | -1) => {
    const action = ActionAdapter.manipulateEnv(selectedX, selectedY, target, delta);
    selectAction(action);
  };

  const handleMutate = () => {
    const action = ActionAdapter.mutate(selectedX, selectedY, selectedDirection);
    selectAction(action);
  };

  const handleEndTurn = () => {
    const action = ActionAdapter.endTurn();
    selectAction(action);
    commitAction();
  };

  const handleCommit = () => {
    commitAction();
  };

  const handleClear = () => {
    clearPreview();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">Actions</h3>

      {/* Position selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Target Position</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={selectedX}
            onChange={(e) => setSelectedX(Number(e.target.value))}
            className="w-16 px-2 py-1 border rounded"
            min="0"
            max="6"
          />
          <input
            type="number"
            value={selectedY}
            onChange={(e) => setSelectedY(Number(e.target.value))}
            className="w-16 px-2 py-1 border rounded"
            min="0"
            max="6"
          />
        </div>
      </div>

      {/* Seed Species */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Seed Species</label>
        <select
          value={selectedSpecies}
          onChange={(e) => setSelectedSpecies(e.target.value as Species)}
          className="mr-2 px-2 py-1 border rounded"
        >
          <option value="ROOT">Root</option>
          <option value="SPREAD">Spread</option>
          <option value="MUTATION">Mutation</option>
        </select>
        <button
          onClick={handleSeedSpecies}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Seed
        </button>
      </div>

      {/* Manipulate Environment */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Manipulate Environment</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleManipulateEnv('N', 1)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            +Nutrient
          </button>
          <button
            onClick={() => handleManipulateEnv('N', -1)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            -Nutrient
          </button>
          <button
            onClick={() => handleManipulateEnv('M', 1)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            +Moisture
          </button>
          <button
            onClick={() => handleManipulateEnv('M', -1)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            -Moisture
          </button>
        </div>
      </div>

      {/* Mutate */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Mutate</label>
        <select
          value={selectedDirection}
          onChange={(e) => setSelectedDirection(e.target.value as Direction)}
          className="mr-2 px-2 py-1 border rounded"
        >
          <option value="N">North</option>
          <option value="E">East</option>
          <option value="S">South</option>
          <option value="W">West</option>
        </select>
        <button
          onClick={handleMutate}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Mutate
        </button>
      </div>

      {/* End Turn */}
      <div className="mb-4">
        <button
          onClick={handleEndTurn}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          End Turn
        </button>
      </div>

      {/* Commit/Clear */}
      <div className="flex gap-2">
        <button
          onClick={handleCommit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Commit Action
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Preview
        </button>
      </div>
    </div>
  );
};
