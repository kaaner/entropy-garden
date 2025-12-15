# Onboarding & Tutorial System - Epic Breakdown

**Epic Goal:** Create a comprehensive onboarding flow that teaches players game mechanics through a progressive tutorial system.

**Status:** Planning  
**Priority:** High  
**Sprint:** 2.5 (Bridge between Sprint 2 and 3)

---

## 🎯 User Stories

### US-1: First-Time User Experience
**As a** first-time player  
**I want** to understand what the game is about before playing  
**So that** I can decide if I want to learn the mechanics

**Acceptance Criteria:**
- Landing page explains game concept (30 seconds read)
- Clear visual identity and theme
- Simple "Start Tutorial" or "Skip to Game" options
- One-time experience (localStorage flag)

---

### US-2: Interactive Tutorial
**As a** new player  
**I want** to learn game mechanics step-by-step through guided actions  
**So that** I can understand how to play without reading documentation

**Acceptance Criteria:**
- Tutorial teaches: Seed, Environment, Mutate, IP system, Win conditions
- Player must perform each action to proceed
- Clear visual feedback for correct/incorrect actions
- Can skip tutorial at any step
- Progress saved (can resume)

---

### US-3: Quick Reference
**As a** returning player  
**I want** quick access to rules and action costs  
**So that** I can refresh my memory without replaying tutorial

**Acceptance Criteria:**
- Collapsible help panel in game screen
- Action cost reference table
- Win condition reminder
- Keyboard shortcut (? or H)

---

## 📋 Task Breakdown

### TASK-1: Landing Page Architecture ✅ COMPLETED
**PR Title:** `feat: Add landing page with game introduction`  
**Labels:** `enhancement`, `ui`, `onboarding`  
**Estimated:** 2h  
**Actual:** 1.5h  
**Status:** ✅ **MERGED** (2025-12-15)

**Description:**
Create a dedicated landing page route that serves as entry point for new users.

**Implementation Summary:**
- Created `/` landing page with hero section and CTAs
- Moved game screen to `/game` route
- Built onboarding utilities with localStorage persistence
- Implemented smart CTA logic (first-time vs returning users)
- Added 13 unit tests (all passing)
- Zero breaking changes to existing game functionality

**Files Added:**
- `src/app/page.tsx` - Landing page component
- `src/app/game/page.tsx` - Game route wrapper
- `src/lib/onboarding.ts` - Onboarding utilities
- `src/__tests__/onboarding.test.ts` - Unit tests

**Definition of Done:**
- [x] Landing page renders with game intro
- [x] "Start Tutorial" button navigates to /game?tutorial=true
- [x] "Play Now" button navigates to /game
- [x] Returning users see "Continue" instead of tutorial
- [x] Tests pass (17/17 total)
- [x] Responsive design (mobile-friendly)

**PR:** See `apps/web/TASK-1-PR.md` for detailed review notes

---

### TASK-2: Tutorial State Management ✅ COMPLETED
**PR Title:** `feat: Add tutorial state management with Zustand`  
**Labels:** `enhancement`, `state`, `onboarding`  
**Estimated:** 1.5h  
**Actual:** 1h  
**Status:** ✅ **COMPLETED** (2025-12-15)

**Description:**
Create a dedicated Zustand store for tutorial progress and orchestration.

**Implementation Summary:**
- Created tutorialStore.ts with complete state management
- Implemented 8 actions (start, next, prev, skip, complete, reset, etc.)
- Custom localStorage serialization for Set<number>
- Query param integration (?tutorial=true)
- Helper functions for progress and step checking
- 24 comprehensive unit tests (all passing)

**Files Added:**
- `src/store/tutorialStore.ts` - Tutorial store (170 lines)
- `src/types/tutorial.ts` - TypeScript types (65 lines)
- `src/__tests__/tutorialStore.test.ts` - Tests (322 lines)

**Files Modified:**
- `src/app/game/page.tsx` - Query param handling

**Definition of Done:**
- [x] tutorialStore implements all actions
- [x] State persists across page reloads
- [x] Can start, pause, resume, skip tutorial
- [x] Tests verify state machine logic (24 tests)
- [x] No memory leaks (cleanup on unmount)

**PR:** See `apps/web/TASK-2-PR.md` for detailed review notes

---

### TASK-3: Tutorial Step Definitions
**PR Title:** `feat: Define tutorial step content and validation`  
**Labels:** `enhancement`, `content`, `onboarding`  
**Estimated:** 2h

**Description:**
Define tutorial curriculum with step-by-step instructions and validation logic.

