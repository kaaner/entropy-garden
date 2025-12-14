export type PlayerId = 0 | 1;
export type Species = 'ROOT' | 'SPREAD' | 'MUTATION';
export type Direction = 'N' | 'E' | 'S' | 'W';

export interface Traits {
  spreadBias: -1 | 0 | 1;
  envTolerance: -1 | 0 | 1;
}

export interface Occupant {
  ownerId: PlayerId;
  species: Species;
  traits: Traits;
  active: boolean;
}

export interface Cell {
  nutrient: number;
  moisture: number;
  occupant: Occupant | null;
}

export interface GameState {
  board: Cell[][];
  currentPlayer: PlayerId;
  playerIp: [number, number];
  turnNumber: number;
  lastAction: Action | null;
}

export type Action =
  | { type: 'SeedSpecies'; species: Species; x: number; y: number }
  | { type: 'ManipulateEnv'; x: number; y: number; target: 'N' | 'M'; delta: 1 | -1 }
  | { type: 'Mutate'; x: number; y: number; dir: Direction }
  | { type: 'EndTurn' };

export interface SimulationResult {
  state?: GameState;
  error?: string;
}

export interface GameEnd {
  ended: boolean;
  winner?: PlayerId;
  reason?: string;
}
