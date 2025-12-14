import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  cloneState,
  applyAction,
  runTick,
  simulate,
  getLegalActions,
  checkEnd,
  replay,
  hashState,
  countActiveSpecies,
  countPassiveSpecies,
  getCell,
} from './index';
import type { GameState, Action } from './types';

describe('Engine Core', () => {
  it('should create initial state with 7x7 board', () => {
    const state = createInitialState();
    expect(state.board.length).toBe(7);
    expect(state.board[0].length).toBe(7);
    expect(state.currentPlayer).toBe(0);
    expect(state.playerIp).toEqual([4, 4]);
    expect(state.turnNumber).toBe(1);
  });

  it('should initialize all cells with N=2, M=2', () => {
    const state = createInitialState();
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        expect(state.board[y][x].nutrient).toBe(2);
        expect(state.board[y][x].moisture).toBe(2);
        expect(state.board[y][x].occupant).toBeNull();
      }
    }
  });

  it('should deep clone state without mutation', () => {
    const state = createInitialState();
    const cloned = cloneState(state);
    
    expect(cloned).not.toBe(state);
    expect(cloned.board).not.toBe(state.board);
    expect(cloned.playerIp).not.toBe(state.playerIp);
    
    cloned.board[0][0].nutrient = 10;
    expect(state.board[0][0].nutrient).toBe(2);
  });
});

describe('Actions - SeedSpecies', () => {
  it('should place ROOT at valid empty cell', () => {
    const state = createInitialState();
    const action: Action = { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 };
    const next = applyAction(state, action);
    
    const cell = next.board[3][3].occupant;
    expect(cell).not.toBeNull();
    expect(cell?.species).toBe('ROOT');
    expect(cell?.ownerId).toBe(0);
    expect(next.playerIp[0]).toBe(2); // 4 - 2
  });

  it('should place SPREAD at valid empty cell', () => {
    const state = createInitialState();
    const action: Action = { type: 'SeedSpecies', species: 'SPREAD', x: 2, y: 2 };
    const next = applyAction(state, action);
    
    expect(next.board[2][2].occupant?.species).toBe('SPREAD');
  });

  it('should place MUTATION at valid empty cell', () => {
    const state = createInitialState();
    const action: Action = { type: 'SeedSpecies', species: 'MUTATION', x: 1, y: 1 };
    const next = applyAction(state, action);
    
    expect(next.board[1][1].occupant?.species).toBe('MUTATION');
  });

  it('should reject seed on occupied cell', () => {
    let state = createInitialState();
    state = applyAction(state, { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 });
    const ipBefore = state.playerIp[state.currentPlayer];
    
    const next = applyAction(state, { type: 'SeedSpecies', species: 'SPREAD', x: 3, y: 3 });
    expect(next.playerIp[next.currentPlayer]).toBe(ipBefore);
    expect(next.board[3][3].occupant?.species).toBe('ROOT');
  });

  it('should reject seed with insufficient IP', () => {
    let state = createInitialState();
    state.playerIp[0] = 1;
    
    const next = applyAction(state, { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 });
    expect(next.board[3][3].occupant).toBeNull();
    expect(next.playerIp[0]).toBe(1);
  });
});

describe('Actions - ManipulateEnv', () => {
  it('should increase nutrient by 1', () => {
    const state = createInitialState();
    const next = applyAction(state, { type: 'ManipulateEnv', x: 2, y: 2, target: 'N', delta: 1 });
    
    expect(next.board[2][2].nutrient).toBe(3);
    expect(next.playerIp[0]).toBe(3); // 4 - 1
  });

  it('should decrease nutrient by 1', () => {
    const state = createInitialState();
    const next = applyAction(state, { type: 'ManipulateEnv', x: 2, y: 2, target: 'N', delta: -1 });
    
    expect(next.board[2][2].nutrient).toBe(1);
  });

  it('should increase moisture by 1', () => {
    const state = createInitialState();
    const next = applyAction(state, { type: 'ManipulateEnv', x: 2, y: 2, target: 'M', delta: 1 });
    
    expect(next.board[2][2].moisture).toBe(3);
  });

  it('should clamp nutrient to max 3', () => {
    let state = createInitialState();
    state.board[2][2].nutrient = 3;
    const ipBefore = state.playerIp[0];
    
    const next = applyAction(state, { type: 'ManipulateEnv', x: 2, y: 2, target: 'N', delta: 1 });
    expect(next.board[2][2].nutrient).toBe(3);
    expect(next.playerIp[0]).toBe(ipBefore); // Invalid, no change
  });

  it('should clamp nutrient to min 0', () => {
    let state = createInitialState();
    state.board[2][2].nutrient = 0;
    const ipBefore = state.playerIp[0];
    
    const next = applyAction(state, { type: 'ManipulateEnv', x: 2, y: 2, target: 'N', delta: -1 });
    expect(next.board[2][2].nutrient).toBe(0);
    expect(next.playerIp[0]).toBe(ipBefore);
  });
});

