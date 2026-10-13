#!/usr/bin/env bash
# Nightly backup of one Ark Pals site's data (deploy/arkpals-backup.timer). Installed as /usr/local/bin/arkpals-backup.
#   arkpals-backup [state dir = /var/lib/arkpals] [backup dir = /var/backups/arkpals]
# The database is copied with SQLite's own online backup (safe while the app runs) and checked; the families'
# files (recordings, songs, backups, play totals) and the house voices are packed with it. The house Grok clips
# are left out: the warm-up script can make them again. Keeps 30 days (ARKPALS_BACKUP_KEEP).
set -euo pipefail
STATE="${1:-/var/lib/arkpals}"
DEST="${2:-/var/backups/arkpals}"
KEEP_DAYS="${ARKPALS_BACKUP_KEEP:-30}"
fail() { echo "BACKUP FAILED: $*" >&2; exit 1; }
DB="$STATE/arkpals.db"
[ -s "$DB" ] || fail "database $DB is missing or empty"
[ "$(sqlite3 "$DB" "SELECT count(*) FROM sqlite_master WHERE type='table' AND name IN ('families','members','devices');")" = 3 ] \
  || fail "$DB doesn't look like an Ark Pals database"
mkdir -p "$DEST" && chmod 700 "$DEST"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
work="$(mktemp -d)"; trap 'rm -rf "$work"' EXIT
sqlite3 "$DB" ".backup '$work/arkpals.db'"
[ "$(sqlite3 "$work/arkpals.db" 'PRAGMA integrity_check;')" = ok ] || fail "the copy failed its integrity check"
for t in families members devices; do
  [ "$(sqlite3 "$DB" "SELECT count(*) FROM $t;")" = "$(sqlite3 "$work/arkpals.db" "SELECT count(*) FROM $t;")" ] || fail "row count mismatch in $t"
done
out="$DEST/arkpals-$stamp.tgz"
tar czf "$out" -C "$work" arkpals.db -C "$STATE" --exclude='house/grok' --ignore-failed-read \
  $(cd "$STATE" && ls -d families recordings songs house backup-*.json 2>/dev/null)
chmod 600 "$out"
find "$DEST" -name 'arkpals-*.tgz' -mtime +"$KEEP_DAYS" -delete
echo "backup ok: $out ($(du -h "$out" | cut -f1))"
