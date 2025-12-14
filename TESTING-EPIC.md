# Epic: Testing Infrastructure & Code Coverage

**Epic ID:** EPIC-001  
**Title:** Testing Infrastructure & 90% Code Coverage  
**Status:** 🔴 Not Started  
**Priority:** 🔥 Critical  
**Created:** 2025-12-14

## Overview

Establish comprehensive testing infrastructure with 90% code coverage before any production deployment. Implement pre-commit hooks to enforce test requirements.

## Business Value

- **Quality Assurance:** Catch bugs before deployment
- **Confidence:** Safe refactoring and feature additions
- **Documentation:** Tests serve as living documentation
- **CI/CD:** Enable automated testing in pipelines
- **Developer Experience:** Fast feedback loop

## Goals

1. ✅ 90% code coverage minimum
2. ✅ Pre-commit test validation
3. ✅ Unit, integration, and E2E tests
4. ✅ Test infrastructure for all packages
5. ✅ CI/CD integration

## Acceptance Criteria

- [ ] Code coverage ≥ 90% across all packages
- [ ] Pre-commit hooks block commits if tests fail
- [ ] All critical paths have integration tests
- [ ] Test documentation complete
- [ ] CI pipeline runs all tests
- [ ] Performance benchmarks established

---

## Sprint Breakdown

### Sprint T1: Test Infrastructure Setup (Week 1)

**Goal:** Establish testing foundation and tooling

#### T1.1: Testing Framework Setup
**Estimate:** 4h  
**Files:**
- `jest.config.js` (root + packages)
- `vitest.config.ts` (alternative for web)
- `.github/workflows/test.yml`
- `scripts/test-coverage.sh`

**Tasks:**
- Install Jest/Vitest + React Testing Library
- Configure coverage thresholds (90%)
- Setup test scripts in package.json
- Configure GitHub Actions test workflow

**Acceptance:**
- [ ] `pnpm test` runs all tests
- [ ] `pnpm test:coverage` shows coverage report
- [ ] Coverage thresholds enforced
- [ ] Tests run in CI

---

#### T1.2: Pre-commit Hooks with Husky
**Estimate:** 2h  
**Files:**
- `.husky/pre-commit`
- `.husky/pre-push`
- `.lintstagedrc.js`

**Tasks:**
- Install husky + lint-staged
- Configure pre-commit: lint + test changed files
- Configure pre-push: full test suite
- Add git hooks to repository

**Acceptance:**
- [ ] Commits blocked if tests fail
- [ ] Only changed files tested on commit
- [ ] Full suite runs on push
- [ ] Documentation updated

---

#### T1.3: Test Utilities & Helpers
**Estimate:** 3h  
**Files:**
- `packages/engine/src/__tests__/testUtils.ts`
- `packages/ai/src/__tests__/testUtils.ts`
- `apps/web/src/__tests__/testUtils.tsx`
- `apps/web/src/__tests__/setupTests.ts`

**Tasks:**
- Create test data factories
- Mock implementations for engine/AI
- React testing utilities
- Setup file for test environment

**Acceptance:**
- [ ] Factory functions for GameState, Actions
- [ ] Mock implementations available
- [ ] Test utilities well-documented
- [ ] Example tests demonstrating usage

---

### Sprint T2: Unit Tests (Week 2)

**Goal:** Achieve 90% coverage on core packages

#### T2.1: Engine Package Tests
**Estimate:** 8h  
**Target Coverage:** 95%  
**Files:**
- `packages/engine/src/__tests__/state.test.ts`
- `packages/engine/src/__tests__/actions.test.ts`
- `packages/engine/src/__tests__/tick.test.ts`
- `packages/engine/src/__tests__/simulate.test.ts`
- `packages/engine/src/__tests__/legalActions.test.ts`
- `packages/engine/src/__tests__/endgame.test.ts`
- `packages/engine/src/__tests__/replay.test.ts`

**Test Categories:**
- **State Management:** createInitialState, cloneState
- **Action Application:** applyAction validation
- **Game Tick:** runTick, environment updates
- **Simulation:** simulate without side effects
- **Legal Moves:** getLegalActions edge cases
- **Endgame:** checkEnd all victory conditions
- **Replay:** replay determinism

