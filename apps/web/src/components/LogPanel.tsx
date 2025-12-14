'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface LogPanelProps {
  logs: string[];
}

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No events yet</p>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <p key={index} className="text-sm font-mono">
                  <span className="text-muted-foreground">[{index}]</span> {log}
                </p>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
