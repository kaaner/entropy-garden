/**
 * Onboarding utility functions
 * Manages first-time user detection and tutorial state
 */

const STORAGE_KEYS = {
  HAS_VISITED: 'entropy-garden:hasVisited',
  TUTORIAL_COMPLETED: 'entropy-garden:tutorialCompleted',
  TUTORIAL_SKIPPED: 'entropy-garden:tutorialSkipped',
  LAST_VISIT: 'entropy-garden:lastVisit',
} as const;

/**
 * Check if user has visited before
 */
export function hasVisitedBefore(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.HAS_VISITED) === 'true';
}

/**
 * Mark that user has visited
 */
export function markVisited(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.HAS_VISITED, 'true');
  localStorage.setItem(STORAGE_KEYS.LAST_VISIT, new Date().toISOString());
}

/**
 * Check if tutorial was completed
 */
export function hasTutorialCompleted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.TUTORIAL_COMPLETED) === 'true';
}

/**
 * Mark tutorial as completed
 */
export function markTutorialCompleted(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TUTORIAL_COMPLETED, 'true');
}

/**
 * Check if tutorial was skipped
 */
export function hasTutorialSkipped(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.TUTORIAL_SKIPPED) === 'true';
}

/**
 * Mark tutorial as skipped
 */
export function markTutorialSkipped(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TUTORIAL_SKIPPED, 'true');
}

/**
 * Get last visit timestamp
 */
export function getLastVisit(): Date | null {
  if (typeof window === 'undefined') return null;
  const timestamp = localStorage.getItem(STORAGE_KEYS.LAST_VISIT);
  return timestamp ? new Date(timestamp) : null;
}

/**
 * Reset all onboarding state (for testing)
 */
export function resetOnboardingState(): void {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Check if user should see tutorial prompt
 */
export function shouldShowTutorial(): boolean {
  return !hasVisitedBefore() || (!hasTutorialCompleted() && !hasTutorialSkipped());
}
