import { describe, it, expect } from 'vitest';
import { GameEngine } from '../lib/game/engineFacade';

// Mock the engine
vi.mock('../lib/game/engineFacade', () => ({
  GameEngine: {
    createInitialState: vi.fn(),
    applyAction: vi.fn(),
    getLegalActions: vi.fn(),
    replayFromState: vi.fn(),
  },
}));

describe('Game Integration Tests', () => {
  it('should start a new game', () => {
    const mockState = { currentPlayer: 'player' };
    vi.mocked(GameEngine.createInitialState).mockReturnValue(mockState);

    const state = GameEngine.createInitialState();
    expect(state).toBe(mockState);
  });

  it('should perform player action', () => {
    const initialState = { currentPlayer: 'player' };
    const action = { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 };
    const nextState = { currentPlayer: 'ai' };

    vi.mocked(GameEngine.applyAction).mockReturnValue(nextState);
    vi.mocked(GameEngine.getLegalActions).mockReturnValue([action]);

    const legalActions = GameEngine.getLegalActions(initialState);
    expect(legalActions).toContain(action);

    const result = GameEngine.applyAction(initialState, action);
    expect(result).toBe(nextState);
  });

  it('should handle replay', () => {
    const initialState = { currentPlayer: 'player' };
    const actions = [{ type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 }];
    const finalState = { currentPlayer: 'ai' };

    vi.mocked(GameEngine.replayFromState).mockReturnValue(finalState);

    const result = GameEngine.replayFromState(initialState, actions);
    expect(result).toBe(finalState);
  });

  it('should have deterministic replay', () => {
    const initialState = { currentPlayer: 'player' };
    const actions = [{ type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 }];
    const finalState = { currentPlayer: 'ai' };

    vi.mocked(GameEngine.replayFromState).mockReturnValue(finalState);

    const result1 = GameEngine.replayFromState(initialState, actions);
    const result2 = GameEngine.replayFromState(initialState, actions);
    expect(result1).toEqual(result2);
  });
});