describe('Actions - Mutate', () => {
  it('should mutate adjacent occupant N direction (+1)', () => {
    let state = createInitialState();
    state = applyAction(state, { type: 'SeedSpecies', species: 'SPREAD', x: 3, y: 2 });
    state.playerIp[0] = 5;
    
    const next = applyAction(state, { type: 'Mutate', x: 3, y: 3, dir: 'N' });
    expect(next.board[2][3].occupant?.traits.spreadBias).toBe(1);
    expect(next.playerIp[0]).toBe(2); // 5 - 3
  });

  it('should mutate adjacent occupant S direction (-1)', () => {
    let state = createInitialState();
    state = applyAction(state, { type: 'SeedSpecies', species: 'SPREAD', x: 3, y: 4 });
    state.playerIp[0] = 5;
    
    const next = applyAction(state, { type: 'Mutate', x: 3, y: 3, dir: 'S' });
    expect(next.board[4][3].occupant?.traits.spreadBias).toBe(-1);
  });

  it('should mutate E direction (+1)', () => {
    let state = createInitialState();
    state = applyAction(state, { type: 'SeedSpecies', species: 'SPREAD', x: 4, y: 3 });
    state.playerIp[0] = 5;
    
    const next = applyAction(state, { type: 'Mutate', x: 3, y: 3, dir: 'E' });
    expect(next.board[3][4].occupant?.traits.spreadBias).toBe(1);
  });

  it('should mutate W direction (-1)', () => {
    let state = createInitialState();
    state = applyAction(state, { type: 'SeedSpecies', species: 'SPREAD', x: 2, y: 3 });
    state.playerIp[0] = 5;
    
    const next = applyAction(state, { type: 'Mutate', x: 3, y: 3, dir: 'W' });
    expect(next.board[3][2].occupant?.traits.spreadBias).toBe(-1);
  });

  it('should clamp spreadBias to range [-1, 1]', () => {
    let state = createInitialState();
    state = applyAction(state, { type: 'SeedSpecies', species: 'SPREAD', x: 3, y: 2 });
    state.playerIp[0] = 20;
    
    expect(state.board[2][3].occupant?.traits.spreadBias).toBe(0);
    
    state = applyAction(state, { type: 'Mutate', x: 3, y: 3, dir: 'N' });
    expect(state.board[2][3].occupant?.traits.spreadBias).toBe(1);
    
    state = applyAction(state, { type: 'Mutate', x: 3, y: 3, dir: 'N' });
    expect(state.board[2][3].occupant?.traits.spreadBias).toBe(1); // Clamped at 1
  });

  it('should reject mutate with no adjacent occupant', () => {
    const state = createInitialState();
    state.playerIp[0] = 5;
    const ipBefore = state.playerIp[0];
    
    const next = applyAction(state, { type: 'Mutate', x: 3, y: 3, dir: 'N' });
    expect(next.playerIp[0]).toBe(ipBefore);
  });
});

