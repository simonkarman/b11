#!/bin/bash

echo ""
echo "--- Run at $(date) ---"
source "$HOME/.bash_profile"

# Run the auto-fetcher and analyze scripts
npm --prefix auto-fetcher start
npm run analyze

# Function to send a notification
send_notification() {
  local title="$1"
  local message="$2"

  if [ -x "/opt/homebrew/bin/terminal-notifier" ]; then
    /opt/homebrew/bin/terminal-notifier \
      -title "$title" \
      -message "$message" \
      -contentImage "visualize/public/favicon-32x32.png" \
      -sound "Glass"
  else
    osascript -e "display notification \"$message\" with title \"$title\" sound name \"Glass\""
  fi
}

# Stop if there are no changes to output/latest.txt
if git diff --quiet output/latest.txt; then
  echo "No changes to commit."
  send_notification "B11" "No changes to commit for 11:11 today. Everything is up to date!"
  exit 0
fi

# Push changes to GitHub
git reset .
git add output/latest.txt output/latest.json
git commit -m "Auto run at $(date "+%Y-%m-%d")"
git push origin main
send_notification "B11" "Successfully analyzed 11:11 for today! Changes have been pushed to GitHub."
