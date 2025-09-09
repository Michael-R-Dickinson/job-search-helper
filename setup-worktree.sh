#!/bin/bash

# Automatically determine the repo root
REPO_ROOT_PATH=$(realpath "$(git rev-parse --git-common-dir)/..")
CURRENT_DIR=$(pwd)

echo "Setting up worktree in: $CURRENT_DIR"
echo "Repository root: $REPO_ROOT_PATH"

# Check if we're running in the root repo
if [ "$CURRENT_DIR" = "$REPO_ROOT_PATH" ]; then
    echo "This script is intended for git worktrees only. You're in the main repository."
    echo "Please run this script from a git worktree directory."
    exit 1
fi

echo "Installing dependencies with pnpm..."
pnpm install

echo "Copying environment files from main repo..."
cp "$REPO_ROOT_PATH/packages/frontend/.env.local" packages/frontend/.env.local
echo "  ✓ Copied frontend/.env.local"
cp "$REPO_ROOT_PATH/packages/backend/.env" packages/backend/.env
echo "  ✓ Copied backend/.env"
cp "$REPO_ROOT_PATH/packages/chrome-extension/.env.local" packages/chrome-extension/.env.local
echo "  ✓ Copied chrome-extension/.env.local"

echo "Setting up Python backend environment..."
cd packages/backend && python3 -m venv venv && source venv/bin/activate && poetry install