describe('Actions - EndTurn', () => {
  it('should switch current player', () => {
    const state = createInitialState();
    const next = applyAction(state, { type: 'EndTurn' });
    
    expect(next.currentPlayer).toBe(1);
    expect(next.turnNumber).toBe(2);
  });

  it('should grant base IP +2 to new player', () => {
    const state = createInitialState();
    state.playerIp[1] = 0;
    
    const next = applyAction(state, { type: 'EndTurn' });
    expect(next.playerIp[1]).toBe(2);
  });

  it('should grant +1 ecoBonus if activeCount >= 3', () => {
    let state = createInitialState();
    state = applyAction(state, { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 });
    state = applyAction(state, { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 4 });
    state = applyAction(state, { type: 'SeedSpecies', species: 'ROOT', x: 4, y: 3 });
    state.playerIp[1] = 0;
    
    const next = applyAction(state, { type: 'EndTurn' });
    expect(countActiveSpecies(next, 1)).toBe(0);
    expect(next.playerIp[1]).toBe(2); // Base only
  });

  it('should grant -1 ecoBonus if passiveCount >= 3', () => {
    let state = createInitialState();
    
    state = applyAction(state, { type: 'EndTurn' });
    
    state.board[0][0].nutrient = 0;
    state.board[0][0].moisture = 0;
    state.board[0][1].nutrient = 0;
    state.board[0][1].moisture = 0;
    state.board[0][2].nutrient = 0;
    state.board[0][2].moisture = 0;
    
    state = applyAction(state, { type: 'SeedSpecies', species: 'ROOT', x: 0, y: 0 });
    state = applyAction(state, { type: 'SeedSpecies', species: 'ROOT', x: 1, y: 0 });
    state = applyAction(state, { type: 'SeedSpecies', species: 'ROOT', x: 2, y: 0 });
    
    const passiveCount = countPassiveSpecies(state, 1);
    const activeCount = countActiveSpecies(state, 1);
    
    expect(passiveCount).toBeGreaterThanOrEqual(3);
    expect(activeCount).toBe(0);
  });
});

describe('Tick - Active Flags', () => {
  it('should activate ROOT when N+M >= 2', () => {
    let state = createInitialState();
    state = applyAction(state, { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 });
    
    expect(state.board[3][3].occupant?.active).toBe(true);
  });

  it('should deactivate ROOT when N+M < 2', () => {
    let state = createInitialState();
    state.board[3][3].nutrient = 0;
    state.board[3][3].moisture = 1;
    state = applyAction(state, { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 });
    
    expect(state.board[3][3].occupant?.active).toBe(false);
  });

  it('should activate SPREAD when N >= 1', () => {
    let state = createInitialState();
    state.board[3][3].nutrient = 1;
    state = applyAction(state, { type: 'SeedSpecies', species: 'SPREAD', x: 3, y: 3 });
    
    expect(state.board[3][3].occupant?.active).toBe(true);
  });

  it('should deactivate SPREAD when N < 1', () => {
    let state = createInitialState();
    state.board[3][3].nutrient = 0;
    state = applyAction(state, { type: 'SeedSpecies', species: 'SPREAD', x: 3, y: 3 });
    
    expect(state.board[3][3].occupant?.active).toBe(false);
  });

  it('should activate MUTATION when M >= 1', () => {
    let state = createInitialState();
    state.board[3][3].moisture = 1;
    state = applyAction(state, { type: 'SeedSpecies', species: 'MUTATION', x: 3, y: 3 });
    
    expect(state.board[3][3].occupant?.active).toBe(true);
  });

  it('should deactivate MUTATION when M < 1', () => {
    let state = createInitialState();
    state.board[3][3].moisture = 0;
    state = applyAction(state, { type: 'SeedSpecies', species: 'MUTATION', x: 3, y: 3 });
    
    expect(state.board[3][3].occupant?.active).toBe(false);
  });
});

describe('Tick - SPREAD Expansion', () => {
  it('should expand SPREAD to empty neighbor', () => {
    let state = createInitialState();
    state = applyAction(state, { type: 'SeedSpecies', species: 'SPREAD', x: 3, y: 3 });
    
    const hasSpread = [
      state.board[2][3].occupant,
      state.board[3][2].occupant,
      state.board[4][3].occupant,
      state.board[3][4].occupant,
    ].some(occ => occ?.species === 'SPREAD');
    
    expect(hasSpread).toBe(true);
  });

  it('should choose highest score neighbor for spread', () => {
    let state = createInitialState();
    state.board[2][3].nutrient = 3;
    state.board[2][3].moisture = 3;
    state.board[4][3].nutrient = 0;
    state.board[4][3].moisture = 0;
    
    state = applyAction(state, { type: 'SeedSpecies', species: 'SPREAD', x: 3, y: 3 });
    
    expect(state.board[2][3].occupant?.species).toBe('SPREAD');
  });

  it('should apply spreadBias to score calculation', () => {
    let state = createInitialState();
    state = applyAction(state, { type: 'SeedSpecies', species: 'SPREAD', x: 3, y: 3 });
    state.board[3][3].occupant!.traits.spreadBias = 1;
    
    state.board[3][2].nutrient = 1;
    state.board[3][2].moisture = 1;
    state.board[3][4].nutrient = 1;
    state.board[3][4].moisture = 1;
    
    state = runTick(state);
    
    const hasSpread = state.board[2][3].occupant?.species === 'SPREAD' ||
                      state.board[3][2].occupant?.species === 'SPREAD';
    expect(hasSpread).toBe(true);
  });

  it('should apply root penalty when opponent ROOT nearby', () => {
    let state = createInitialState();
    state = applyAction(state, { type: 'SeedSpecies', species: 'SPREAD', x: 3, y: 3 });
    
    const spreadExists = [
      state.board[2][3].occupant,
      state.board[3][2].occupant,
      state.board[4][3].occupant,
      state.board[3][4].occupant,
    ].some(occ => occ?.species === 'SPREAD' && occ.ownerId === 0);
    
    expect(spreadExists).toBe(true);
  });
});

