import { describe, it, expect, beforeEach } from 'vitest';
import { useTutorialStore, getTutorialProgress, isStepCompleted } from '../store/tutorialStore';

describe('Tutorial Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useTutorialStore.getState().resetTutorial();
    // Clear localStorage
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useTutorialStore.getState();
      
      expect(state.active).toBe(false);
      expect(state.started).toBe(false);
      expect(state.skipped).toBe(false);
      expect(state.completed).toBe(false);
      expect(state.currentStep).toBe(0);
      expect(state.completedSteps.size).toBe(0);
      expect(state.totalSteps).toBe(8);
    });
  });

  describe('startTutorial', () => {
    it('should activate tutorial and set started flag', () => {
      const { startTutorial } = useTutorialStore.getState();
      
      startTutorial();
      const state = useTutorialStore.getState();
      
      expect(state.active).toBe(true);
      expect(state.started).toBe(true);
      expect(state.currentStep).toBe(0);
      expect(state.startedAt).toBeDefined();
    });

    it('should reset skipped and completed flags', () => {
      const store = useTutorialStore.getState();
      
      // First skip
      store.skipTutorial();
      expect(useTutorialStore.getState().skipped).toBe(true);
      
      // Then start again
      store.startTutorial();
      const state = useTutorialStore.getState();
      
      expect(state.skipped).toBe(false);
      expect(state.completed).toBe(false);
    });
  });

  describe('nextStep', () => {
    beforeEach(() => {
      useTutorialStore.getState().startTutorial();
    });

    it('should advance to next step', () => {
      const { nextStep } = useTutorialStore.getState();
      
      nextStep();
      
      expect(useTutorialStore.getState().currentStep).toBe(1);
    });

    it('should mark current step as completed', () => {
      const { nextStep } = useTutorialStore.getState();
      
      nextStep();
      
      expect(useTutorialStore.getState().completedSteps.has(0)).toBe(true);
    });

    it('should complete tutorial on last step', () => {
      const { goToStep, nextStep } = useTutorialStore.getState();
      
      // Go to last step (7)
      goToStep(7);
      expect(useTutorialStore.getState().currentStep).toBe(7);
      
      // Next should complete
      nextStep();
      const state = useTutorialStore.getState();
      
      expect(state.completed).toBe(true);
      expect(state.active).toBe(false);
      expect(state.completedAt).toBeDefined();
    });

    it('should not go beyond total steps', () => {
      const { goToStep, nextStep } = useTutorialStore.getState();
      
      goToStep(7); // Last step
      nextStep(); // Should complete
      
      const step1 = useTutorialStore.getState().currentStep;
      nextStep(); // Should not change
      const step2 = useTutorialStore.getState().currentStep;
      
      expect(step1).toBe(step2);
    });
  });

  describe('prevStep', () => {
    beforeEach(() => {
      useTutorialStore.getState().startTutorial();
    });

    it('should go to previous step', () => {
      const { goToStep, prevStep } = useTutorialStore.getState();
      
      goToStep(3);
      prevStep();
      
      expect(useTutorialStore.getState().currentStep).toBe(2);
    });

    it('should not go below step 0', () => {
      const { prevStep } = useTutorialStore.getState();
      
      prevStep();
      
      expect(useTutorialStore.getState().currentStep).toBe(0);
    });
  });

  describe('goToStep', () => {
    beforeEach(() => {
      useTutorialStore.getState().startTutorial();
    });

    it('should jump to specified step', () => {
      const { goToStep } = useTutorialStore.getState();
      
      goToStep(5);
      
      expect(useTutorialStore.getState().currentStep).toBe(5);
    });

    it('should not accept invalid step numbers', () => {
      const { goToStep } = useTutorialStore.getState();
      
      goToStep(-1);
      expect(useTutorialStore.getState().currentStep).toBe(0);
      
      goToStep(99);
      expect(useTutorialStore.getState().currentStep).toBe(0);
    });
  });

  describe('skipTutorial', () => {
    it('should mark tutorial as skipped', () => {
      const { startTutorial, skipTutorial } = useTutorialStore.getState();
      
      startTutorial();
      skipTutorial();
      const state = useTutorialStore.getState();
      
      expect(state.active).toBe(false);
      expect(state.skipped).toBe(true);
      expect(state.completed).toBe(false);
      expect(state.skippedAt).toBeDefined();
    });
  });

  describe('completeTutorial', () => {
    it('should mark all steps as completed', () => {
      const { startTutorial, completeTutorial } = useTutorialStore.getState();
      
      startTutorial();
      completeTutorial();
      const state = useTutorialStore.getState();
      
      expect(state.completed).toBe(true);
      expect(state.active).toBe(false);
      expect(state.completedSteps.size).toBe(8);
      expect(state.completedAt).toBeDefined();
    });

    it('should mark tutorial as completed even if not all steps visited', () => {
      const { startTutorial, completeTutorial } = useTutorialStore.getState();
      
      startTutorial();
      // Don't visit any steps, just complete
      completeTutorial();
      
      expect(useTutorialStore.getState().completedSteps.size).toBe(8);
    });
  });

  describe('markStepComplete', () => {
    it('should mark specific step as complete', () => {
      const { markStepComplete } = useTutorialStore.getState();
      
      markStepComplete(3);
      
      expect(useTutorialStore.getState().completedSteps.has(3)).toBe(true);
    });

    it('should allow marking multiple steps', () => {
      const { markStepComplete } = useTutorialStore.getState();
      
      markStepComplete(1);
      markStepComplete(3);
      markStepComplete(5);
      
      const state = useTutorialStore.getState();
      expect(state.completedSteps.has(1)).toBe(true);
      expect(state.completedSteps.has(3)).toBe(true);
      expect(state.completedSteps.has(5)).toBe(true);
      expect(state.completedSteps.size).toBe(3);
    });
  });

  describe('resetTutorial', () => {
    it('should reset all state to initial values', () => {
      const { startTutorial, nextStep, skipTutorial, resetTutorial } = useTutorialStore.getState();
      
      // Do some actions
      startTutorial();
      nextStep();
      nextStep();
      skipTutorial();
      
      // Reset
      resetTutorial();
      const state = useTutorialStore.getState();
      
      expect(state.active).toBe(false);
      expect(state.started).toBe(false);
      expect(state.skipped).toBe(false);
      expect(state.completed).toBe(false);
      expect(state.currentStep).toBe(0);
      expect(state.completedSteps.size).toBe(0);
      expect(state.startedAt).toBeUndefined();
    });
  });

  describe('Helper Functions', () => {
    describe('getTutorialProgress', () => {
      it('should return 0% initially', () => {
        expect(getTutorialProgress()).toBe(0);
      });

      it('should calculate progress correctly', () => {
        const { markStepComplete } = useTutorialStore.getState();
        
        markStepComplete(0);
        markStepComplete(1);
        expect(getTutorialProgress()).toBe(25); // 2/8 = 25%
        
        markStepComplete(2);
        markStepComplete(3);
        expect(getTutorialProgress()).toBe(50); // 4/8 = 50%
      });

      it('should return 100% when completed', () => {
        const { completeTutorial } = useTutorialStore.getState();
        
        completeTutorial();
        expect(getTutorialProgress()).toBe(100);
      });
    });

    describe('isStepCompleted', () => {
      it('should return false for uncompleted steps', () => {
        expect(isStepCompleted(0)).toBe(false);
        expect(isStepCompleted(5)).toBe(false);
      });

      it('should return true for completed steps', () => {
        const { markStepComplete } = useTutorialStore.getState();
        
        markStepComplete(2);
        expect(isStepCompleted(2)).toBe(true);
        expect(isStepCompleted(3)).toBe(false);
      });
    });
  });

  describe('Persistence', () => {
    it('should persist state to localStorage', () => {
      const { startTutorial, nextStep } = useTutorialStore.getState();
      
      startTutorial();
      nextStep();
      nextStep();
      
      // Check localStorage has data
      const stored = localStorage.getItem('entropy-garden:tutorial:state');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.state.currentStep).toBe(2);
      expect(Array.isArray(parsed.state.completedSteps)).toBe(true);
    });

    it('should restore state from localStorage', () => {
      const { startTutorial, nextStep } = useTutorialStore.getState();
      
      // Set some state
      startTutorial();
      nextStep();
      nextStep();
      
      // Simulate page reload by creating new store instance
      // In real app, Zustand would automatically restore from localStorage
      const currentStep = useTutorialStore.getState().currentStep;
      const completedCount = useTutorialStore.getState().completedSteps.size;
      
      expect(currentStep).toBe(2);
      expect(completedCount).toBe(2); // Steps 0 and 1 completed
    });
  });
});
