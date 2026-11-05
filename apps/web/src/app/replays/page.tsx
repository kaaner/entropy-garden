'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GameEngine } from '@/lib/game/engineFacade';
import { deserializeReplay, downloadReplay, serializeReplay } from '@/lib/game/replayModel';
import type { ReplayData } from '@/lib/game/replayModel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { GameState } from '@entropy-garden/engine';

export default function ReplaysPage() {
  const [replay, setReplay] = useState<ReplayData | null>(null);
  const [replayStates, setReplayStates] = useState<GameState[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [importError, setImportError] = useState<string | null>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = deserializeReplay(text);

      if ('error' in result) {
        setImportError(result.error);
        return;
      }

      // Build step-by-step states using engine replay
      const states: GameState[] = [result.initialState];
      let state = result.initialState;
      for (const action of result.actions) {
        state = GameEngine.applyAction(state, action);
        states.push(state);
      }

      setReplay(result);
      setReplayStates(states);
      setCurrentStep(0);
      setImportError(null);
    } catch (err) {
      setImportError((err as Error).message);
    }

    e.target.value = '';
  };

  const handlePrev = () => setCurrentStep((s) => Math.max(0, s - 1));
  const handleNext = () => setCurrentStep((s) => Math.min(replayStates.length - 1, s + 1));

  const currentState = replayStates[currentStep] ?? null;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/game">
            <Button variant="outline" size="sm">
              ← Back to Game
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            🎬 Replay Viewer
          </h1>
        </div>

        <Card className="border border-muted/50 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="text-lg">📤 Import Replay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => document.getElementById('replay-file-input')?.click()}
              variant="secondary"
              className="w-full"
            >
              Choose Replay JSON File
            </Button>
            <Input
              id="replay-file-input"
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            {importError && <p className="text-sm text-red-400">Error: {importError}</p>}
          </CardContent>
        </Card>

        {replay && (
          <>
            <Card className="border border-muted/50 bg-slate-900/80">
              <CardHeader>
                <CardTitle className="text-lg">📋 Replay Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Created:</span>{' '}
                  {new Date(replay.metadata.createdAt).toLocaleString()}
                </p>
                <p>
                  <span className="text-muted-foreground">Difficulty:</span>{' '}
                  {replay.metadata.difficulty}
                </p>
                <p>
                  <span className="text-muted-foreground">Actions:</span> {replay.actions.length}
                </p>
                <p>
                  <span className="text-muted-foreground">Winner:</span>{' '}
                  {replay.winner !== null ? `Player ${replay.winner + 1}` : 'None / In Progress'}
                </p>
                {replay.endReason && (
                  <p>
                    <span className="text-muted-foreground">End reason:</span> {replay.endReason}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border border-muted/50 bg-slate-900/80">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>⏯ Step-by-Step Viewer</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Step {currentStep + 1} / {replayStates.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="flex-1"
                  >
                    ← Prev
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={currentStep === replayStates.length - 1}
                    variant="outline"
                    className="flex-1"
                  >
                    Next →
                  </Button>
                </div>

                <Separator className="bg-muted/50" />

                {currentState && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                          Turn
                        </p>
                        <p className="text-xl font-bold">{currentState.turnNumber}</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                          Player 1 IP
                        </p>
                        <p className="text-xl font-bold text-green-400">
                          {currentState.playerIp[0]}
                        </p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                          Player 2 IP
                        </p>
                        <p className="text-xl font-bold text-red-400">{currentState.playerIp[1]}</p>
                      </div>
                    </div>

                    {/* Mini board */}
                    <div className="grid grid-cols-7 gap-1 mt-4">
                      {currentState.board.map((row, y) =>
                        row.map((cell, x) => (
                          <div
                            key={`${x}-${y}`}
                            className={`aspect-square rounded text-xs flex items-center justify-center font-bold border ${
                              cell.occupant
                                ? cell.occupant.ownerId === 0
                                  ? 'bg-green-800/60 border-green-500/50 text-green-200'
                                  : 'bg-red-800/60 border-red-500/50 text-red-200'
                                : 'bg-slate-800/40 border-muted/30 text-muted-foreground'
                            }`}
                            title={`(${x},${y}) N:${cell.nutrient} M:${cell.moisture}${cell.occupant ? ` ${cell.occupant.species}` : ''}`}
                          >
                            {cell.occupant ? cell.occupant.species[0] : '·'}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Last action */}
                    {currentState.lastAction && (
                      <div className="bg-muted/20 p-3 rounded-lg border border-muted/30 text-xs font-mono">
                        <span className="text-muted-foreground">Last action: </span>
                        {JSON.stringify(currentState.lastAction)}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={() =>
                downloadReplay(
                  serializeReplay(
                    replay.initialState,
                    replay.actions,
                    replay.winner,
                    replay.metadata.difficulty,
                    replay.endReason
                  )
                )
              }
              variant="secondary"
              className="w-full"
            >
              📥 Re-export Replay
            </Button>
          </>
        )}

        {!replay && (
          <div className="text-center text-muted-foreground py-16">
            <p className="text-4xl mb-4">🎬</p>
            <p className="text-lg">Import a replay JSON to step through it</p>
            <p className="text-sm mt-2">Export replays from the game screen</p>
          </div>
        )}
      </div>
    </div>
  );
}
