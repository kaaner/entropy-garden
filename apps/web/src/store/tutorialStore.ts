import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TutorialStore } from '@/types/tutorial';
import { TUTORIAL_STORAGE_KEYS } from '@/types/tutorial';

const TOTAL_STEPS = 8; // Will be defined in TASK-3

/**
 * Tutorial state management store
 * Handles tutorial progress, step navigation, and persistence
 */
export const useTutorialStore = create<TutorialStore>()(
  persist(
    (set, get) => ({
      // Initial state
      active: false,
      started: false,
      skipped: false,
      completed: false,
      currentStep: 0,
      completedSteps: new Set<number>(),
      totalSteps: TOTAL_STEPS,
      startedAt: undefined,
      completedAt: undefined,
      skippedAt: undefined,

      // Actions
      startTutorial: () => {
        const now = Date.now();
        set({
          active: true,
          started: true,
          skipped: false,
          completed: false,
          currentStep: 0,
          completedSteps: new Set<number>(),
          startedAt: now,
          completedAt: undefined,
          skippedAt: undefined,
        });
      },

      nextStep: () => {
        const { currentStep, totalSteps, completedSteps } = get();
        if (currentStep < totalSteps - 1) {
          const nextStep = currentStep + 1;
          const newCompletedSteps = new Set(completedSteps);
          newCompletedSteps.add(currentStep);
          
          set({
            currentStep: nextStep,
            completedSteps: newCompletedSteps,
          });
        } else {
          // Last step, complete tutorial
          get().completeTutorial();
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      goToStep: (step: number) => {
        const { totalSteps } = get();
        if (step >= 0 && step < totalSteps) {
          set({ currentStep: step });
        }
      },

      skipTutorial: () => {
        const now = Date.now();
        set({
          active: false,
          skipped: true,
          completed: false,
          skippedAt: now,
        });
      },

      completeTutorial: () => {
        const now = Date.now();
        const { completedSteps, totalSteps } = get();
        const newCompletedSteps = new Set(completedSteps);
        
        // Mark all steps as completed
        for (let i = 0; i < totalSteps; i++) {
          newCompletedSteps.add(i);
        }

        set({
          active: false,
          completed: true,
          completedSteps: newCompletedSteps,
          completedAt: now,
          currentStep: totalSteps - 1, // Set to last step
        });
      },

      resetTutorial: () => {
        set({
          active: false,
          started: false,
          skipped: false,
          completed: false,
          currentStep: 0,
          completedSteps: new Set<number>(),
          startedAt: undefined,
          completedAt: undefined,
          skippedAt: undefined,
        });
      },

      markStepComplete: (step: number) => {
        const { completedSteps } = get();
        const newCompletedSteps = new Set(completedSteps);
        newCompletedSteps.add(step);
        set({ completedSteps: newCompletedSteps });
      },
    }),
    {
      name: TUTORIAL_STORAGE_KEYS.STATE,
      // Custom storage to handle Set serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          try {
            const data = JSON.parse(str);
            // Convert completedSteps array back to Set
            if (data.state && Array.isArray(data.state.completedSteps)) {
              data.state.completedSteps = new Set(data.state.completedSteps);
            }
            return data;
          } catch (e) {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            // Convert Set to array for serialization
            const serializable = {
              ...value,
              state: {
                ...value.state,
                completedSteps: Array.from(value.state.completedSteps),
              },
            };
            localStorage.setItem(name, JSON.stringify(serializable));
          } catch (e) {
            console.error('Failed to save tutorial state:', e);
          }
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

/**
 * Check if tutorial should be shown based on query params and state
 */
export function shouldShowTutorial(searchParams: URLSearchParams): boolean {
  const tutorialParam = searchParams.get('tutorial');
  const store = useTutorialStore.getState();
  
  // Explicit tutorial=true query param
  if (tutorialParam === 'true') {
    return true;
  }
  
  // Never started tutorial and not skipped
  if (!store.started && !store.skipped && !store.completed) {
    return true;
  }
  
  return false;
}

/**
 * Get tutorial progress percentage
 */
export function getTutorialProgress(): number {
  const { completedSteps, totalSteps } = useTutorialStore.getState();
  if (totalSteps === 0) return 0;
  return Math.round((completedSteps.size / totalSteps) * 100);
}

/**
 * Check if a specific step is completed
 */
export function isStepCompleted(step: number): boolean {
  const { completedSteps } = useTutorialStore.getState();
  return completedSteps.has(step);
}
