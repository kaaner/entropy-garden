import type { Action, GameState } from '@entropy-garden/engine';

/**
 * Tutorial step definition
 */
export interface TutorialStep {
  id: number;
  title: string;
  description: string;
  instruction: string;
  highlightTarget?: string; // CSS selector or data-tutorial-id
  expectedAction?: Partial<Action>; // What player should do
  validationFn?: (gameState: GameState, action?: Action) => boolean;
  autoAdvance?: boolean; // Auto advance when validation passes
  canSkip: boolean;
}

/**
 * Tutorial state
 */
export interface TutorialState {
  active: boolean;
  started: boolean;
  skipped: boolean;
  completed: boolean;
  currentStep: number;
  completedSteps: Set<number>;
  totalSteps: number;
  startedAt?: number; // timestamp
  completedAt?: number; // timestamp
  skippedAt?: number; // timestamp
}

/**
 * Tutorial actions
 */
export interface TutorialActions {
  startTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  resetTutorial: () => void;
  markStepComplete: (step: number) => void;
}

/**
 * Tutorial store type
 */
export type TutorialStore = TutorialState & TutorialActions;

/**
 * localStorage keys for tutorial
 */
export const TUTORIAL_STORAGE_KEYS = {
  STATE: 'entropy-garden:tutorial:state',
  COMPLETED_STEPS: 'entropy-garden:tutorial:completedSteps',
  STARTED_AT: 'entropy-garden:tutorial:startedAt',
  COMPLETED_AT: 'entropy-garden:tutorial:completedAt',
} as const;
