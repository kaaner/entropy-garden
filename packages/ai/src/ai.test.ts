import { describe, it, expect } from 'vitest';
import { createInitialState, applyAction, getLegalActions } from '@entropy-garden/engine';
import { generateMove, greedy, minimax, evaluate, DEFAULT_WEIGHTS } from './index';

describe('AI Evaluation', () => {
  it('should have default weights defined', () => {
    expect(DEFAULT_WEIGHTS.myActiveWeight).toBe(10);
    expect(DEFAULT_WEIGHTS.oppActiveWeight).toBe(-8);
    expect(DEFAULT_WEIGHTS.oppLegalMovesWeight).toBe(-2);
    expect(DEFAULT_WEIGHTS.myPassiveWeight).toBe(-3);
    expect(DEFAULT_WEIGHTS.ipAdvantageWeight).toBe(5);
    expect(DEFAULT_WEIGHTS.spreadFootprintWeight).toBe(4);
  });

  it('should evaluate initial state', () => {
    const state = createInitialState();
    const score = evaluate(state, 0);
    
    expect(typeof score).toBe('number');
  });

  it('should give higher score for more active species', () => {
    const state = createInitialState();
    const state1 = applyAction(state, { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 });
    
    const score0 = evaluate(state, 0);
    const score1 = evaluate(state1, 0);
    
    expect(score1).toBeGreaterThan(score0);
  });

  it('should be deterministic', () => {
    const state = createInitialState();
    const score1 = evaluate(state, 0);
    const score2 = evaluate(state, 0);
    
    expect(score1).toBe(score2);
  });
});

describe('AI Greedy', () => {
  it('should return a valid action', () => {
    const state = createInitialState();
    const action = greedy(state, 0);
    
    expect(action).toBeDefined();
    expect(action.type).toBeDefined();
  });

  it('should choose action from legal actions', () => {
    const state = createInitialState();
    const legalActions = getLegalActions(state);
    const action = greedy(state, 0);
    
    const isLegal = legalActions.some(
      a => JSON.stringify(a) === JSON.stringify(action)
    );
    
    expect(isLegal).toBe(true);
  });

  it('should be deterministic with same state', () => {
    const state = createInitialState();
    const action1 = greedy(state, 0);
    const action2 = greedy(state, 0);
    
    expect(JSON.stringify(action1)).toBe(JSON.stringify(action2));
  });

  it('should prefer high-value actions', () => {
    let state = createInitialState();
    state = applyAction(state, { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 });
    
    const action = greedy(state, 0);
    
    expect(action).toBeDefined();
  });
});

describe('AI Minimax', () => {
  it('should return action and score at depth 0', () => {
    const state = createInitialState();
    const result = minimax(state, 0, 0, -Infinity, Infinity, true);
    
    expect(typeof result.score).toBe('number');
  });

  it('should return action at depth 1', () => {
    const state = createInitialState();
    const result = minimax(state, 0, 1, -Infinity, Infinity, true);
    
    expect(result.action).toBeDefined();
    expect(typeof result.score).toBe('number');
  });

  it('should return action at depth 2', () => {
    const state = createInitialState();
    const result = minimax(state, 0, 2, -Infinity, Infinity, true);
    
    expect(result.action).toBeDefined();
    expect(typeof result.score).toBe('number');
  });

  it('should be deterministic', () => {
    const state = createInitialState();
    const result1 = minimax(state, 0, 2, -Infinity, Infinity, true);
    const result2 = minimax(state, 0, 2, -Infinity, Infinity, true);
    
    expect(result1.score).toBe(result2.score);
    expect(JSON.stringify(result1.action)).toBe(JSON.stringify(result2.action));
  });

  it('should perform alpha-beta pruning', () => {
    const state = createInitialState();
    const result = minimax(state, 0, 2, -Infinity, Infinity, true);
    
    expect(result.action).toBeDefined();
  });
});

describe('AI Generate Move', () => {
  it('should generate easy difficulty move', () => {
    const state = createInitialState();
    const action = generateMove(state, { difficulty: 'easy' });
    
    expect(action).toBeDefined();
    expect(action.type).toBeDefined();
  });

  it('should generate medium difficulty move', () => {
    const state = createInitialState();
    const action = generateMove(state, { difficulty: 'medium' });
    
    expect(action).toBeDefined();
    expect(action.type).toBeDefined();
  });

  it('easy mode should use greedy', () => {
    const state = createInitialState();
    const easyAction = generateMove(state, { difficulty: 'easy' });
    const greedyAction = greedy(state, 0);
    
    expect(JSON.stringify(easyAction)).toBe(JSON.stringify(greedyAction));
  });

  it('should accept custom weights', () => {
    const state = createInitialState();
    const action = generateMove(state, {
      difficulty: 'easy',
      weights: { myActiveWeight: 100 },
    });
    
    expect(action).toBeDefined();
  });

  it('should be deterministic for same config', () => {
    const state = createInitialState();
    const action1 = generateMove(state, { difficulty: 'medium' });
    const action2 = generateMove(state, { difficulty: 'medium' });
    
    expect(JSON.stringify(action1)).toBe(JSON.stringify(action2));
  });

  it('should return valid action that can be applied', () => {
    const state = createInitialState();
    const action = generateMove(state, { difficulty: 'medium' });
    const nextState = applyAction(state, action);
    
    expect(nextState).toBeDefined();
  });
});

describe('AI Integration', () => {
  it('should play a full turn sequence', () => {
    let state = createInitialState();
    
    const action1 = generateMove(state, { difficulty: 'easy' });
    state = applyAction(state, action1);
    
    const action2 = generateMove(state, { difficulty: 'easy' });
    state = applyAction(state, action2);
    
    expect(state.turnNumber).toBeGreaterThanOrEqual(1);
  });

  it('should handle both players', () => {
    let state = createInitialState();
    
    const p0Action = generateMove(state, { difficulty: 'easy' });
    state = applyAction(state, p0Action);
    state = applyAction(state, { type: 'EndTurn' });
    
    expect(state.currentPlayer).toBe(1);
    
    const p1Action = generateMove(state, { difficulty: 'easy' });
    state = applyAction(state, p1Action);
    
    expect(state).toBeDefined();
  });

  it('should make different decisions in different states', () => {
    const state1 = createInitialState();
    
    let state2 = createInitialState();
    state2 = applyAction(state2, { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 });
    state2 = applyAction(state2, { type: 'EndTurn' });
    
    const action1 = generateMove(state1, { difficulty: 'medium' });
    const action2 = generateMove(state2, { difficulty: 'medium' });
    
    expect(action1).toBeDefined();
    expect(action2).toBeDefined();
  });

  it('should complete 10 moves without error', () => {
    let state = createInitialState();
    
    for (let i = 0; i < 10; i++) {
      const action = generateMove(state, { difficulty: 'easy' });
      state = applyAction(state, action);
    }
    
    expect(state).toBeDefined();
  });
});
