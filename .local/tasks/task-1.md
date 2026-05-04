---
title: Pull latest updates from GitHub
---
# Pull Latest GitHub Updates

## Objective
Pull the latest commits from the GitHub remote (`origin/main`) into the project.

## Steps
1. Run `git fetch origin`
2. Run `git merge origin/main` (or `git pull origin main`) to merge remote changes into the current branch
3. If there are merge conflicts, resolve them by keeping both sets of changes where possible, preferring the remote changes for new files

## Expected Result
The local codebase contains all commits that exist on `https://github.com/mahmoudjameel/BaytakApp` (origin/main), merged with local changes.