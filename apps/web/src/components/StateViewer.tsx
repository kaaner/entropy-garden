'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { GameState } from '@entropy-garden/engine';

interface StateViewerProps {
  gameState: GameState | null;
  previewState: GameState | null;
}

export const StateViewer: React.FC<StateViewerProps> = ({ gameState, previewState }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>State Viewer</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current State</TabsTrigger>
            <TabsTrigger value="preview">Preview State</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(JSON.stringify(gameState, null, 2))}
                className="w-full"
              >
                📋 Copy to Clipboard
              </Button>
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <pre className="p-4 text-xs font-mono">
                  {JSON.stringify(gameState, null, 2)}
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent value="preview">
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(JSON.stringify(previewState, null, 2))}
                className="w-full"
                disabled={!previewState}
              >
                📋 Copy to Clipboard
              </Button>
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <pre className="p-4 text-xs font-mono">
                  {previewState ? JSON.stringify(previewState, null, 2) : 'No preview state'}
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