**Acceptance:**
- [ ] All exported functions tested
- [ ] Edge cases covered
- [ ] Error conditions tested
- [ ] Coverage ≥ 95%

---

#### T2.2: AI Package Tests
**Estimate:** 6h  
**Target Coverage:** 90%  
**Files:**
- `packages/ai/src/__tests__/evaluation.test.ts`
- `packages/ai/src/__tests__/algorithms.test.ts`
- `packages/ai/src/__tests__/integration.test.ts`

**Test Categories:**
- **Evaluation:** evaluateState scoring
- **Greedy:** chooseActionGreedy selection
- **Minimax:** chooseMinimax with depth limits
- **Performance:** Time budget compliance
- **Integration:** Full AI turn execution

**Acceptance:**
- [ ] All algorithms tested
- [ ] Performance benchmarks
- [ ] Difficulty levels validated
- [ ] Coverage ≥ 90%

---

#### T2.3: Web App Unit Tests
**Estimate:** 10h  
**Target Coverage:** 90%  
**Files:**
- `apps/web/src/lib/game/__tests__/engineFacade.test.ts`
- `apps/web/src/lib/game/__tests__/aiFacade.test.ts`
- `apps/web/src/lib/game/__tests__/actionAdapter.test.ts`
- `apps/web/src/lib/game/__tests__/commit.test.ts`
- `apps/web/src/store/__tests__/gameStore.test.ts`

**Test Categories:**
- **Facades:** Engine/AI wrapper functions
- **Action Adapter:** UI to engine conversion
- **Commit Pipeline:** Validation and application
- **Game Store:** State management actions

**Acceptance:**
- [ ] All facades tested
- [ ] Store actions covered
- [ ] Error handling validated
- [ ] Coverage ≥ 90%

---

### Sprint T3: Integration & E2E Tests (Week 3)

**Goal:** Test complete workflows and user journeys

#### T3.1: Integration Tests
**Estimate:** 8h  
**Files:**
- `apps/web/src/__tests__/integration/gameFlow.test.ts`
- `apps/web/src/__tests__/integration/aiInteraction.test.ts`
- `apps/web/src/__tests__/integration/replay.test.ts`

**Test Scenarios:**
1. **Complete Game Flow:**
   - New game → Player move → AI response → Repeat → End
   - Validate state transitions
   - Verify history tracking

2. **AI Interaction:**
   - Player commits → AI turn triggered
   - AI difficulty affects moves
   - AI respects time budget

3. **Replay System:**
   - Export replay → Import → Replay → Same result
   - Determinism validation

**Acceptance:**
- [ ] Full game cycles tested
- [ ] AI integration verified
- [ ] Replay roundtrip works
- [ ] No UI rendering (pure logic)

---

#### T3.2: Component Tests
**Estimate:** 10h  
**Files:**
- `apps/web/src/components/__tests__/GameScreen.test.tsx`
- `apps/web/src/components/__tests__/BoardGrid.test.tsx`
- `apps/web/src/components/__tests__/Cell.test.tsx`
- `apps/web/src/components/__tests__/HUD.test.tsx`
- `apps/web/src/components/__tests__/ActionPalette.test.tsx`

**Test Categories:**
- **Rendering:** Components render without errors
- **User Interaction:** Button clicks, input changes
- **State Integration:** Zustand store integration
- **Accessibility:** ARIA labels, keyboard nav

**Acceptance:**
- [ ] All components tested
- [ ] User interactions covered
- [ ] Store integration validated
- [ ] Accessibility checks pass

---

#### T3.3: E2E Tests (Optional - Playwright)
**Estimate:** 12h  
**Files:**
- `e2e/gamePlay.spec.ts`
- `e2e/aiOpponent.spec.ts`
- `e2e/replay.spec.ts`
- `playwright.config.ts`

**Test Scenarios:**
1. User can start new game
2. User can make moves
3. AI responds automatically
4. Game detects win condition
5. Replay export/import works

**Acceptance:**
- [ ] Critical user flows tested
- [ ] Tests run in CI
- [ ] Screenshots on failure
- [ ] Documentation complete

---

### Sprint T4: Performance & Documentation (Week 4)

**Goal:** Performance benchmarks and test documentation