**Technical Scope:**
1. Create tutorial step schema:
   ```ts
   interface TutorialStep {
     id: number;
     title: string;
     description: string;
     instruction: string;
     highlightTarget?: string; // CSS selector or component ID
     expectedAction?: Action; // What player should do
     validationFn?: (gameState: GameState) => boolean;
     autoAdvance?: boolean;
     canSkip: boolean;
   }
   ```

2. Define 8 core steps:
   - Step 0: Welcome & Objective
   - Step 1: Understanding the Board (N, M, IP)
   - Step 2: Seed Your First ROOT Species
   - Step 3: Observe Tick Cycle (EndTurn)
   - Step 4: Manipulate Environment (+N or +M)
   - Step 5: Use SPREAD Species
   - Step 6: Use MUTATION Species
   - Step 7: Understand Win Conditions
   - Step 8: Tutorial Complete

3. Validation logic for each step
4. Error hints for wrong actions

**Files to Create/Modify:**
- `src/lib/tutorial/steps.ts` (step definitions)
- `src/lib/tutorial/validation.ts` (validators)

**Tests:**
- Each step validation function
- Edge cases (invalid actions)

**Definition of Done:**
- [ ] All 8 steps defined with content
- [ ] Validation functions work correctly
- [ ] i18n-ready (English only for now, but structured for translation)
- [ ] Tests cover all validators
- [ ] Clear, beginner-friendly language

---

### TASK-4: Tutorial Overlay UI Component
**PR Title:** `feat: Add tutorial overlay with step instructions`  
**Labels:** `enhancement`, `ui`, `onboarding`  
**Estimated:** 3h

**Description:**
Create a non-blocking overlay that guides users through tutorial steps.

**Technical Scope:**
1. Create `src/components/TutorialOverlay.tsx`
2. Features:
   - Sticky panel (bottom or side)
   - Current step display (3/8)
   - Instruction text
   - Next/Prev buttons (prev disabled on step 1)
   - Skip tutorial button
   - Progress bar
   - Pulsing highlight on target elements
3. Animations: fade in/out, smooth transitions
4. Accessibility: keyboard navigation, screen reader friendly
5. Mobile responsive (collapsible)

**Files to Create/Modify:**
- `src/components/TutorialOverlay.tsx` (new)
- `src/components/TutorialHighlight.tsx` (highlight wrapper)
- `src/app/globals.css` (tutorial styles)

**Tests:**
- Component renders with step data
- Navigation buttons work
- Skip confirmation modal

**Definition of Done:**
- [ ] Overlay renders in game screen
- [ ] Shows current step instruction
- [ ] Highlights target elements (via data-tutorial-id)
- [ ] Smooth animations
- [ ] Mobile-friendly
- [ ] Tests pass

---

### TASK-5: Tutorial Orchestration & Integration
**PR Title:** `feat: Integrate tutorial system with game flow`  
**Labels:** `enhancement`, `integration`, `onboarding`  
**Estimated:** 3h

**Description:**
Connect tutorial system with game logic to enforce guided actions.

**Technical Scope:**
1. Modify GameScreen to check tutorial state
2. Disable/enable UI elements based on current step:
   - If step requires Seed, only Seed palette is clickable
   - Other actions are dimmed/disabled
3. Intercept action commits:
   - Validate against expected action
   - Show error hints if wrong
   - Auto-advance on correct action
4. Tutorial-specific game initialization:
   - Pre-seeded board state for some steps
   - Guaranteed outcomes (disable AI randomness during tutorial)
5. Handle tutorial completion:
   - Congratulations modal
   - Option to restart or play freely

**Files to Modify:**
- `src/components/GameScreen.tsx`
- `src/components/ActionPalette.tsx`
- `src/store/gameStore.ts` (add tutorial mode flag)
- `src/lib/game/commit.ts` (tutorial validation hook)

**Tests:**
- Tutorial enforces step actions
- Wrong actions show hints
- Completion triggers modal
- Can exit tutorial mid-way

**Definition of Done:**
- [ ] Tutorial mode restricts player actions per step
- [ ] Validation gives clear feedback
- [ ] Auto-advance works on correct action
- [ ] Can complete full tutorial flow
- [ ] Can skip at any step
- [ ] Tests verify all integration points

---

### TASK-6: In-Game Help Panel
**PR Title:** `feat: Add collapsible help reference panel`  
**Labels:** `enhancement`, `ui`, `documentation`  
**Estimated:** 1.5h

**Description:**
Quick-access help panel for returning players who need rule reminders.

