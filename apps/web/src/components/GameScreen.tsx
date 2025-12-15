'use client';

import React from 'react';
import { useGameStore } from '../store/gameStore';
import { BoardGrid } from './BoardGrid';
import { HUD } from './HUD';
import { ActionPalette } from './ActionPalette';
import { LogPanel } from './LogPanel';
import { StateViewer } from './StateViewer';
import { PreviewOverlay } from './PreviewOverlay';
import { ReplayControls } from './ReplayControls';
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
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-[1920px] mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
                🌱 Entropy Garden
              </h1>
              <p className="text-muted-foreground text-lg">
                Strategic evolution • Seed, spread, and mutate to dominate
              </p>
            </div>
            <Button onClick={handleNewGame} size="lg" className="h-12 px-8 text-base">
              🎮 New Game
            </Button>
          </div>
          <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Game Board Section */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="enhanced-card border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Game Board
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <BoardGrid
                  gameState={gameState}
                  previewState={previewState}
                />
                {gameState && previewState && (
                  <PreviewOverlay gameState={gameState} previewState={previewState} />
                )}
              </CardContent>
            </Card>

            {/* Debug Tools */}
            <Tabs defaultValue="logs" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="logs" className="data-[state=active]:bg-primary/20">
                  📜 Event Log
                </TabsTrigger>
                <TabsTrigger value="state" className="data-[state=active]:bg-primary/20">
                  🔍 State Viewer
                </TabsTrigger>
              </TabsList>
              <TabsContent value="logs" className="mt-4">
                <LogPanel logs={logs} />
              </TabsContent>
              <TabsContent value="state" className="mt-4">
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

            <ReplayControls />
          </div>
        </div>
      </div>
    </div>
  );
};
