import React from 'react';
import { useGameStore } from '../store/gameStore';
import { BoardGrid } from './BoardGrid';
import { HUD } from './HUD';
import { ActionPalette } from './ActionPalette';

export const GameScreen: React.FC = () => {
  const {
    gameState,
    previewState,
    status,
    winner,
    logs,
    newGame,
  } = useGameStore();

  const handleNewGame = () => {
    newGame();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Entropy Garden</h1>
          <button
            onClick={handleNewGame}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            New Game
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <BoardGrid
              gameState={gameState}
              previewState={previewState}
            />
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <HUD
              gameState={gameState}
              status={status}
              winner={winner}
              logs={logs}
            />

            <ActionPalette />
          </div>
        </div>
      </div>
    </div>
  );
};
