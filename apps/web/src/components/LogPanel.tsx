'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface LogPanelProps {
  logs: string[];
}

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  return (
    <Card className="enhanced-card border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">📜 Event Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 w-full rounded-lg border border-muted/50 bg-muted/20 p-4">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground italic">No events yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="font-mono text-xs text-foreground/90 p-2 rounded bg-background/50 hover:bg-background/80 transition-colors border border-muted/30"
                >
                  <span className="text-muted-foreground mr-2">[{index + 1}]</span>
                  {log}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
