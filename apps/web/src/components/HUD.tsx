import React from 'react';
import type { GameState, PlayerId } from '@entropy-garden/engine';

interface HUDProps {
  gameState: GameState | null;
  status: 'playing' | 'ended';
  winner: PlayerId | null;
  logs: string[];
}

export const HUD: React.FC<HUDProps> = ({ gameState, status, winner, logs }) => {
  if (!gameState) {
    return (
      <div className="bg-gray-800 text-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Game Status</h2>
        <p>No game in progress</p>
      </div>
    );
  }

  const currentPlayer = gameState.currentPlayer;
  const playerIP = gameState.playerIp;
  const turnNumber = gameState.turnNumber;

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Game Status</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-300">Turn</p>
          <p className="text-lg font-semibold">{turnNumber}</p>
        </div>
        <div>
          <p className="text-sm text-gray-300">Current Player</p>
          <p className={`text-lg font-semibold ${currentPlayer === 0 ? 'text-blue-400' : 'text-red-400'}`}>
            Player {currentPlayer + 1}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-300">Player 1 IP</p>
          <p className="text-lg font-semibold text-blue-400">{playerIP[0]}</p>
        </div>
        <div>
          <p className="text-sm text-gray-300">Player 2 IP</p>
          <p className="text-lg font-semibold text-red-400">{playerIP[1]}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-300">Status</p>
        <p className={`text-lg font-semibold ${status === 'ended' ? 'text-yellow-400' : 'text-green-400'}`}>
          {status === 'ended'
            ? `Game Ended - ${winner !== null ? `Player ${winner + 1} Wins` : 'Draw'}`
            : 'Playing'
          }
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-300 mb-2">Recent Logs</p>
        <div className="max-h-32 overflow-y-auto bg-gray-700 p-2 rounded text-sm">
          {logs.slice(-5).map((log, index) => (
            <p key={index} className="mb-1">{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
};
