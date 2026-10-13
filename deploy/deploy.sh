#!/usr/bin/env bash
# Build locally and ship to the droplet. Run from the repo root in Git Bash:
#   ./deploy/deploy.sh         dev: spiritflow.church (/opt/Carter, carter-web, port 3004)
#   ./deploy/deploy.sh prod    production: arkpals.world (/opt/ArkPals, arkpals-web, port 3005)
# Only dist/, server/, the voice scripts the server runs, package.json and its lockfile are sent (the server installs its own packages). The server's .env is never touched.
set -euo pipefail
HOST="${CARTER_HOST:-root@68.183.130.3}"
case "${1:-dev}" in
  prod) DIR=/opt/ArkPals SERVICE=arkpals-web PORT=3005 ;;
  dev) DIR=/opt/Carter SERVICE=carter-web PORT=3004 ;;
  *) echo "usage: deploy.sh [dev|prod]" >&2; exit 2 ;;
esac

npm run build
tar czf - dist server package.json package-lock.json deploy scripts/warm-house-grok.mjs scripts/warm-narration.mjs | ssh "$HOST" "set -e
  mkdir -p $DIR && cd $DIR
  rm -rf dist
  tar xzf - --exclude=.env
  npm ci --omit=dev --ignore-scripts --no-audit --no-fund --loglevel=error
  chown -R root:root $DIR && chmod -R u=rwX,go=rX dist server deploy scripts package.json package-lock.json node_modules
  if systemctl is-enabled --quiet $SERVICE 2>/dev/null; then
    systemctl restart $SERVICE && sleep 1
    curl -fsS -o /dev/null -w 'health: HTTP %{http_code}\n' -H 'Accept: text/html' http://127.0.0.1:$PORT/
  else
    echo 'Files are in $DIR. First deploy: follow deploy/DEPLOY.md.'
  fi"
