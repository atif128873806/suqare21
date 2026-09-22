#!/usr/bin/env bash
# ===========================================================================
# Square21 Marketing — release script
# ===========================================================================
# Pulls the current branch, installs, migrates, builds, reloads PM2 and smoke
# tests both apps. Written for a SHARED Hostinger VPS that hosts several
# unrelated projects.
#
# ALWAYS start with a dry run — it changes nothing at all:
#   ./deploy/release.sh --dry-run
#
# What this script can touch (the complete list):
#   - git fetch + `git merge --ff-only`   -> this repository only
#   - npm install + builds                -> backend/ and frontend/ only
#   - prisma generate / migrate deploy     -> the DB in backend/.env only
#   - pg_dump                              -> READS that DB, writes one new
#                                             file under $BACKUP_DIR
#   - pm2 startOrReload --only <app>       -> square21-api / square21-web only
#   - deploy/.last-release                 -> rollback bookkeeping
#
# What it NEVER does:
#   sudo / systemctl / nginx / docker / apt   |  pm2 delete, pm2 kill, pm2 save
#   git reset, git clean, git stash, force    |  touching another project's
#   another project's ports (it aborts)       |  apps, ports, files or database
#
# Usage:
#   ./deploy/release.sh --dry-run          # show the plan, change NOTHING
#   ./deploy/release.sh                    # full release
#   ./deploy/release.sh --api-only         # backend only
#   ./deploy/release.sh --web-only         # frontend only
#   ./deploy/release.sh --no-pull          # build the current checkout
#   ./deploy/release.sh --skip-backup      # no pg_dump before migrations
#   ./deploy/release.sh --force            # allow a dirty working tree
#   ./deploy/release.sh --rollback         # re-release the previous commit
#   ./deploy/release.sh --help
#
# Overridable environment:
#   BRANCH=main          SQUARE21_API_PORT=3001   SQUARE21_WEB_PORT=3000
#   BACKUP_DIR=/root/backups                      NPM_INSTALL_CMD="npm ci"
# ===========================================================================
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

BRANCH="${BRANCH:-main}"
API_PORT="${SQUARE21_API_PORT:-3001}"
WEB_PORT="${SQUARE21_WEB_PORT:-3000}"
BACKUP_DIR="${BACKUP_DIR:-/root/backups}"
NPM_INSTALL_CMD="${NPM_INSTALL_CMD:-npm ci --no-audit --no-fund}"
STATE_FILE="$ROOT/deploy/.last-release"
API_SCRIPT="$ROOT/backend/dist/main.js"
WEB_SCRIPT="$ROOT/frontend/node_modules/next/dist/bin/next"

DO_PULL=1
DO_BACKUP=1
FORCE=0
TARGET=all
ROLLBACK=0
DRY_RUN=0
BLOCKERS=0
PORT_OURS=0

# --- output helpers ---------------------------------------------------------
c_reset='\033[0m'; c_blue='\033[1;34m'; c_green='\033[1;32m'
c_yellow='\033[1;33m'; c_red='\033[1;31m'; c_cyan='\033[1;36m'
log()  { printf "${c_blue}[%s]${c_reset} %s\n" "$(date +%H:%M:%S)" "$*"; }
ok()   { printf "${c_green}  ok${c_reset} %s\n" "$*"; }
warn() { printf "${c_yellow}  !${c_reset} %s\n" "$*"; }
plan() { printf "${c_cyan}  plan${c_reset} %s\n" "$*"; }
die()  { printf "${c_red}  x %s${c_reset}\n" "$*" >&2; exit 1; }

# A problem that stops a real release. In a dry run it is collected instead, so
# the operator still gets to see the whole plan and every issue at once.
blocker() {
  BLOCKERS=$((BLOCKERS + 1))
  printf "${c_yellow}  ! would block a real run:${c_reset} %s\n" "$1" >&2
}
require() {
  if [[ "$DRY_RUN" -eq 1 ]]; then blocker "$1"; else die "$1"; fi
}

# --- mutation helpers: no-ops that only print in a dry run ------------------
run_in() {
  local dir="$1"; shift
  if [[ "$DRY_RUN" -eq 1 ]]; then
    plan "(cd $dir && $*)"
    return 0
  fi
  ( cd "$dir" && "$@" )
}
run_raw() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    plan "$*"
    return 0
  fi
  "$@"
}

