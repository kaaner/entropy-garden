'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { serializeReplay, deserializeReplay, downloadReplay } from '@/lib/game/replayModel';
import { GameEngine } from '@/lib/game/engineFacade';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Separator } from './ui/separator';

export const ReplayControls: React.FC = () => {
  const { gameState, history, winner, aiDifficulty, status, newGame, addLog } = useGameStore();
  const [importError, setImportError] = useState<string | null>(null);

  const handleExport = () => {
    if (!history || history.length === 0) {
      addLog('Error: No game to export');
      return;
    }

    // Reconstruct actions from history
    const initialState = history[0];
    const actions = history.slice(1).map(state => state.lastAction!).filter(Boolean);

    const endReason = status === 'ended' ? `Winner: Player ${winner !== null ? winner + 1 : 'None'}` : undefined;

    const replayJson = serializeReplay(
      initialState,
      actions,
      winner,
      aiDifficulty,
      endReason
    );

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    downloadReplay(replayJson, `entropy-garden-${timestamp}.json`);
    addLog('Replay exported successfully');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = deserializeReplay(text);

      if ('error' in result) {
        setImportError(result.error);
        addLog(`Import failed: ${result.error}`);
        return;
      }

      // Validate replay by running it
      const finalState = GameEngine.replayFromState(result.initialState, result.actions);
      
      addLog(`Replay imported: ${result.actions.length} actions, ${result.metadata.difficulty} difficulty`);
      setImportError(null);
      
      // Could load the replay into a viewer here
      // For now just log success
    } catch (error) {
      const err = error as Error;
      setImportError(err.message);
      addLog(`Import error: ${err.message}`);
    }

    // Reset input
    e.target.value = '';
  };

  return (
    <Card className="enhanced-card border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          💾 Replay Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleExport}
          disabled={!history || history.length === 0}
          className="w-full"
          variant="secondary"
        >
          📥 Export Replay
        </Button>

        <Separator className="bg-muted/50" />

        <div>
          <label htmlFor="replay-import" className="cursor-pointer">
            <Button
              as="span"
              variant="outline"
              className="w-full"
            >
              📤 Import Replay
            </Button>
          </label>
          <Input
            id="replay-import"
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {importError && (
          <div className="bg-red-950/50 border border-red-500/50 rounded-lg p-3">
            <p className="text-xs text-red-300">{importError}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
