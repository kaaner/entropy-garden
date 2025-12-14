import type { Action, Species, Direction } from '@entropy-garden/engine';

/**
 * Action adapter for converting UI inputs to engine Actions
 */
export class ActionAdapter {
  /**
   * Create a SeedSpecies action
   */
  static seedSpecies(species: Species, x: number, y: number): Action {
    return { type: 'SeedSpecies', species, x, y };
  }

  /**
   * Create a ManipulateEnv action
   */
  static manipulateEnv(x: number, y: number, target: 'N' | 'M', delta: 1 | -1): Action {
    return { type: 'ManipulateEnv', x, y, target, delta };
  }

  /**
   * Create a Mutate action
   */
  static mutate(x: number, y: number, dir: Direction): Action {
    return { type: 'Mutate', x, y, dir };
  }

  /**
   * Create an EndTurn action
   */
  static endTurn(): Action {
    return { type: 'EndTurn' };
  }

  /**
   * Validate if an action is properly formed
   */
  static validateAction(action: Action): boolean {
    switch (action.type) {
      case 'SeedSpecies':
        return (
          typeof action.x === 'number' &&
          typeof action.y === 'number' &&
          ['ROOT', 'SPREAD', 'MUTATION'].includes(action.species)
        );
      case 'ManipulateEnv':
        return (
          typeof action.x === 'number' &&
          typeof action.y === 'number' &&
          ['N', 'M'].includes(action.target) &&
          (action.delta === 1 || action.delta === -1)
        );
      case 'Mutate':
        return (
          typeof action.x === 'number' &&
          typeof action.y === 'number' &&
          ['N', 'E', 'S', 'W'].includes(action.dir)
        );
      case 'EndTurn':
        return true;
      default:
        return false;
    }
  }
}