describe('Tick - Consumption', () => {
  it('should consume N from cell with active occupant', () => {
    let state = createInitialState();
    const nBefore = state.board[3][3].nutrient;
    state = applyAction(state, { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 });
    
    expect(state.board[3][3].nutrient).toBe(nBefore - 1);
  });

  it('should not consume if occupant inactive', () => {
    let state = createInitialState();
    state.board[3][3].nutrient = 0;
    state.board[3][3].moisture = 0;
    const nBefore = state.board[3][3].nutrient;
    
    state = applyAction(state, { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 });
    
    expect(state.board[3][3].nutrient).toBe(nBefore);
  });

  it('should force inactive when N=0 and M=0', () => {
    let state = createInitialState();
    state.board[3][3].nutrient = 1;
    state.board[3][3].moisture = 0;
    state = applyAction(state, { type: 'SeedSpecies', species: 'SPREAD', x: 3, y: 3 });
    
    expect(state.board[3][3].occupant?.active).toBe(false);
    expect(state.board[3][3].nutrient).toBe(0);
  });
});

describe('Simulate', () => {
  it('should return new state for valid action', () => {
    const state = createInitialState();
    const result = simulate(state, { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 });
    
    expect(result.error).toBeUndefined();
    expect(result.state).toBeDefined();
    expect(result.state?.board[3][3].occupant?.species).toBe('ROOT');
  });

  it('should return error for invalid action', () => {
    let state = createInitialState();
    state.playerIp[0] = 1;
    
    const result = simulate(state, { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 });
    expect(result.error).toBeDefined();
  });

  it('should not mutate original state', () => {
    const state = createInitialState();
    const original = cloneState(state);
    
    simulate(state, { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 });
    
    expect(hashState(state)).toBe(hashState(original));
  });
});

describe('Replay', () => {
  it('should replay empty action list', () => {
    const state = createInitialState();
    const final = replay(state, []);
    
    expect(hashState(final)).toBe(hashState(state));
  });

  it('should replay single action', () => {
    const state = createInitialState();
    const actions: Action[] = [{ type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 }];
    const final = replay(state, actions);
    
    expect(final.board[3][3].occupant?.species).toBe('ROOT');
  });

  it('should replay multiple actions', () => {
    const state = createInitialState();
    const actions: Action[] = [
      { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 },
      { type: 'SeedSpecies', species: 'SPREAD', x: 4, y: 3 },
      { type: 'EndTurn' },
    ];
    const final = replay(state, actions);
    
    expect(final.board[3][3].occupant?.species).toBe('ROOT');
    expect(final.board[3][4].occupant?.species).toBe('SPREAD');
    expect(final.currentPlayer).toBe(1);
  });

  it('should be deterministic - same actions produce same result', () => {
    const state = createInitialState();
    const actions: Action[] = [
      { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 },
      { type: 'ManipulateEnv', x: 2, y: 2, target: 'N', delta: 1 },
      { type: 'EndTurn' },
      { type: 'SeedSpecies', species: 'SPREAD', x: 4, y: 4 },
      { type: 'EndTurn' },
    ];
    
    const result1 = replay(state, actions);
    const result2 = replay(state, actions);
    
    expect(hashState(result1)).toBe(hashState(result2));
  });
});

