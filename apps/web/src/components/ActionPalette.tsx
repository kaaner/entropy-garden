'use client';

import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ActionAdapter } from '../lib/game/actionAdapter';
import type { Species, Direction } from '@entropy-garden/engine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SpeciesIcon } from './Icons';

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
    <Card className="enhanced-card border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          ⚡ Action Palette
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Position selector */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            📍 Target Position
          </Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="number"
                value={selectedX}
                onChange={(e) => setSelectedX(Number(e.target.value))}
                placeholder="X"
                className="bg-muted/30 border-muted"
                min="0"
                max="6"
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                value={selectedY}
                onChange={(e) => setSelectedY(Number(e.target.value))}
                placeholder="Y"
                className="bg-muted/30 border-muted"
                min="0"
                max="6"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Position: ({selectedX}, {selectedY})</p>
        </div>

        <Separator className="bg-muted/50" />

        {/* Seed Species */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            🌱 Seed Species
          </Label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {(['ROOT', 'SPREAD', 'MUTATION'] as Species[]).map((species) => (
              <button
                key={species}
                onClick={() => setSelectedSpecies(species)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedSpecies === species
                    ? 'border-primary bg-primary/20 shadow-lg shadow-primary/20'
                    : 'border-muted bg-muted/20 hover:border-muted-foreground/30'
                }`}
              >
                <SpeciesIcon species={species as any} size={32} className="mx-auto" />
                <p className="text-xs mt-1 font-medium">{species}</p>
              </button>
            ))}
          </div>
          <Button onClick={handleSeedSpecies} variant="default" className="w-full" size="lg">
            🌱 Seed {selectedSpecies}
          </Button>
        </div>

        <Separator className="bg-muted/50" />

        {/* Manipulate Environment */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            🌍 Environment
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => handleManipulateEnv('N', 1)} variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              +N
            </Button>
            <Button onClick={() => handleManipulateEnv('N', -1)} variant="destructive" size="sm">
              -N
            </Button>
            <Button onClick={() => handleManipulateEnv('M', 1)} variant="default" size="sm" className="bg-sky-600 hover:bg-sky-700">
              +M
            </Button>
            <Button onClick={() => handleManipulateEnv('M', -1)} variant="destructive" size="sm">
              -M
            </Button>
          </div>
        </div>

        <Separator className="bg-muted/50" />

        {/* Mutate */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            🧬 Mutate Direction
          </Label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {(['N', 'E', 'S', 'W'] as Direction[]).map((dir) => (
              <button
                key={dir}
                onClick={() => setSelectedDirection(dir)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedDirection === dir
                    ? 'border-primary bg-primary/20'
                    : 'border-muted bg-muted/20 hover:border-muted-foreground/30'
                }`}
              >
                <span className="text-lg font-bold">
                  {dir === 'N' && '↑'}
                  {dir === 'E' && '→'}
                  {dir === 'S' && '↓'}
                  {dir === 'W' && '←'}
                </span>
              </button>
            ))}
          </div>
          <Button onClick={handleMutate} variant="secondary" className="w-full" size="lg">
            🧬 Mutate {selectedDirection}
          </Button>
        </div>

        <Separator className="bg-muted/50" />

        {/* End Turn */}
        <Button onClick={handleEndTurn} variant="outline" className="w-full" size="lg">
          ⏭️ End Turn
        </Button>

        <Separator className="bg-muted/50" />

        {/* Commit/Clear */}
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={handleCommit} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" size="lg">
            ✓ Commit
          </Button>
          <Button onClick={handleClear} variant="outline" size="lg">
            ✕ Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
