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
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Position selector */}
        <div className="space-y-2">
          <Label>Target Position</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={selectedX}
              onChange={(e) => setSelectedX(Number(e.target.value))}
              className="w-20"
              min="0"
              max="6"
            />
            <Input
              type="number"
              value={selectedY}
              onChange={(e) => setSelectedY(Number(e.target.value))}
              className="w-20"
              min="0"
              max="6"
            />
          </div>
        </div>

        <Separator />

        {/* Seed Species */}
        <div className="space-y-2">
          <Label>Seed Species</Label>
          <div className="flex gap-2">
            <Select value={selectedSpecies} onValueChange={(val) => setSelectedSpecies(val as Species)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ROOT">Root</SelectItem>
                <SelectItem value="SPREAD">Spread</SelectItem>
                <SelectItem value="MUTATION">Mutation</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSeedSpecies} variant="default">
              Seed
            </Button>
          </div>
        </div>

        <Separator />

        {/* Manipulate Environment */}
        <div className="space-y-2">
          <Label>Manipulate Environment</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => handleManipulateEnv('N', 1)} variant="default" size="sm">
              +Nutrient
            </Button>
            <Button onClick={() => handleManipulateEnv('N', -1)} variant="destructive" size="sm">
              -Nutrient
            </Button>
            <Button onClick={() => handleManipulateEnv('M', 1)} variant="default" size="sm">
              +Moisture
            </Button>
            <Button onClick={() => handleManipulateEnv('M', -1)} variant="destructive" size="sm">
              -Moisture
            </Button>
          </div>
        </div>

        <Separator />

        {/* Mutate */}
        <div className="space-y-2">
          <Label>Mutate</Label>
          <div className="flex gap-2">
            <Select value={selectedDirection} onValueChange={(val) => setSelectedDirection(val as Direction)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N">North</SelectItem>
                <SelectItem value="E">East</SelectItem>
                <SelectItem value="S">South</SelectItem>
                <SelectItem value="W">West</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleMutate} variant="secondary">
              Mutate
            </Button>
          </div>
        </div>

        <Separator />

        {/* End Turn */}
        <Button onClick={handleEndTurn} variant="outline" className="w-full">
          End Turn
        </Button>

        <Separator />

        {/* Commit/Clear */}
        <div className="flex gap-2">
          <Button onClick={handleCommit} className="flex-1">
            Commit Action
          </Button>
          <Button onClick={handleClear} variant="outline" className="flex-1">
            Clear Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
