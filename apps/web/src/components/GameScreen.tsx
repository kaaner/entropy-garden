'use client';

import React from 'react';
import { useGameStore } from '../store/gameStore';
import { BoardGrid } from './BoardGrid';
import { HUD } from './HUD';
import { ActionPalette } from './ActionPalette';
import { LogPanel } from './LogPanel';
import { StateViewer } from './StateViewer';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold tracking-tight">
              🌱 Entropy Garden
            </h1>
            <Button onClick={handleNewGame} size="lg">
              New Game
            </Button>
          </div>
          <p className="text-muted-foreground">
            Strategic PvE game - Seed, spread, and mutate to dominate the board
          </p>
          <Separator className="mt-4" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Board */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Game Board</CardTitle>
              </CardHeader>
              <CardContent>
                <BoardGrid
                  gameState={gameState}
                  previewState={previewState}
                />
              </CardContent>
            </Card>

            {/* Debug Tools */}
            <Tabs defaultValue="logs">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="logs">Event Log</TabsTrigger>
                <TabsTrigger value="state">State Viewer</TabsTrigger>
              </TabsList>
              <TabsContent value="logs">
                <LogPanel logs={logs} />
              </TabsContent>
              <TabsContent value="state">
                <StateViewer gameState={gameState} previewState={previewState} />
              </TabsContent>
            </Tabs>
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
