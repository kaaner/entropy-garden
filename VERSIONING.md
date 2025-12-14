# Versioning Strategy - Entropy Garden

## Overview

This project follows **Semantic Versioning 2.0.0** and **Git Flow** branching strategy.

## Semantic Versioning

Version format: `MAJOR.MINOR.PATCH` (e.g., `1.0.0`)

- **MAJOR**: Breaking changes (incompatible API changes)
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Pre-release versions:
- `0.x.x` - Initial development (current phase)
- `1.0.0-alpha.1` - Alpha releases
- `1.0.0-beta.1` - Beta releases
- `1.0.0-rc.1` - Release candidates

## Git Flow Strategy

### Main Branches

**`master`** (or `main`)
- Production-ready code
- Tagged with version numbers
- Only accepts merges from `develop` or `hotfix/*`
- Protected branch (requires PR + review)

**`develop`**
- Integration branch for features
- Latest development changes
- Base for feature branches
- Always deployable to staging

### Supporting Branches

**Feature branches** (`feature/*`)
- Branch from: `develop`
- Merge to: `develop`
- Naming: `feature/description` or `feature/issue-number-description`
- Example: `feature/game-store`, `feature/5-game-store`

**Release branches** (`release/*`)
- Branch from: `develop`
- Merge to: `master` AND `develop`
- Naming: `release/X.Y.Z`
- Example: `release/0.1.0`
- Purpose: Final testing and version bump

**Hotfix branches** (`hotfix/*`)
- Branch from: `master`
- Merge to: `master` AND `develop`
- Naming: `hotfix/X.Y.Z`
- Example: `hotfix/0.1.1`
- Purpose: Critical production fixes

## Workflow

### Feature Development

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# Work on feature
git add .
git commit -m "feat(scope): description"

# Push and create PR to develop
git push -u origin feature/my-feature
gh pr create --base develop --title "feat: My Feature"

# After review, merge to develop
gh pr merge --squash
```

### Release Process

```bash
# 1. Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/0.1.0

# 2. Update version in package.json files
# Update CHANGELOG.md

# 3. Commit version bump
git add .
git commit -m "chore: bump version to 0.1.0"

# 4. Push and create PR to master
git push -u origin release/0.1.0
gh pr create --base master --title "Release v0.1.0"

# 5. After review, merge to master
gh pr merge --squash

# 6. Tag the release on master
git checkout master
git pull origin master
git tag -a v0.1.0 -m "Release version 0.1.0"
git push origin v0.1.0

# 7. Merge release branch back to develop
git checkout develop
git merge release/0.1.0
git push origin develop

# 8. Delete release branch
git branch -d release/0.1.0
git push origin --delete release/0.1.0
```

### Hotfix Process

```bash
# 1. Create hotfix branch from master
git checkout master
git pull origin master
git checkout -b hotfix/0.1.1

# 2. Fix the issue
git add .
git commit -m "fix(scope): critical bug description"

# 3. Update version
# Update CHANGELOG.md

# 4. Merge to master
git checkout master
git merge --no-ff hotfix/0.1.1
git tag -a v0.1.1 -m "Hotfix version 0.1.1"
git push origin master --tags

# 5. Merge to develop
git checkout develop
git merge --no-ff hotfix/0.1.1
git push origin develop

# 6. Delete hotfix branch
git branch -d hotfix/0.1.1
git push origin --delete hotfix/0.1.1
```

## Commit Message Convention

Following [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance (dependencies, build, etc.)
- `ci`: CI/CD changes

### Examples:
```bash
feat(web): implement game store with Zustand
fix(engine): correct en passant validation
docs(readme): add installation instructions
chore(deps): update Next.js to 14.1.0
ci(actions): add deployment workflow
```

## Version Numbers

### Current Development Phase (0.x.x)

**0.1.0** - Sprint 0 Complete (Infrastructure)
- ✅ Project setup
- ✅ Docker support
- ✅ Documentation
- ✅ CI/CD

**0.2.0** - Sprint 1 (Playable PvE Core)
- Game Store
- Engine/AI Facades
- Basic UI

**0.3.0** - Sprint 2 (Preview & Timer)
- Action Preview
- Turn Timer
- Integration Tests

**0.4.0** - Sprint 3 (Replay & Debug)
- Replay System
- Debug Tools

**1.0.0** - Production Release
- All features complete
- Tested and stable
- Ready for public use

## Release Checklist

Before creating a release:

- [ ] All Sprint tasks completed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in all package.json files
- [ ] No critical bugs
- [ ] Code review completed
- [ ] Staging tested

## Package Versioning

Update version in these files:
```
package.json
apps/web/package.json
packages/engine/package.json (if changed)
packages/ai/package.json (if changed)
```

Script to update all versions:
```bash
# Update root
npm version 0.1.0 --no-git-tag-version

# Update web
cd apps/web
npm version 0.1.0 --no-git-tag-version
cd ../..

# If engine changed
cd packages/engine
npm version 0.1.0 --no-git-tag-version
cd ../..

# If ai changed
cd packages/ai
npm version 0.1.0 --no-git-tag-version
cd ../..
```

## GitHub Release

After tagging:

```bash
# Create GitHub release with notes
gh release create v0.1.0 \
  --title "Release v0.1.0 - Infrastructure Complete" \
  --notes-file CHANGELOG.md \
  --target master
```

Or use GitHub UI:
1. Go to Releases
2. Click "Draft a new release"
3. Choose tag: v0.1.0
4. Title: Release v0.1.0
5. Add release notes from CHANGELOG
6. Publish release

## Changelog

Maintain CHANGELOG.md following [Keep a Changelog](https://keepachangelog.com/):

```markdown
# Changelog

## [0.1.0] - 2025-12-14

### Added
- Complete project infrastructure
- Docker support
- n8n automation
- GitHub Actions CI/CD
- Next.js 14 foundation

### Changed
- Nothing

### Deprecated
- Nothing

### Removed
- Nothing

### Fixed
- Nothing

### Security
- Nothing
```

## Branch Protection Rules

Recommended settings for `master` and `develop`:

### Master Branch:
- ✅ Require pull request reviews (1 approval)
- ✅ Require status checks to pass
  - CI (lint, test, build)
  - Typecheck
- ✅ Require branches to be up to date
- ✅ Require conversation resolution
- ✅ Do not allow bypassing settings
- ✅ Restrict who can push (admins only)

### Develop Branch:
- ✅ Require pull request reviews (optional)
- ✅ Require status checks to pass
- ✅ Allow force pushes (for maintainers)

## Quick Reference

```bash
# Start new feature
git checkout develop && git checkout -b feature/my-feature

# Create PR to develop
gh pr create --base develop

# Create release
git checkout -b release/0.1.0 develop
# Update versions
git commit -m "chore: bump version to 0.1.0"
gh pr create --base master

# Tag release
git tag -a v0.1.0 -m "Release 0.1.0"
git push origin v0.1.0

# Create GitHub release
gh release create v0.1.0 --generate-notes
```

## Automation

Future enhancement: Add GitHub Action to:
- Auto-bump version on merge to master
- Auto-generate CHANGELOG
- Auto-create GitHub release
- Auto-deploy on release

---

**Current Version:** 0.1.0  
**Next Version:** 0.2.0 (Sprint 1 Complete)
