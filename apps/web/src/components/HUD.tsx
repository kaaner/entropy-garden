'use client';

import React, { useCallback } from 'react';
import type { GameState, PlayerId } from '@entropy-garden/engine';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useTurnTimer } from '@/lib/game/useTurnTimer';
import { useGameStore } from '@/store/gameStore';
import { ActionAdapter } from '@/lib/game/actionAdapter';

interface HUDProps {
  gameState: GameState | null;
  status: 'playing' | 'ended';
  winner: PlayerId | null;
  logs: string[];
}

export const HUD: React.FC<HUDProps> = ({ gameState, status, winner, logs }) => {
  const { timerKey, selectAction, commitAction } = useGameStore();

  const handleTimeout = useCallback(() => {
    if (gameState && gameState.currentPlayer === 0 && status === 'playing') {
      // Auto end turn when timer expires (only for human player)
      const action = ActionAdapter.endTurn();
      selectAction(action);
      commitAction();
    }
  }, [gameState, status, selectAction, commitAction]);

  const { timeRemaining } = useTurnTimer({
    duration: 25,
    onTimeout: handleTimeout,
    enabled: status === 'playing' && gameState !== null && gameState.currentPlayer === 0,
  });

  if (!gameState) {
    return (
      <Card className="enhanced-card border-0">
        <CardHeader>
          <CardTitle className="text-xl">🎮 Game Status</CardTitle>
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
    <Card className="enhanced-card border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${status === 'ended' ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`}></span>
          Game Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Turn & Current Player */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Turn</p>
            <p className="text-3xl font-bold text-primary">{turnNumber}</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Active</p>
            <p className={`text-2xl font-bold ${currentPlayer === 0 ? 'text-green-400' : 'text-red-400'}`}>
              Player {currentPlayer + 1}
            </p>
          </div>
        </div>

        <Separator className="bg-muted/50" />

        {/* Initiative Points */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Initiative Points</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-gradient-to-r from-green-500/20 to-transparent p-3 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
                <span className="font-semibold text-green-300">Player 1</span>
              </div>
              <span className="text-2xl font-bold text-green-400">{playerIP[0]}</span>
            </div>
            <div className="flex items-center justify-between bg-gradient-to-r from-red-500/20 to-transparent p-3 rounded-lg border border-red-500/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400 shadow-lg shadow-red-400/50"></div>
                <span className="font-semibold text-red-300">Player 2 (AI)</span>
              </div>
              <span className="text-2xl font-bold text-red-400">{playerIP[1]}</span>
            </div>
          </div>
        </div>

        <Separator className="bg-muted/50" />

        {/* Turn Timer */}
        {status === 'playing' && currentPlayer === 0 && (
          <>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Turn Timer</p>
              <div className="flex items-center gap-3">
                <span className="text-4xl">⏱️</span>
                <div>
                  <p className={`text-3xl font-bold ${timeRemaining <= 5 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                    {timeRemaining}s
                  </p>
                  <p className="text-xs text-muted-foreground">Auto EndTurn at 0</p>
                </div>
              </div>
            </div>
            <Separator className="bg-muted/50" />
          </>
        )}

        {/* Game Status */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Status</p>
          {status === 'ended' ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <p className="text-xl font-bold text-yellow-400">
                {winner !== null ? `Player ${winner + 1} Wins!` : 'Draw'}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl">▶️</span>
              <p className="text-xl font-bold text-green-400">In Progress</p>
            </div>
          )}
        </div>

        <Separator className="bg-muted/50" />

        {/* Recent Activity */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Recent Activity</p>
          <div className="max-h-40 overflow-y-auto bg-muted/30 p-3 rounded-lg border border-muted/50 space-y-1">
            {logs.length === 0 ? (
              <p className="text-muted-foreground italic text-sm">No activity yet</p>
            ) : (
              logs.slice(-6).reverse().map((log, index) => (
                <p key={index} className="font-mono text-xs text-foreground/80 leading-relaxed">
                  {log}
                </p>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
