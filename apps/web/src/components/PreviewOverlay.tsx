'use client';

import React from 'react';
import type { GameState } from '@entropy-garden/engine';
import { calculateDiff } from '@/lib/game/diff';

interface PreviewOverlayProps {
  gameState: GameState;
  previewState: GameState;
}

export const PreviewOverlay: React.FC<PreviewOverlayProps> = ({
  gameState,
  previewState,
}) => {
  const diff = calculateDiff(gameState, previewState);

  return (
    <div className="preview-overlay-info bg-blue-950/90 border border-blue-500/50 rounded-lg p-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🔮</span>
        <h3 className="text-lg font-bold text-blue-300">Action Preview</h3>
      </div>
      
      <div className="space-y-2">
        {diff.ipDelta !== 0 && (
          <div className="flex items-center justify-between bg-blue-900/50 p-2 rounded">
            <span className="text-sm text-blue-200">IP Change:</span>
            <span className={`text-lg font-bold ${diff.ipDelta > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {diff.ipDelta > 0 ? '+' : ''}{diff.ipDelta}
            </span>
          </div>
        )}
        
        {diff.cells.length > 0 && (
          <div className="bg-blue-900/50 p-2 rounded">
            <p className="text-sm text-blue-200 mb-2">Changes: {diff.cells.length} cell(s)</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {diff.cells.slice(0, 5).map((cellDiff, idx) => (
                <div key={idx} className="text-xs font-mono text-blue-100">
                  ({cellDiff.x},{cellDiff.y}) - {cellDiff.type}
                </div>
              ))}
              {diff.cells.length > 5 && (
                <div className="text-xs text-blue-300 italic">
                  ...and {diff.cells.length - 5} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <p className="text-xs text-blue-300 mt-3 italic">
        Click "Commit" to apply or "Clear" to cancel
      </p>
    </div>
  );
};