usage() {
  awk 'NR > 1 && /^set -E/ { exit } NR > 1 && /^#/ { sub(/^# ?/, ""); print }' \
    "${BASH_SOURCE[0]}"
  exit 0
}

for arg in "$@"; do
  case "$arg" in
    --api-only)    TARGET=api ;;
    --web-only)    TARGET=web ;;
    --no-pull)     DO_PULL=0 ;;
    --skip-backup) DO_BACKUP=0 ;;
    --force)       FORCE=1 ;;
    --rollback)    ROLLBACK=1; DO_PULL=0 ;;
    --dry-run|--check|--plan) DRY_RUN=1 ;;
    -h|--help)     usage ;;
    *) die "Unknown argument: $arg (try --help)" ;;
  esac
done

# --- failure handler: always leave the operator with a next step ------------
PREV_REF=""
on_error() {
  local code=$?
  printf "\n${c_red}release failed (exit %s)${c_reset}\n" "$code" >&2
  if [[ -n "$PREV_REF" ]]; then
    printf "previous working commit: ${c_yellow}%s${c_reset}\n" "$PREV_REF" >&2
    printf "to go back:              ${c_yellow}./deploy/release.sh --rollback${c_reset}\n" >&2
  fi
  printf "running apps keep serving the previous build until a reload succeeds.\n" >&2
  printf "logs: ${c_yellow}pm2 logs square21-api${c_reset} / ${c_yellow}pm2 logs square21-web${c_reset}\n" >&2
  exit "$code"
}
trap on_error ERR

if [[ "$DRY_RUN" -eq 1 ]]; then
  log "DRY RUN — nothing will be installed, built, migrated, restarted or written"
fi

# ===========================================================================
# 1. Preflight — tools, env files, API URL, ports, git state
# ===========================================================================
log "Preflight checks"

for cmd in git node npm curl pm2; do
  command -v "$cmd" >/dev/null 2>&1 || require "'$cmd' not found in PATH"
done
command -v pm2 >/dev/null 2>&1 \
  && ok "node $(node -v), npm $(npm -v), pm2, git present" \
  || warn "pm2 is missing — a real release cannot reload the apps"

[[ -f backend/.env ]] \
  || require "backend/.env is missing — copy backend/.env.example and fill it in"
[[ -f frontend/.env.local ]] \
  || require "frontend/.env.local is missing — copy frontend/.env.example and fill it in"
if [[ -f backend/.env && -f frontend/.env.local ]]; then
  ok "environment files present"
fi

# Guard against the classic "built for localhost" incident: NEXT_PUBLIC_* is
# inlined at build time, so a localhost API URL ships a broken site.
api_url="$(grep -E '^[[:space:]]*NEXT_PUBLIC_API_URL=' frontend/.env.local \
  | tail -1 | cut -d= -f2- || true)"
api_url="${api_url//\"/}"
api_url="${api_url//\'/}"
api_url="${api_url//[[:space:]]/}"
if [[ -z "$api_url" ]]; then
  warn "NEXT_PUBLIC_API_URL is not set; the build will fall back to http://localhost:3001"
