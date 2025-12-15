import { describe, it, expect, beforeEach } from 'vitest';
import {
  hasVisitedBefore,
  markVisited,
  hasTutorialCompleted,
  markTutorialCompleted,
  hasTutorialSkipped,
  markTutorialSkipped,
  getLastVisit,
  resetOnboardingState,
  shouldShowTutorial,
} from '../lib/onboarding';

describe('Onboarding Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    resetOnboardingState();
  });

  describe('hasVisitedBefore', () => {
    it('should return false for first-time user', () => {
      expect(hasVisitedBefore()).toBe(false);
    });

    it('should return true after marking visited', () => {
      markVisited();
      expect(hasVisitedBefore()).toBe(true);
    });
  });

  describe('markVisited', () => {
    it('should set hasVisited flag', () => {
      markVisited();
      expect(localStorage.getItem('entropy-garden:hasVisited')).toBe('true');
    });

    it('should set lastVisit timestamp', () => {
      const before = Date.now();
      markVisited();
      const lastVisit = getLastVisit();
      const after = Date.now();

      expect(lastVisit).toBeTruthy();
      expect(lastVisit!.getTime()).toBeGreaterThanOrEqual(before);
      expect(lastVisit!.getTime()).toBeLessThanOrEqual(after);
    });
  });

  describe('hasTutorialCompleted', () => {
    it('should return false initially', () => {
      expect(hasTutorialCompleted()).toBe(false);
    });

    it('should return true after marking completed', () => {
      markTutorialCompleted();
      expect(hasTutorialCompleted()).toBe(true);
    });
  });

  describe('hasTutorialSkipped', () => {
    it('should return false initially', () => {
      expect(hasTutorialSkipped()).toBe(false);
    });

    it('should return true after marking skipped', () => {
      markTutorialSkipped();
      expect(hasTutorialSkipped()).toBe(true);
    });
  });

  describe('shouldShowTutorial', () => {
    it('should return true for first-time user', () => {
      expect(shouldShowTutorial()).toBe(true);
    });

    it('should return false after tutorial is completed', () => {
      markVisited();
      markTutorialCompleted();
      expect(shouldShowTutorial()).toBe(false);
    });

    it('should return false after tutorial is skipped', () => {
      markVisited();
      markTutorialSkipped();
      expect(shouldShowTutorial()).toBe(false);
    });

    it('should return true for visited user who hasn\'t completed or skipped', () => {
      markVisited();
      expect(shouldShowTutorial()).toBe(true);
    });
  });

  describe('resetOnboardingState', () => {
    it('should clear all onboarding flags', () => {
      markVisited();
      markTutorialCompleted();
      markTutorialSkipped();

      resetOnboardingState();

      expect(hasVisitedBefore()).toBe(false);
      expect(hasTutorialCompleted()).toBe(false);
      expect(hasTutorialSkipped()).toBe(false);
      expect(getLastVisit()).toBe(null);
    });
  });
});
