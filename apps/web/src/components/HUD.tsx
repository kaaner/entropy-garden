'use client';

import React from 'react';
import type { GameState, PlayerId } from '@entropy-garden/engine';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

interface HUDProps {
  gameState: GameState | null;
  status: 'playing' | 'ended';
  winner: PlayerId | null;
  logs: string[];
}

export const HUD: React.FC<HUDProps> = ({ gameState, status, winner, logs }) => {
  if (!gameState) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Game Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No game in progress</p>
        </CardContent>
      </Card>
    );
  }

  const currentPlayer = gameState.currentPlayer;
  const playerIP = gameState.playerIp;
  const turnNumber = gameState.turnNumber;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Turn</p>
            <p className="text-2xl font-bold">{turnNumber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Player</p>
            <p className={`text-2xl font-bold ${currentPlayer === 0 ? 'text-green-500' : 'text-red-500'}`}>
              Player {currentPlayer + 1}
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Player 1 IP</p>
            <p className="text-xl font-semibold text-green-500">{playerIP[0]}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Player 2 IP</p>
            <p className="text-xl font-semibold text-red-500">{playerIP[1]}</p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-sm text-muted-foreground mb-2">Status</p>
          <p className={`text-lg font-bold ${status === 'ended' ? 'text-yellow-500' : 'text-green-500'}`}>
            {status === 'ended'
              ? `🏆 ${winner !== null ? `Player ${winner + 1} Wins!` : 'Draw'}`
              : '▶️ Playing'
            }
          </p>
        </div>

        <Separator />

        <div>
          <p className="text-sm text-muted-foreground mb-2">Recent Logs</p>
          <div className="max-h-32 overflow-y-auto bg-muted p-3 rounded-md text-sm space-y-1">
            {logs.length === 0 ? (
              <p className="text-muted-foreground italic">No logs yet</p>
            ) : (
              logs.slice(-5).map((log, index) => (
                <p key={index} className="font-mono text-xs">{log}</p>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
