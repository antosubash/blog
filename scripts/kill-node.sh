#!/usr/bin/env bash
set -euo pipefail

# Kill all Node.js processes gracefully, then force if needed
if pgrep -f node >/dev/null 2>&1; then
  pkill -f node || true
  sleep 1
fi

if pgrep -f node >/dev/null 2>&1; then
  pkill -9 -f node || true
fi

echo "All Node.js processes have been terminated (if any were running)."


