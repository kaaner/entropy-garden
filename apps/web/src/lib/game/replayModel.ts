import type { GameState, Action, PlayerId } from '@entropy-garden/engine';
import type { Difficulty } from '@entropy-garden/ai';

export interface ReplayMetadata {
  createdAt: string;
  difficulty: Difficulty;
  seed?: number;
  version: string;
}

export interface ReplayData {
  metadata: ReplayMetadata;
  initialState: GameState;
  actions: Action[];
  winner: PlayerId | null;
  endReason?: string;
}

/**
 * Serialize a game replay to JSON
 */
export function serializeReplay(
  initialState: GameState,
  actions: Action[],
  winner: PlayerId | null,
  difficulty: Difficulty,
  endReason?: string
): string {
  const replay: ReplayData = {
    metadata: {
      createdAt: new Date().toISOString(),
      difficulty,
      version: '1.0.0',
    },
    initialState,
    actions,
    winner,
    endReason,
  };

  return JSON.stringify(replay, null, 2);
}

/**
 * Deserialize and validate a replay from JSON
 */
export function deserializeReplay(json: string): ReplayData | { error: string } {
  try {
    const data = JSON.parse(json);

    // Basic validation
    if (!data.metadata || !data.initialState || !Array.isArray(data.actions)) {
      return { error: 'Invalid replay format: missing required fields' };
    }

    if (!data.metadata.createdAt || !data.metadata.difficulty || !data.metadata.version) {
      return { error: 'Invalid replay metadata' };
    }

    return data as ReplayData;
  } catch (e) {
    return { error: `Failed to parse JSON: ${(e as Error).message}` };
  }
}

/**
 * Download replay as JSON file
 */
export function downloadReplay(replay: string, filename: string = 'entropy-garden-replay.json') {
  const blob = new Blob([replay], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