**Technical Scope:**
1. Create `src/components/HelpPanel.tsx`
2. Content:
   - Action cost table (Seed: 2 IP, Env: 1 IP, Mutate: 3 IP)
   - Species explanations
   - Win conditions
   - Keyboard shortcuts
3. Toggle with "?" button in HUD
4. Collapsible/expandable
5. Styled consistently with game theme

**Files to Create/Modify:**
- `src/components/HelpPanel.tsx` (new)
- `src/components/HUD.tsx` (add help button)

**Tests:**
- Panel toggles on button click
- Content renders correctly

**Definition of Done:**
- [ ] Help panel accessible from HUD
- [ ] Shows complete rules reference
- [ ] Keyboard shortcut works (? key)
- [ ] Responsive design
- [ ] Tests pass

---

### TASK-7: Tutorial Analytics & Persistence
**PR Title:** `feat: Add tutorial completion tracking and analytics`  
**Labels:** `enhancement`, `analytics`, `onboarding`  
**Estimated:** 1h

**Description:**
Track tutorial metrics for improvement (localStorage only, no external analytics).

**Technical Scope:**
1. Track in localStorage:
   - Tutorial started timestamp
   - Completed steps
   - Skipped at which step
   - Time spent per step
   - Completion timestamp
2. Add to StateViewer debug panel
3. Optional: export tutorial progress with replay

**Files to Create/Modify:**
- `src/lib/tutorial/analytics.ts` (tracking helpers)
- `src/store/tutorialStore.ts` (add metrics)

**Tests:**
- Metrics update correctly
- Persist across sessions

**Definition of Done:**
- [ ] Tutorial completion tracked
- [ ] Metrics visible in debug panel
- [ ] No PII or external calls
- [ ] Tests verify tracking

---

## 🧪 Testing Strategy

### Unit Tests
- Tutorial step validators
- Store state transitions
- Validation logic

### Integration Tests
- Full tutorial flow (start → complete)
- Skip flow
- Resume after page reload
- Tutorial + game state interaction

### E2E Tests (Optional)
- Landing → Tutorial → Game flow
- Mobile experience

---

## 📐 Design Principles

1. **Progressive Disclosure:** Don't overwhelm, teach one concept at a time
2. **Safe Learning:** Tutorial mode prevents fatal mistakes
3. **Skip-Friendly:** Never force, always allow skip
4. **Forgiving:** Wrong actions give hints, not errors
5. **Resumable:** Can pause and come back
6. **Minimal Text:** Prefer visual cues over long instructions

---

## 🎨 UX Flow

```
[Landing Page]
     ↓
[User Choice: Tutorial or Play]
     ↓
[/game?tutorial=true] ← Tutorial Mode
     ↓
[Step-by-step guided actions]
     ↓
[Complete] → [Play freely] or [Replay tutorial]
```

---

## 🚀 Implementation Order

1. **TASK-1** ✅ (Landing Page) - **COMPLETED** 2025-12-15
2. **TASK-2** ✅ (Tutorial State) - **COMPLETED** 2025-12-15
3. **TASK-3** ⏳ (Step Definitions) - Content (NEXT)
4. **TASK-4** (Overlay UI) - User interface
5. **TASK-5** (Integration) - Connect everything
6. **TASK-6** (Help Panel) - Support returning users
7. **TASK-7** (Analytics) - Track and improve

**Estimated Total:** ~14 hours across 7 PRs  
**Completed:** ~2.5 hours (TASK-1 + TASK-2)  
**Remaining:** ~11.5 hours (5 tasks)

---

## ✅ Acceptance Criteria (Epic Level)

- [x] First-time users see landing page (TASK-1 ✅)
- [ ] Tutorial teaches all core mechanics (TASK-2-5)
- [x] Players can skip at any time (TASK-2 ✅)
- [x] Tutorial progress persists (TASK-2 ✅)
- [ ] Returning users have quick reference (TASK-6)
- [x] All tests pass (41/41 currently ✅)
- [x] Mobile responsive (Landing page ✅)
- [x] Accessible (keyboard nav, screen reader) (Landing page ✅)
- [ ] i18n-ready structure (TASK-3)

---

## 🔗 Related Issues

- #26 (Landing Page & Tour Guide) - Original request
- Future: i18n implementation for translations

---

## 📝 Notes

- Keep tutorial concise (5-7 minutes max)
- Use actual game engine, not mocked
- Tutorial board states should be deterministic
- Consider adding "Practice Mode" after tutorial (sandbox with no AI)
