# Git Workflow Guide - IELTS Learning Platform

## Overview
This document outlines the Git workflow for the IELTS Learning Platform project using GitFlow methodology with practical commands.

## Branch Structure

```
master (main)     ← Production-ready code
├── develop       ← Integration branch for features
├── feature/*     ← New features
├── release/*     ← Release preparation
└── hotfix/*      ← Emergency fixes
```

## Initial Setup Commands

```bash
# Clone the repository
git clone https://github.com/EhsunNewaz/shikhilab-1.1.git
cd shikhilab-1.1

# Create and switch to develop branch
git checkout -b develop
git push -u origin develop

# Set up local configuration
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Daily Development Workflow

### 1. Start Your Day
```bash
# Switch to develop and get latest changes
git checkout develop
git pull origin develop

# Check what branches exist
git branch -a
```

### 2. Check Project Status
```bash
# See current status
git status

# View recent commits
git log --oneline -10

# Check for any uncommitted changes
git diff
```

## Feature Development Workflow

### Starting a New Feature
```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication
# or
git checkout -b feature/IELTS-reading-module
```

### Working on Feature
```bash
# Make your changes, then stage them
git add .
# or stage specific files
git add src/components/LoginForm.tsx

# Commit with descriptive message
git commit -m "feat: add user authentication form

- Create LoginForm component with validation
- Add authentication API integration
- Implement error handling for login failures"

# Push feature branch to remote
git push -u origin feature/user-authentication
```

### Completing a Feature
```bash
# Before merging, sync with latest develop
git checkout develop
git pull origin develop
git checkout feature/user-authentication
git merge develop

# If conflicts occur, resolve them then:
git add .
git commit -m "resolve: merge conflicts with develop"

# Push updated feature branch
git push origin feature/user-authentication

# Create pull request via GitHub or merge locally:
git checkout develop
git merge --no-ff feature/user-authentication
git push origin develop

# Delete feature branch (optional)
git branch -d feature/user-authentication
git push origin --delete feature/user-authentication
```

## Hotfix Workflow

### Creating Hotfix
```bash
# Create hotfix branch from master
git checkout master
git pull origin master
git checkout -b hotfix/critical-login-bug

# Make fixes
git add .
git commit -m "hotfix: resolve critical login validation bug

- Fix null pointer exception in authentication
- Add proper error handling for edge cases"

# Push hotfix
git push -u origin hotfix/critical-login-bug
```

### Deploying Hotfix
```bash
# Merge to master
git checkout master
git merge --no-ff hotfix/critical-login-bug
git tag -a v1.0.1 -m "Hotfix v1.0.1: Critical login bug fix"
git push origin master
git push origin v1.0.1

# Merge back to develop
git checkout develop
git merge --no-ff hotfix/critical-login-bug
git push origin develop

# Clean up
git branch -d hotfix/critical-login-bug
git push origin --delete hotfix/critical-login-bug
```

## Release Workflow

### Starting a Release
```bash
# Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# Update version numbers, changelog, etc.
# Then commit release preparations
git add .
git commit -m "prepare: release v1.1.0

- Update package.json version to 1.1.0
- Update CHANGELOG.md with new features
- Final testing and documentation updates"

git push -u origin release/v1.1.0
```

### Finalizing Release
```bash
# Merge to master
git checkout master
git pull origin master
git merge --no-ff release/v1.1.0
git tag -a v1.1.0 -m "Release v1.1.0: IELTS Practice Module"
git push origin master
git push origin v1.1.0

# Merge back to develop
git checkout develop
git merge --no-ff release/v1.1.0
git push origin develop

# Clean up
git branch -d release/v1.1.0
git push origin --delete release/v1.1.0
```

## Collaboration Commands

### Getting Team Updates
```bash
# Fetch all remote changes without merging
git fetch origin

# See what changed
git log HEAD..origin/develop --oneline

# Pull latest from current branch
git pull origin $(git branch --show-current)

# Pull with rebase (cleaner history)
git pull --rebase origin develop
```

### Resolving Conflicts
```bash
# When merge conflicts occur:
git status  # See conflicted files

# Edit files to resolve conflicts, then:
git add <resolved-file>
git commit -m "resolve: merge conflicts in user authentication"

# If during rebase:
git add <resolved-file>
git rebase --continue

# Abort merge/rebase if needed:
git merge --abort
# or
git rebase --abort
```

### Code Review Process
```bash
# Push feature for review
git push origin feature/your-feature-name

# After review feedback, make changes:
git add .
git commit -m "fix: address code review feedback

- Improve error handling in LoginForm
- Add proper TypeScript types
- Update unit tests for edge cases"

git push origin feature/your-feature-name
```

## Useful Maintenance Commands

### Cleaning Up
```bash
# See all branches
git branch -a

# Delete merged local branches
git branch --merged | grep -v "\*\|master\|develop" | xargs -n 1 git branch -d

# Delete remote tracking branches that no longer exist
git remote prune origin

# Clean up untracked files (be careful!)
git clean -fd
```

### Checking History
```bash
# View commit history with graph
git log --graph --oneline --all

# See changes in specific file
git log --follow -- src/components/LoginForm.tsx

# Compare branches
git diff develop..feature/user-auth

# See who changed what
git blame src/components/LoginForm.tsx
```

### Stashing Changes
```bash
# Temporarily save uncommitted changes
git stash push -m "WIP: working on authentication logic"

# List stashes
git stash list

# Apply latest stash
git stash pop

# Apply specific stash
git stash apply stash@{1}

# Drop stash
git stash drop stash@{0}
```

## Emergency Commands

### Undo Commands
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) - DANGEROUS!
git reset --hard HEAD~1

# Revert a commit (safe)
git revert <commit-hash>

# Restore file to last committed version
git checkout -- src/components/LoginForm.tsx
```

### Force Push (Use Carefully!)
```bash
# Only use on feature branches, NEVER on shared branches
git push --force-with-lease origin feature/your-feature
```

## Commit Message Conventions

```bash
# Format: type(scope): description
#
# Types:
# feat: new feature
# fix: bug fix
# docs: documentation changes
# style: formatting changes
# refactor: code restructuring
# test: adding/updating tests
# chore: maintenance tasks

# Examples:
git commit -m "feat(auth): add user login functionality"
git commit -m "fix(api): resolve CORS issue in development"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(components): add unit tests for LoginForm"
```

## Quick Reference Commands

```bash
# Most used daily commands
git status                    # Check current status
git add .                     # Stage all changes
git commit -m "message"       # Commit changes
git push                      # Push to current branch
git pull                      # Pull latest changes
git checkout -b branch-name   # Create and switch to new branch
git merge branch-name         # Merge branch into current
git log --oneline -10         # View recent commits

# Branch management
git branch                    # List local branches
git branch -a                 # List all branches
git checkout branch-name      # Switch to branch
git branch -d branch-name     # Delete local branch

# Remote operations
git fetch origin              # Get remote updates
git push origin branch-name   # Push specific branch
git pull origin develop      # Pull from specific remote branch
```

This workflow ensures clean history, safe collaboration, and proper release management for your IELTS Learning Platform.