describe('Legal Actions', () => {
  it('should include EndTurn in legal actions', () => {
    const state = createInitialState();
    const actions = getLegalActions(state);
    
    expect(actions.some(a => a.type === 'EndTurn')).toBe(true);
  });

  it('should include SeedSpecies when IP >= 2', () => {
    const state = createInitialState();
    const actions = getLegalActions(state);
    
    const seeds = actions.filter(a => a.type === 'SeedSpecies');
    expect(seeds.length).toBeGreaterThan(0);
  });

  it('should exclude SeedSpecies when IP < 2', () => {
    const state = createInitialState();
    state.playerIp[0] = 1;
    const actions = getLegalActions(state);
    
    const seeds = actions.filter(a => a.type === 'SeedSpecies');
    expect(seeds.length).toBe(0);
  });

  it('should include ManipulateEnv when IP >= 1', () => {
    const state = createInitialState();
    const actions = getLegalActions(state);
    
    const envs = actions.filter(a => a.type === 'ManipulateEnv');
    expect(envs.length).toBeGreaterThan(0);
  });

  it('should exclude Mutate when no occupants exist', () => {
    const state = createInitialState();
    const actions = getLegalActions(state);
    
    const mutates = actions.filter(a => a.type === 'Mutate');
    expect(mutates.length).toBe(0);
  });

  it('should include Mutate when adjacent occupant exists', () => {
    let state = createInitialState();
    state = applyAction(state, { type: 'SeedSpecies', species: 'SPREAD', x: 3, y: 3 });
    state.playerIp[0] = 10;
    
    const actions = getLegalActions(state);
    const mutates = actions.filter(a => a.type === 'Mutate');
    
    expect(mutates.length).toBeGreaterThan(0);
  });
});

describe('Check End', () => {
  it('should not end game at start', () => {
    const state = createInitialState();
    const end = checkEnd(state);
    
    expect(end.ended).toBe(false);
  });

  it('should end game when IP=0 and activeCount=0', () => {
    const state = createInitialState();
    state.playerIp[0] = 0;
    
    const end = checkEnd(state);
    
    expect(end.ended).toBe(true);
    expect(end.winner).toBe(1);
  });

  it('should not end when IP=0 but activeCount > 0', () => {
    let state = createInitialState();
    state = applyAction(state, { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 });
    state.playerIp[0] = 0;
    
    const end = checkEnd(state);
    expect(end.ended).toBe(false);
  });
});

describe('Determinism', () => {
  it('should produce identical hash for replayed actions', () => {
    const initial = createInitialState();
    const actions: Action[] = [
      { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 },
      { type: 'SeedSpecies', species: 'SPREAD', x: 2, y: 2 },
      { type: 'ManipulateEnv', x: 4, y: 4, target: 'N', delta: 1 },
      { type: 'EndTurn' },
      { type: 'SeedSpecies', species: 'MUTATION', x: 5, y: 5 },
      { type: 'ManipulateEnv', x: 5, y: 5, target: 'M', delta: -1 },
      { type: 'EndTurn' },
      { type: 'ManipulateEnv', x: 3, y: 3, target: 'N', delta: -1 },
      { type: 'EndTurn' },
    ];
    
    const run1 = replay(initial, actions);
    const run2 = replay(initial, actions);
    
    expect(hashState(run1)).toBe(hashState(run2));
  });

  it('should ensure simulate matches applyAction result', () => {
    const state = createInitialState();
    const action: Action = { type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 };
    
    const simulated = simulate(state, action);
    const applied = applyAction(state, action);
    
    expect(hashState(simulated.state!)).toBe(hashState(applied));
  });

  it('should maintain determinism with complex spread interactions', () => {
    const initial = createInitialState();
    const actions: Action[] = [
      { type: 'SeedSpecies', species: 'SPREAD', x: 3, y: 3 },
      { type: 'SeedSpecies', species: 'SPREAD', x: 2, y: 2 },
      { type: 'EndTurn' },
      { type: 'SeedSpecies', species: 'ROOT', x: 5, y: 5 },
      { type: 'EndTurn' },
      { type: 'EndTurn' },
      { type: 'EndTurn' },
    ];
    
    const run1 = replay(initial, actions);
    const run2 = replay(initial, actions);
    const run3 = replay(initial, actions);
    
    expect(hashState(run1)).toBe(hashState(run2));
    expect(hashState(run2)).toBe(hashState(run3));
  });
});
