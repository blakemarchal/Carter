#!/usr/bin/env bash
# Build locally and ship to the droplet. Run from the repo root in Git Bash:  ./deploy/deploy.sh
# Only dist/, server/ and package.json are sent. The server's .env is never touched.
set -euo pipefail
HOST="${CARTER_HOST:-root@68.183.130.3}"

npm run build
tar czf - dist server package.json deploy | ssh "$HOST" 'set -e
  mkdir -p /opt/Carter && cd /opt/Carter
  rm -rf dist
  tar xzf - --exclude=.env
  chown -R root:root /opt/Carter && chmod -R a+rX dist server deploy package.json
  if systemctl is-enabled --quiet carter-web 2>/dev/null; then
    systemctl restart carter-web && sleep 1
    curl -fsS -o /dev/null -w "health: HTTP %{http_code}\n" -H "Accept: text/html" http://127.0.0.1:3004/
  else
    echo "Files are in /opt/Carter. First deploy: follow deploy/DEPLOY.md steps 3-5."
  fi'
