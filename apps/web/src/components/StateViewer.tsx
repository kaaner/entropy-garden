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
    <Card className="enhanced-card border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">🔍 State Viewer</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
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
              <ScrollArea className="h-96 w-full rounded-lg border border-muted/50 bg-muted/20">
                <pre className="p-4 text-xs font-mono text-foreground/80">
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
              <ScrollArea className="h-96 w-full rounded-lg border border-muted/50 bg-muted/20">
                {previewState ? (
                  <pre className="p-4 text-xs font-mono text-foreground/80">
                    {JSON.stringify(previewState, null, 2)}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-96">
                    <p className="text-muted-foreground italic">No preview available</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
