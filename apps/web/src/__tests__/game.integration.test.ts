import { describe, it, expect } from 'vitest';
import { GameEngine } from '../lib/game/engineFacade';
import { GameAI } from '../lib/game/aiFacade';
import { CommitPipeline } from '../lib/game/commit';
import { ActionAdapter } from '../lib/game/actionAdapter';
import { serializeReplay, deserializeReplay } from '../lib/game/replayModel';
import { calculateDiff } from '../lib/game/diff';

describe('Game Integration Tests', () => {
  describe('Engine facade', () => {
    it('creates a valid initial state', () => {
      const state = GameEngine.createInitialState();
      expect(state).toBeDefined();
      expect(state.currentPlayer).toBe(0);
      expect(state.playerIp).toEqual([4, 4]);
      expect(state.turnNumber).toBe(1);
      expect(state.board).toHaveLength(7);
      expect(state.board[0]).toHaveLength(7);
    });

    it('returns legal actions for a new game', () => {
      const state = GameEngine.createInitialState();
      const actions = GameEngine.getLegalActions(state);
      expect(actions.length).toBeGreaterThan(0);
      expect(actions.some((a) => a.type === 'EndTurn')).toBe(true);
    });

    it('applies EndTurn and advances turn', () => {
      const state = GameEngine.createInitialState();
      const endTurn = ActionAdapter.endTurn();
      const next = GameEngine.applyAction(state, endTurn);
      expect(next.currentPlayer).toBe(1);
      expect(next.turnNumber).toBe(2);
    });

    it('clones state without reference sharing', () => {
      const state = GameEngine.createInitialState();
      const clone = GameEngine.cloneState(state);
      expect(clone).not.toBe(state);
      expect(clone.playerIp).not.toBe(state.playerIp);
      expect(clone.board).not.toBe(state.board);
      expect(clone).toEqual(state);
    });

    it('simulates an action without mutating original state', () => {
      const state = GameEngine.createInitialState();
      const endTurn = ActionAdapter.endTurn();
      const result = GameEngine.simulateAction(state, endTurn);
      expect(result.state).toBeDefined();
      expect(state.currentPlayer).toBe(0);
      expect(result.state!.currentPlayer).toBe(1);
    });

    it('checkGameEnd returns not-ended for a fresh game', () => {
      const state = GameEngine.createInitialState();
      const end = GameEngine.checkGameEnd(state);
      expect(end.ended).toBe(false);
    });

    it('checkGameEnd returns ended when player has no IP and no active species', () => {
      const state = GameEngine.createInitialState();
      const zeroIPNoSpecies = { ...state, playerIp: [0, 4] as [number, number] };
      const end = GameEngine.checkGameEnd(zeroIPNoSpecies);
      expect(end.ended).toBe(true);
      expect(end.winner).toBe(1);
    });
  });

  describe('ActionAdapter', () => {
    it('builds SeedSpecies action', () => {
      const action = ActionAdapter.seedSpecies('ROOT', 3, 3);
      expect(action).toEqual({ type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 });
    });

    it('builds ManipulateEnv action', () => {
      const action = ActionAdapter.manipulateEnv(2, 2, 'N', 1);
      expect(action).toEqual({ type: 'ManipulateEnv', x: 2, y: 2, target: 'N', delta: 1 });
    });

    it('builds Mutate action', () => {
      const action = ActionAdapter.mutate(1, 1, 'E');
      expect(action).toEqual({ type: 'Mutate', x: 1, y: 1, dir: 'E' });
    });

    it('builds EndTurn action', () => {
      const action = ActionAdapter.endTurn();
      expect(action).toEqual({ type: 'EndTurn' });
    });

    it('validates SeedSpecies action', () => {
      expect(
        ActionAdapter.validateAction({ type: 'SeedSpecies', species: 'ROOT', x: 3, y: 3 })
      ).toBe(true);
    });

    it('validates EndTurn action', () => {
      expect(ActionAdapter.validateAction({ type: 'EndTurn' })).toBe(true);
    });

    it('validates ManipulateEnv action', () => {
      expect(
        ActionAdapter.validateAction({ type: 'ManipulateEnv', x: 0, y: 0, target: 'N', delta: 1 })
      ).toBe(true);
    });

    it('validates Mutate action', () => {
      expect(ActionAdapter.validateAction({ type: 'Mutate', x: 0, y: 0, dir: 'N' })).toBe(true);
    });
  });

  describe('AI facade', () => {
    it('easy difficulty produces a legal action', () => {
      const state = GameEngine.createInitialState();
      const action = GameAI.chooseActionEasy(state);
      const legal = GameEngine.getLegalActions(state);
      expect(legal.some((a) => JSON.stringify(a) === JSON.stringify(action))).toBe(true);
    });

    it('medium difficulty produces a legal action', () => {
      const state = GameEngine.createInitialState();
      const action = GameAI.chooseActionMedium(state);
      const legal = GameEngine.getLegalActions(state);
      expect(legal.some((a) => JSON.stringify(a) === JSON.stringify(action))).toBe(true);
    });
  });

  describe('CommitPipeline', () => {
    it('commits a legal EndTurn action', () => {
      const state = GameEngine.createInitialState();
      const action = ActionAdapter.endTurn();
      const result = CommitPipeline.commitAction(state, action, [state], []);
      expect(result.success).toBe(true);
      expect(result.newState!.currentPlayer).toBe(1);
      expect(result.logs!.length).toBeGreaterThan(0);
    });

    it('logs SeedSpecies action description', () => {
      const state = GameEngine.createInitialState();
      const action = ActionAdapter.seedSpecies('SPREAD', 2, 2);
      const result = CommitPipeline.commitAction(state, action, [state], []);
      expect(result.success).toBe(true);
      expect(result.logs!.some((l) => l.includes('SeedSpecies'))).toBe(true);
    });

    it('logs ManipulateEnv action description', () => {
      const state = GameEngine.createInitialState();
      const action = ActionAdapter.manipulateEnv(0, 0, 'N', 1);
      const result = CommitPipeline.commitAction(state, action, [state], []);
      expect(result.success).toBe(true);
      expect(result.logs!.some((l) => l.includes('ManipulateEnv'))).toBe(true);
    });

    it('rejects an illegal action', () => {
      const state = GameEngine.createInitialState();
      const illegalMutate = ActionAdapter.mutate(0, 0, 'N');
      const legalActions = GameEngine.getLegalActions(state);
      const isLegal = legalActions.some((a) => JSON.stringify(a) === JSON.stringify(illegalMutate));
      if (!isLegal) {
        const result = CommitPipeline.commitAction(state, illegalMutate, [], []);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      }
    });
  });

  describe('PvE game loop', () => {
    it('player EndTurn triggers AI response and state changes', () => {
      const initialState = GameEngine.createInitialState();

      const playerAction = ActionAdapter.endTurn();
      const playerResult = CommitPipeline.commitAction(
        initialState,
        playerAction,
        [initialState],
        ['Game started']
      );
      expect(playerResult.success).toBe(true);
      expect(playerResult.newState!.currentPlayer).toBe(1);

      const aiAction = GameAI.chooseAction(playerResult.newState!, 'easy');
      expect(aiAction).toBeDefined();

      const aiResult = CommitPipeline.commitAction(
        playerResult.newState!,
        aiAction,
        playerResult.history!,
        playerResult.logs!
      );
      expect(aiResult.success).toBe(true);
      expect(JSON.stringify(aiResult.newState)).not.toBe(JSON.stringify(playerResult.newState));
    });

    it('AI medium difficulty produces a valid action', () => {
      const state = GameEngine.createInitialState();
      const action = GameAI.chooseAction(state, 'medium');
      expect(action).toBeDefined();
      const legal = GameEngine.getLegalActions(state);
      expect(legal.some((a) => JSON.stringify(a) === JSON.stringify(action))).toBe(true);
    });
  });

  describe('Diff utility', () => {
    it('detects new occupant when seeding', () => {
      const state = GameEngine.createInitialState();
      const action = ActionAdapter.seedSpecies('ROOT', 3, 3);
      const result = GameEngine.simulateAction(state, action);
      if (result.state) {
        const diff = calculateDiff(state, result.state);
        expect(diff.cells.some((c) => c.x === 3 && c.y === 3 && c.type === 'new')).toBe(true);
      }
    });

    it('returns empty diff for identical states', () => {
      const state = GameEngine.createInitialState();
      const clone = GameEngine.cloneState(state);
      const diff = calculateDiff(state, clone);
      expect(diff.cells).toHaveLength(0);
      expect(diff.ipDelta).toBe(0);
    });

    it('reports ipDelta correctly', () => {
      const state = GameEngine.createInitialState();
      const action = ActionAdapter.seedSpecies('ROOT', 3, 3);
      const result = GameEngine.simulateAction(state, action);
      if (result.state) {
        const diff = calculateDiff(state, result.state);
        expect(diff.ipDelta).toBe(-2);
      }
    });

    it('detects removed occupant type', () => {
      const base = GameEngine.createInitialState();
      const withOcc = {
        ...GameEngine.cloneState(base),
        board: base.board.map((row, y) =>
          row.map((cell, x) =>
            x === 2 && y === 2
              ? {
                  ...cell,
                  occupant: {
                    ownerId: 0 as const,
                    species: 'ROOT' as const,
                    traits: { spreadBias: 0 as const, envTolerance: 0 as const },
                    active: true,
                  },
                }
              : cell
          )
        ),
      };
      const withoutOcc = {
        ...GameEngine.cloneState(withOcc),
        board: withOcc.board.map((row, y) =>
          row.map((cell, x) => (x === 2 && y === 2 ? { ...cell, occupant: null } : cell))
        ),
      };
      const diff = calculateDiff(withOcc, withoutOcc);
      expect(diff.cells.some((c) => c.type === 'removed')).toBe(true);
    });

    it('detects activated occupant type', () => {
      const base = GameEngine.createInitialState();
      const inactive = {
        ...GameEngine.cloneState(base),
        board: base.board.map((row, y) =>
          row.map((cell, x) =>
            x === 1 && y === 1
              ? {
                  ...cell,
                  occupant: {
                    ownerId: 0 as const,
                    species: 'ROOT' as const,
                    traits: { spreadBias: 0 as const, envTolerance: 0 as const },
                    active: false,
                  },
                }
              : cell
          )
        ),
      };
      const active = {
        ...GameEngine.cloneState(inactive),
        board: inactive.board.map((row, y) =>
          row.map((cell, x) =>
            x === 1 && y === 1 && cell.occupant
              ? { ...cell, occupant: { ...cell.occupant, active: true } }
              : cell
          )
        ),
      };
      expect(calculateDiff(inactive, active).cells.some((c) => c.type === 'activated')).toBe(true);
    });

    it('detects deactivated occupant type', () => {
      const base = GameEngine.createInitialState();
      const active = {
        ...GameEngine.cloneState(base),
        board: base.board.map((row, y) =>
          row.map((cell, x) =>
            x === 1 && y === 1
              ? {
                  ...cell,
                  occupant: {
                    ownerId: 0 as const,
                    species: 'ROOT' as const,
                    traits: { spreadBias: 0 as const, envTolerance: 0 as const },
                    active: true,
                  },
                }
              : cell
          )
        ),
      };
      const deactive = {
        ...GameEngine.cloneState(active),
        board: active.board.map((row, y) =>
          row.map((cell, x) =>
            x === 1 && y === 1 && cell.occupant
              ? { ...cell, occupant: { ...cell.occupant, active: false } }
              : cell
          )
        ),
      };
      expect(calculateDiff(active, deactive).cells.some((c) => c.type === 'deactivated')).toBe(
        true
      );
    });

    it('detects modified type when occupant traits changed', () => {
      const base = GameEngine.createInitialState();
      const withOcc = {
        ...GameEngine.cloneState(base),
        board: base.board.map((row, y) =>
          row.map((cell, x) =>
            x === 0 && y === 0
              ? {
                  ...cell,
                  occupant: {
                    ownerId: 0 as const,
                    species: 'ROOT' as const,
                    traits: { spreadBias: 0 as const, envTolerance: 0 as const },
                    active: true,
                  },
                }
              : cell
          )
        ),
      };
      const mutated = {
        ...GameEngine.cloneState(withOcc),
        board: withOcc.board.map((row, y) =>
          row.map((cell, x) =>
            x === 0 && y === 0 && cell.occupant
              ? {
                  ...cell,
                  occupant: {
                    ...cell.occupant,
                    traits: { spreadBias: 1 as const, envTolerance: 0 as const },
                  },
                }
              : cell
          )
        ),
      };
      expect(calculateDiff(withOcc, mutated).cells.some((c) => c.type === 'modified')).toBe(true);
    });

    it('detects env-only change without occupant', () => {
      const base = GameEngine.createInitialState();
      const changed = {
        ...GameEngine.cloneState(base),
        board: base.board.map((row, y) =>
          row.map((cell, x) => (x === 4 && y === 4 ? { ...cell, nutrient: 3 } : cell))
        ),
      };
      expect(
        calculateDiff(base, changed).cells.some(
          (c) => c.x === 4 && c.y === 4 && c.type === 'modified'
        )
      ).toBe(true);
    });
  });

  describe('Replay roundtrip', () => {
    it('serialize then deserialize then replay yields same final state', () => {
      const initialState = GameEngine.createInitialState();
      const actions = [ActionAdapter.endTurn(), ActionAdapter.endTurn()];
      const finalState = GameEngine.replayFromState(initialState, actions);
      const json = serializeReplay(initialState, actions, null, 'easy');
      expect(json).toBeTruthy();
      const parsed = deserializeReplay(json);
      expect('error' in parsed).toBe(false);
      const replay = parsed as Exclude<typeof parsed, { error: string }>;
      const replayed = GameEngine.replayFromState(replay.initialState, replay.actions);
      expect(JSON.stringify(replayed)).toBe(JSON.stringify(finalState));
    });

    it('deserialize returns error for invalid JSON', () => {
      expect('error' in deserializeReplay('not json')).toBe(true);
    });

    it('deserialize returns error for missing fields', () => {
      expect('error' in deserializeReplay(JSON.stringify({ foo: 'bar' }))).toBe(true);
    });
  });

  describe('Determinism', () => {
    it('replaying same actions twice yields identical final states', () => {
      const initialState = GameEngine.createInitialState();
      const actions = [ActionAdapter.endTurn(), ActionAdapter.endTurn()];
      const state1 = GameEngine.replayFromState(initialState, actions);
      const state2 = GameEngine.replayFromState(initialState, actions);
      expect(JSON.stringify(state1)).toBe(JSON.stringify(state2));
    });
  });
});