elif [[ "$api_url" == *localhost* || "$api_url" == *127.0.0.1* ]]; then
  require "NEXT_PUBLIC_API_URL=$api_url points at localhost, so browsers cannot
    reach the API. Set the public URL (e.g. https://square21marketing.com/api)."
else
  ok "NEXT_PUBLIC_API_URL=$api_url"
fi

# API CORS allowlist: warn when the configured origin does not cover the
# hostnames this deployment serves (this exact mismatch broke iOS Safari
# clients: "Load failed" / "Failed to fetch" on the properties page).
frontend_origin="$(grep -E '^[[:space:]]*NEXTAUTH_URL=' frontend/.env.local \
  | tail -1 | cut -d= -f2- || true)"
frontend_origin="${frontend_origin//\"/}"
frontend_origin="${frontend_origin//[[:space:]]/}"
cors_origins="$(grep -E '^[[:space:]]*FRONTEND_URL=' backend/.env \
  | tail -1 | cut -d= -f2- || true)"
cors_origins="${cors_origins//\"/}"
if [[ -n "$frontend_origin" && -n "$cors_origins" ]]; then
  if [[ ",$cors_origins," != *"$frontend_origin"* ]]; then
    warn "FRONTEND_URL in backend/.env does not list $frontend_origin"
    warn "  client-side calls from that origin may be blocked by CORS"
  else
    ok "CORS allows the app origin ($frontend_origin)"
  fi
fi

# Port check. A port only counts as "ours" when the listening process actually
# runs from inside this repository — other projects are never disturbed, and
# square21 is never blocked by its own already-running processes.
port_owner_is_ours() {
  local port="$1" pid cwd pids
  pids="$(ss -ltnp 2>/dev/null | grep -F ":$port " | grep -oE 'pid=[0-9]+' \
    | cut -d= -f2 | sort -u || true)"
  [[ -n "$pids" ]] || return 1
  for pid in $pids; do
    cwd="$(readlink -f "/proc/$pid/cwd" 2>/dev/null || true)"
    [[ -n "$cwd" && "$cwd" == "$ROOT"* ]] && return 0
  done
  return 1
}

for p in "$API_PORT" "$WEB_PORT"; do
  if ! ss -ltnp 2>/dev/null | grep -qF ":$p "; then
    ok "port $p free"
  elif port_owner_is_ours "$p"; then
    PORT_OURS=1
    ok "port $p already served by square21 (it will be reloaded)"
  else
    ss -ltnp 2>/dev/null | grep -F ":$p " | sed 's/^/      /' >&2 || true
    require "port $p is in use by ANOTHER project (see above).
    This script refuses to touch it. Pick free ports instead:
      SQUARE21_API_PORT=30xx SQUARE21_WEB_PORT=30yy ./deploy/release.sh"
  fi
done

# What PM2 currently has registered for square21 (read-only). Shows exactly
# what a reload would change before it happens.
pm2_inventory() {
  command -v pm2 >/dev/null 2>&1 || { echo "      (pm2 not installed)"; return 0; }
  local json
  json="$(pm2 jlist 2>/dev/null || true)"
  [[ -n "$json" ]] || { echo "      (pm2 inventory unavailable)"; return 0; }
  printf '%s' "$json" \
    | SQUARE21_API_SCRIPT="$API_SCRIPT" SQUARE21_WEB_SCRIPT="$WEB_SCRIPT" node -e '
      let raw = "";
      process.stdin.on("data", (d) => (raw += d));
      process.stdin.on("end", () => {
        let list = [];
        try { list = JSON.parse(raw); } catch { console.log("      (unreadable)"); return; }
        const mine = list.filter((a) => String(a.name || "").startsWith("square21-"));
        if (mine.length === 0) {
          console.log("      nothing registered yet (a real run will start both apps)");
          return;
        }
        const want = { "square21-api": process.env.SQUARE21_API_SCRIPT,
                       "square21-web": process.env.SQUARE21_WEB_SCRIPT };
        for (const a of mine) {
          const e = a.pm2_env || {};
          console.log(`      ${a.name} — ${e.status || "?"}`);
          console.log(`        script: ${e.pm_exec_path || "?"}`);
          console.log(`        cwd:    ${e.pm_cwd || "?"}`);
          if (want[a.name] && e.pm_exec_path && e.pm_exec_path !== want[a.name]) {
            console.log(`        ^ entry point will change to: ${want[a.name]}`);
          }
        }
      });
    '
}

log "PM2 processes owned by square21 (read-only inventory)"
PM2_INV="$(pm2_inventory || true)"
printf '%s\n' "$PM2_INV"

# Guard against a PM2 daemon/user mismatch: if square21 already listens on a
# target port but this daemon does not manage any square21-* app, a reload
# would start a duplicate process that cannot bind the port.
if [[ "$PORT_OURS" -eq 1 && "$PM2_INV" == *"nothing registered"* ]]; then
  warn "a square21 process already listens on a target port, but this PM2"
  warn "  daemon manages no square21-* app. Run the release as the user that"
  warn "  owns your PM2 daemon (usually root), or a reload may start a duplicate."
fi

# Working-tree check. `backend/dist` is excluded because it is committed build
# output that any build rewrites (see DEPLOY.md -> repo hygiene).
if [[ "$ROLLBACK" -eq 0 ]]; then
  dirty="$(git status --porcelain --untracked-files=no -- . ':(exclude)backend/dist' || true)"
  if [[ -n "$dirty" ]]; then
    printf "%s\n" "$dirty" | sed 's/^/      /' >&2
    if [[ "$FORCE" -eq 1 ]]; then
      warn "working tree is dirty, continuing because --force was given"
    else
      require "uncommitted changes in the repository (listed above).
    Commit or stash them, or re-run with --force. This script never discards
    your edits and never runs 'git reset'/'git clean'/'git stash'."
    fi
  else
    ok "working tree clean"
  fi
fi

PREV_REF="$(git rev-parse HEAD)"
log "current commit: $(git rev-parse --short HEAD) $(git log -1 --pretty=%s)"

# ===========================================================================
# 2. Get the code (fast-forward only, or jump back for a rollback)
# ===========================================================================
if [[ "$ROLLBACK" -eq 1 ]]; then
  [[ -f "$STATE_FILE" ]] || require "no rollback target recorded ($STATE_FILE not found)"
  target_ref="$(cut -d' ' -f1 "$STATE_FILE" 2>/dev/null || true)"
  [[ -n "$target_ref" ]] || require "rollback file is empty: $STATE_FILE"
  if [[ -n "$target_ref" ]]; then
    log "Rollback to $(git rev-parse --short "$target_ref")"
    run_raw git checkout --detach "$target_ref"
    warn "HEAD is left detached at $target_ref — run 'git checkout $BRANCH' to return"
  fi
elif [[ "$DO_PULL" -eq 1 ]]; then
  if [[ "$DRY_RUN" -eq 1 ]]; then
    plan "git fetch --prune origin $BRANCH   # not executed during a dry run"
    plan "git merge --ff-only origin/$BRANCH   # aborts on divergence"
  else
    log "Fetching origin/$BRANCH"
    git fetch --prune origin "$BRANCH"
    LOCAL="$(git rev-parse HEAD)"
    REMOTE="$(git rev-parse "origin/$BRANCH")"
    if [[ "$LOCAL" == "$REMOTE" ]]; then
      ok "already up to date"
    else
      git merge --ff-only "origin/$BRANCH"   # aborts on divergence, never forces
      ok "fast-forwarded to $(git rev-parse --short HEAD)"
    fi
  fi
else
  warn "skipping git pull (--no-pull)"
fi

# Record the rollback target only once the new code actually works.
if [[ "$ROLLBACK" -eq 0 && "$DRY_RUN" -eq 0 ]]; then
  printf "%s %s\n" "$PREV_REF" "$(date -Iseconds)" > "$STATE_FILE"
fi

# ===========================================================================
# 3. Backend
# ===========================================================================
if [[ "$TARGET" == "all" || "$TARGET" == "api" ]]; then
  log "Backend: installing dependencies"
  run_in backend $NPM_INSTALL_CMD
  if [[ "$DRY_RUN" -eq 0 ]]; then ok "dependencies installed"; fi

  log "Backend: generating Prisma client"
  run_in backend npx prisma generate

  if [[ "$ROLLBACK" -eq 0 ]]; then
    # Detect pending migrations (read-only, also in a dry run).
    status_out="$(cd backend && npx prisma migrate status 2>&1 || true)"
    if grep -qiE 'not yet been applied|pending migration' <<<"$status_out"; then
      log "Backend: pending migrations detected"
      if [[ "$DO_BACKUP" -eq 1 ]]; then
        if ! command -v pg_dump >/dev/null 2>&1; then
          require "pg_dump not found (install postgresql-client) — or pass --skip-backup"
        else
          db_url="$(grep -E '^DATABASE_URL=' backend/.env | head -1 | cut -d= -f2- \
            | sed -e 's/^"//' -e 's/"$//' || true)"
          [[ -n "$db_url" ]] || require "could not read DATABASE_URL from backend/.env"
          if [[ -n "$db_url" ]]; then
            dump="$BACKUP_DIR/square21-pre-migrate-$(date +%Y%m%d-%H%M%S).sql.gz"
            if [[ "$DRY_RUN" -eq 1 ]]; then
              plan "mkdir -p $BACKUP_DIR"
              plan "pg_dump <square21 database> | gzip > $dump"
            else
              mkdir -p "$BACKUP_DIR"
              pg_dump "$db_url" | gzip > "$dump"
              ok "database backed up ($(du -h "$dump" | cut -f1))"
            fi
          fi
        fi
      else
        warn "skipping database backup (--skip-backup)"
      fi
      run_in backend npx prisma migrate deploy
      ok "migrations applied"
    else
      ok "no pending migrations"
    fi
  fi

  log "Backend: building"
  run_in backend npm run build
  if [[ "$DRY_RUN" -eq 0 ]]; then
    [[ -f backend/dist/main.js ]] || die "build did not produce backend/dist/main.js
    (package.json start:prod runs 'node dist/main'). Check tsconfig.build.json."
    ok "build verified: backend/dist/main.js"
  else
    plan "verify backend/dist/main.js exists (start:prod entry point)"
  fi
fi

# ===========================================================================
# 4. Frontend
# ===========================================================================
if [[ "$TARGET" == "all" || "$TARGET" == "web" ]]; then
  log "Frontend: installing dependencies"
  run_in frontend $NPM_INSTALL_CMD
  if [[ "$DRY_RUN" -eq 0 ]]; then ok "dependencies installed"; fi

  log "Frontend: building (NEXT_PUBLIC_* values are baked in here)"
  run_in frontend npm run build
  if [[ "$DRY_RUN" -eq 0 ]]; then ok "build finished"; fi
fi

# ===========================================================================
# 5. Reload PM2 (only the square21 apps) and smoke test
# ===========================================================================
wait_for_health() {
  local url="http://127.0.0.1:$API_PORT/health" body
  for _ in $(seq 1 30); do
    body="$(curl -fsS -m 5 "$url" 2>/dev/null || true)"
    if grep -q '"status":"ok"' <<<"$body"; then
      ok "api healthy: $body"
      return 0
    fi
    sleep 1
  done
  return 1
}

wait_for_web() {
  local url="http://127.0.0.1:$WEB_PORT/"
  for _ in $(seq 1 30); do
    if curl -fsS -m 5 -o /dev/null "$url" 2>/dev/null; then
      ok "web responding on $url"
      return 0
    fi
    sleep 1
  done
  return 1
}

if [[ "$TARGET" == "all" || "$TARGET" == "api" ]]; then
  log "Reloading PM2 app square21-api"
  run_raw pm2 startOrReload deploy/ecosystem.config.js --only square21-api --update-env
  if [[ "$DRY_RUN" -eq 0 ]]; then
    wait_for_health || die "API did not become healthy — check: pm2 logs square21-api --lines 50"
  fi
fi

if [[ "$TARGET" == "all" || "$TARGET" == "web" ]]; then
  log "Reloading PM2 app square21-web"
  run_raw pm2 startOrReload deploy/ecosystem.config.js --only square21-web --update-env
  if [[ "$DRY_RUN" -eq 0 ]]; then
    wait_for_web || die "web app did not respond — check: pm2 logs square21-web --lines 50"
  fi
fi

# ===========================================================================
# 6. Summary
# ===========================================================================
printf "\n"

if [[ "$DRY_RUN" -eq 1 ]]; then
  log "DRY RUN finished — no file, database or process was modified"
  if [[ "$BLOCKERS" -eq 0 ]]; then
    ok "no blockers found: a real run ('./deploy/release.sh') should proceed"
    exit 0
  fi
  warn "$BLOCKERS blocker(s) found (marked above). Fix them, or pass --force"
  warn "for the working-tree check, before running a real release."
  exit 1
fi

log "Release complete: $(git rev-parse --short HEAD) $(git log -1 --pretty=%s)"
ok "public API: https://square21marketing.com/api/health"
ok "public site: https://square21marketing.com"
warn "Nginx is NOT touched by this script. If the public URL is not updated yet,"
warn "see DEPLOY.md -> 'Phase 1: Nginx' (one-time setup)."
printf "\n"
pm2 list | grep -E 'square21|name' || true
