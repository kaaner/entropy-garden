import type { GameState, Action } from '@entropy-garden/engine';

export type Difficulty = 'easy' | 'medium';

export interface EvaluationWeights {
  myActiveWeight: number;
  oppActiveWeight: number;
  oppLegalMovesWeight: number;
  myPassiveWeight: number;
  ipAdvantageWeight: number;
  spreadFootprintWeight: number;
}

export interface AIConfig {
  difficulty: Difficulty;
  weights?: Partial<EvaluationWeights>;
}
