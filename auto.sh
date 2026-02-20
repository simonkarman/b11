#!/bin/bash

# Run the auto-fetcher and analyze scripts
npm --prefix auto-fetcher start
npm run analyze

# Stop if there are no changes
if git diff --cached --quiet; then
  echo "No changes to commit."
  exit 0
fi

# Push changes to GitHub
git add output/latest.json
git add output/latest.txt
git commit -m "Auto run at $(date)"
git push origin main