#### T4.1: Performance Benchmarks
**Estimate:** 6h  
**Files:**
- `packages/engine/src/__tests__/benchmarks/performance.bench.ts`
- `packages/ai/src/__tests__/benchmarks/performance.bench.ts`
- `scripts/benchmark.sh`

**Benchmarks:**
- Engine tick performance (< 10ms)
- AI move generation (< 1s)
- Replay performance (100 turns < 100ms)
- State clone performance

**Acceptance:**
- [ ] Benchmarks established
- [ ] Performance regression detection
- [ ] Results tracked in CI

---

#### T4.2: Test Documentation
**Estimate:** 4h  
**Files:**
- `TESTING.md`
- Update `CONTRIBUTING.md`
- Update `README.md`

**Content:**
- Testing philosophy
- How to run tests
- How to write tests
- Coverage requirements
- Pre-commit hooks guide
- CI/CD integration

**Acceptance:**
- [ ] Comprehensive test guide
- [ ] Examples provided
- [ ] Contributing guide updated
- [ ] README badges added

---

## Test Coverage Targets

| Package | Target | Priority |
|---------|--------|----------|
| @entropy-garden/engine | 95% | 🔥 Critical |
| @entropy-garden/ai | 90% | 🔥 Critical |
| apps/web (lib) | 90% | 🔥 Critical |
| apps/web (components) | 85% | ⚠️ High |
| apps/web (store) | 95% | 🔥 Critical |

**Overall Target:** ≥ 90%

---

## Technical Stack

### Testing Frameworks
- **Unit Tests:** Jest (Node) / Vitest (Web)
- **Component Tests:** React Testing Library
- **E2E Tests:** Playwright (optional)
- **Coverage:** c8 / Istanbul

### Quality Tools
- **Pre-commit:** Husky + lint-staged
- **Coverage Enforcement:** Jest/Vitest thresholds
- **CI/CD:** GitHub Actions

### Utilities
- **Mocking:** jest.mock / vi.mock
- **Assertions:** expect (Jest/Vitest)
- **Test Data:** Factory functions

---

## Dependencies

### Required
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "vitest": "^1.0.4",
    "@vitest/coverage-v8": "^1.0.4",
    "happy-dom": "^12.10.3",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0"
  }
}
```

### Optional (E2E)
```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.1"
  }
}
```

---

## Success Metrics

- ✅ Code coverage ≥ 90%
- ✅ All tests pass in CI
- ✅ Pre-commit hooks prevent bad commits
- ✅ Test execution time < 30s (unit + integration)
- ✅ Zero flaky tests
- ✅ Developer satisfaction with test DX

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Slow test execution | Developer frustration | Parallelize tests, optimize setup |
| Flaky tests | CI instability | Strict timeouts, deterministic data |
| Low adoption | Poor coverage | Documentation, examples, enforcement |
| E2E complexity | Time overrun | Start with integration tests first |

---

## Timeline

- **Week 1:** Test infrastructure (T1.1-T1.3)
- **Week 2:** Unit tests (T2.1-T2.3)
- **Week 3:** Integration tests (T3.1-T3.2)
- **Week 4:** Performance & docs (T4.1-T4.2)

**Total Estimate:** 73 hours (~2 weeks focused work)

---

## GitHub Issues

Create issues for each task:
- [ ] #10 - T1.1: Testing Framework Setup
- [ ] #11 - T1.2: Pre-commit Hooks
- [ ] #12 - T1.3: Test Utilities
- [ ] #13 - T2.1: Engine Package Tests
- [ ] #14 - T2.2: AI Package Tests
- [ ] #15 - T2.3: Web App Unit Tests
- [ ] #16 - T3.1: Integration Tests
- [ ] #17 - T3.2: Component Tests
- [ ] #18 - T4.1: Performance Benchmarks
- [ ] #19 - T4.2: Test Documentation

---

## Notes

- Testing epic is **critical path** before v0.2.0 release
- All future PRs must maintain 90% coverage
- Tests are documentation - write them clearly
- Prioritize critical paths first (engine, AI, store)

---

**Epic Owner:** Development Team  
**Stakeholders:** All contributors  
**Review Date:** After Sprint T2 completion
