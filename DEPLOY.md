# Square21 Marketing — Production Deployment (Hostinger VPS)

Operational guide for the two apps in this repository:

| App | Stack | Runtime | Public URL |
|---|---|---|---|
| `backend/` | NestJS 11 + Prisma 7 + PostgreSQL | PM2 `square21-api` on `127.0.0.1:3001` | `https://square21marketing.com/api` |
| `frontend/` | Next.js 16 (App Router) | PM2 `square21-web` on `127.0.0.1:3000` | `https://square21marketing.com` |

External services: Cloudinary (media), Resend (OTP + newsletter), Groq (chatbot), Google OAuth (login).

---

## 1. Ground rules for this server

`/root` holds several unrelated projects (itbridges, menudesk, whatsapp-twin, outreach, persiandesignerugs, backups…). Square21 shares this box with them, so:

1. **Additive only.** Create new files; never rewrite a shared file (`nginx.conf`, `pg_hba.conf`, another project's vhost or PM2 app).
2. **Never** run `pm2 delete all`, `pm2 kill`, `pm2 save` on a half-configured state, or `systemctl restart nginx` without `nginx -t` first. Prefer `reload` over `restart`.
3. **Always back up before touching infrastructure**: `tar czf /root/backups/nginx-backup-$(date +%F-%H%M%S).tar.gz /etc/nginx` (this matches the existing `backups/` convention).
4. **`./deploy/release.sh` only ever touches** `square21-*` PM2 processes, the square21 database and files inside this repository. It does not manage Nginx.
5. Other projects keep their own ports and their own database; do not reuse their names, ports or DB names.

### Inventory first (all read-only)

```bash
ss -ltnp                                   # what ports are taken
nginx -T | grep -n server_name             # which vhosts exist
ls -la /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ 2>/dev/null
pm2 list                                   # existing PM2 apps and names
psql -l                                    # existing databases
df -h / ; free -h
crontab -l                                 # any existing scheduled jobs
```

Repo layout on the VPS is assumed to be `/root/square21` (override with `SQUARE21_ROOT`). Verify:

```bash
ls -la /root/square21/{backend,frontend,deploy}
```

---

## 2. Environment files

Both are gitignored and must exist on the server before a release. Templates are committed:

```bash
cp backend/.env.example  backend/.env
cp frontend/.env.example frontend/.env.local
# fill in real secrets, then lock them down:
chmod 600 backend/.env frontend/.env.local
```

Backend (`backend/.env`) — `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `RESEND_API_KEY`, `GROQ_API_KEY`, `CLOUDINARY_*`, optional `PORT`.

Frontend (`frontend/.env.local`) — `NEXT_PUBLIC_API_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

Three things that cause most incidents:

- **`NEXT_PUBLIC_API_URL` is baked in at build time.** It must be the *public* URL (`https://square21marketing.com/api`), never `localhost`. Changing it requires `npm run build`, not a restart. `deploy/release.sh` refuses to build if it sees a localhost value.
- **`NEXTAUTH_URL` must exactly match the public origin** (no trailing slash), or Google login redirects break.
- **`JWT_SECRET`** must be a long random value (`openssl rand -hex 48`). Changing it invalidates all sessions.
- **`FRONTEND_URL` is the API's CORS allowlist and accepts a comma-separated list** (e.g. `https://square21marketing.com,https://www.square21marketing.com`). The www/non-www sibling of each entry is allowed automatically, because the site currently answers on **both** hostnames. Getting this wrong does not look like a CORS problem in the browser: server-rendered pages still load, and only client-side calls fail — iOS Safari reports it as **"Load failed"** and Chrome as **"Failed to fetch"**.

Recommended (optional) hardening for Postgres, so the app does not run as the `postgres` superuser:

```bash
sudo -u postgres psql <<'SQL'
CREATE ROLE square21 LOGIN PASSWORD 'REPLACE_ME';
CREATE DATABASE square21 OWNER square21;
GRANT ALL PRIVILEGES ON DATABASE square21 TO square21;
SQL
```

Then set `DATABASE_URL="postgresql://square21:REPLACE_ME@127.0.0.1:5432/square21?schema=public"`. Switching an existing database over is a one-off manual step — do not run it while the API is serving traffic.

---

## 3. One-time setup

### Phase 0 — prerequisites

`node` (v20+; v26 is in use locally), `npm`, `pm2`, `git`, `curl`, `postgresql-client` (for `pg_dump`).

### Phase 1 — Nginx

Use `deploy/nginx/square21marketing.com.conf` as a template. **Follow the checklist in its header comment.** Summary:

```bash
# 0. confirm the domain is not already configured elsewhere
nginx -T 2>/dev/null | grep -n "square21marketing.com"

# 1. back up
mkdir -p /root/backups
tar czf /root/backups/nginx-backup-$(date +%F-%H%M%S).tar.gz /etc/nginx

# 2. install into the directory the OTHER projects already use
cp deploy/nginx/square21marketing.com.conf \
   /etc/nginx/sites-available/square21marketing.com.conf
ln -s /etc/nginx/sites-available/square21marketing.com.conf \
      /etc/nginx/sites-enabled/square21marketing.com.conf

# 3. validate BEFORE reloading — if this fails, nothing has changed yet
nginx -t && systemctl reload nginx
```

The template routes `/api/*` to `127.0.0.1:3001` (stripping the `/api` prefix) and everything else to `127.0.0.1:3000`, sets the `X-Forwarded-*` headers the API depends on, and raises `client_max_body_size` to 210 MB on `/api/` so admin video uploads do not fail with `413`.

It also has an optional `location /videos/` block to let Nginx serve the ~500 MB of hero/property video straight from disk instead of through Next.js. It is commented out because it hardcodes the repo path — enable it only after checking the path.

### Phase 2 — TLS

```bash
certbot --nginx -d square21marketing.com -d www.square21marketing.com
```

Certbot only edits server blocks matching those `server_name` values, so other tenants are unaffected — but back up `/etc/nginx` first anyway.

**Strongly recommended: redirect `www` → apex.** The site currently answers on both hostnames, which splits sessions, duplicates content for search engines, and sent one client into a CORS dead end (`www` page, apex API). The template already contains the `www` redirect block; for it to take effect you must **remove `www.square21marketing.com` from the main block's `server_name`** (otherwise nginx keeps using the main block for `www`). Then `nginx -t && systemctl reload nginx`.

Note that Google OAuth redirect URIs in the Google console and `NEXTAUTH_URL` are registered for the **apex** only, so `www` logins need the redirect anyway.

### Phase 3 — PM2

`deploy/ecosystem.config.js` defines only `square21-api` and `square21-web`, with `cwd` set so each app loads its own env file.

```bash
pm2 list                                     # look before you start
mkdir -p /root/square21/logs
pm2 startOrReload deploy/ecosystem.config.js
pm2 save                                     # persist so it survives reboot
pm2 startup                                  # first time only, then run the printed command
```

`pm2 save` snapshots the whole process list (including other projects) — that is expected and safe; just never run `pm2 delete all`.

---

## 4. Routine release

```bash
cd /root/square21
./deploy/release.sh --dry-run    # FIRST RUN: prints the plan, changes nothing at all
./deploy/release.sh              # full release (ff-only pull, migrate, build, reload, smoke test)
./deploy/release.sh --api-only   # backend changes only
./deploy/release.sh --web-only   # frontend changes only
./deploy/release.sh --no-pull    # build exactly what is checked out
./deploy/release.sh --rollback   # re-release the previously recorded commit
./deploy/release.sh --help
```

**Always run `--dry-run` first.** It performs only read-only checks (tools, env
files, API URL, port ownership, git state, a `pm2 jlist` inventory), prints
every command a real run would execute, and touches nothing: no install, no
build, no migration, no reload, no file written, no network fetch. It exits
non-zero if it found blockers, listing them all at once so you can fix them
before a real release.

What it does, in order, and why it is safe on a shared box:

1. **Preflight** — required tools present, both env files exist, `NEXT_PUBLIC_API_URL` is not localhost, target ports are free *or* owned by a process running from this repository.
2. **Dirty-tree guard** — aborts if the checkout has uncommitted changes (so server-side hotfixes are never silently lost). It never runs `git reset`, `git clean` or `git stash`; use `--force` to override. `backend/dist` is excluded because it is committed build output.
3. **Fast-forward-only pull** — `git merge --ff-only origin/main`; divergence aborts instead of creating a merge on the server.
4. **Backup before migrations** — if `prisma migrate status` reports pending migrations, it `pg_dump`s to `/root/backups/square21-pre-migrate-<timestamp>.sql.gz` first, then runs `prisma migrate deploy`. Skip with `--skip-backup` (not recommended).
5. **Build + verify** — backend build must produce `backend/dist/main.js` (asserted), then the frontend build.
6. **Reload** — `pm2 startOrReload deploy/ecosystem.config.js --only <app>`, one app at a time.
7. **Smoke test** — polls `http://127.0.0.1:3001/health` for `{"status":"ok"}` and `http://127.0.0.1:3000/` for a 200, up to 30 s each. On failure it prints the previous commit and the rollback command.

Recorded rollback target: `deploy/.last-release` (gitignored).

### Blast radius

| Resource | Touched? | How |
|---|---|---|
| PM2 apps of other projects | **No** | every PM2 call is `startOrReload … --only square21-api|square21-web` |
| `pm2 delete` / `pm2 kill` / `pm2 save` | **Never** | not present in the script |
| Nginx config, `systemctl`, `sudo`, `docker` | **Never** | not present in the script; Nginx setup is a separate manual phase |
| Other projects' ports | **No** | the script aborts if `$API_PORT`/`$WEB_PORT` belong to a process outside this repo |
| Other projects' databases | **No** | Prisma and `pg_dump` use the single `DATABASE_URL` from `backend/.env` |
| Other projects' files | **No** | only `backend/`, `frontend/` and `deploy/.last-release` are written |
| Git history | **No** | fetch + `merge --ff-only` only; no `reset`, `clean`, `stash` or force |
| Your uncommitted server-side edits | **No** | the run aborts on a dirty tree instead of overwriting it |
| `$BACKUP_DIR` (default `/root/backups`) | New files only | one `square21-pre-migrate-*.sql.gz`; nothing is deleted or overwritten |

### Honest limits (what can still be disrupted)

1. **`npm ci` empties `node_modules` while installing.** During that window a
   PM2 restart of that app would fail. The script installs *before* reloading,
   so the running process keeps serving from memory; it is a risk only if the
   app crashes on its own mid-install. Use `NPM_INSTALL_CMD="npm install
   --no-audit --no-fund"` if you want the gentler in-place behaviour.
2. **The frontend build rewrites `.next` in place.** For the ~1-2 minutes a
   `next build` takes, a visitor loading the site can request a chunk that the
   build has already replaced, giving a briefly broken (not blank) page. Run
   web releases at a quiet hour; an API release (`--api-only`) has no such
   window.
3. **A database migration takes locks** and is the only step that can leave the
   schema ahead of the code. That is why the script dumps first, records the
   previous commit, and prints the rollback command on any failure.
4. **Failure is contained.** If any step fails the script stops there: the new
   code may be on disk and built, but apps keep serving the previous build
   until a reload succeeds, so the public site stays up. It also never retries
   into a worse state.

### PM2 entry point (first release after the build change)

`npm run start:prod` runs `node dist/main`, and the production build now emits
`backend/dist/main.js`. If a `square21-api` process on the server was started
as `node dist/src/main.js`, that path no longer exists after the first release
with this change. The script's inventory step prints the registered
`script:`/`cwd:` for the square21 apps, so a `--dry-run` shows it up front; the
reload through `deploy/ecosystem.config.js` then adopts `dist/main.js`.
Run `pm2 describe square21-api | grep -E 'script path|cwd'` if you want to
confirm before the release.

### First real release, in the safest order

1. `./deploy/release.sh --dry-run` — read the plan, fix anything it flags.
2. Back up what is about to change (env files are not in git):
   `mkdir -p /root/backups && tar czf /root/backups/pre-first-release.tar.gz backend/.env frontend/.env.local`
3. `./deploy/release.sh --api-only` — the smallest useful release. It ships the
   CORS fix, touches no Nginx config, and restarts only `square21-api`.
4. Verify: `curl -s http://127.0.0.1:3001/health` and then load the public
   properties page on both the apex and `www` hostnames.
5. `./deploy/release.sh --web-only` afterwards, at a quiet hour, if frontend
   code changed.

### Getting the code onto the server

Either `git pull` (what the script does) or `rsync` — but note that **if you deploy with git, the three hero videos referenced by the homepage (`frontend/public/videos/hero-{property,commercial,apartment}.mp4`) are currently untracked**, so the hero strip renders empty on the server. Either `git add` them or copy them manually along with the release.

---

## 5. Backups and restore

```bash
# manual logical backup
pg_dump "$(grep -E '^DATABASE_URL=' backend/.env | cut -d= -f2- | tr -d '\"')" \
  | gzip > /root/backups/square21-$(date +%F-%H%M%S).sql.gz

# restore into a scratch database first, never straight over live data
createdb square21_restore
gunzip -c /root/backups/square21-YYYY-MM-DD-HHMMSS.sql.gz | psql square21_restore
```

Media lives in Cloudinary, not on this box, so a DB dump plus the repo is a complete backup. A nightly `pg_dump` cron entry is worth adding — keep it clearly named so it is obvious which project it belongs to.

---

## 6. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Properties page shows **"Error Loading Properties"** with **"Load failed"** (iOS Safari) or **"Failed to fetch"** (Chrome), while the page itself renders normally | Visitor is on `www.square21marketing.com` but the API's CORS only returned the apex origin, so the browser discards every client-side response. Server-rendered HTML still works, which makes it look like a UI bug | API now mirrors the matching origin for apex/www. Keep `FRONTEND_URL` listing both hosts and reload `square21-api`; add the www→apex redirect (Phase 2) so only one origin exists |
| Everything works on the apex but is dead on `www` (chatbot, newsletter signup, login, admin) | Same root cause as above | Same fix: CORS allowlist + canonical redirect |
| Property lists / chatbot / login silently fail on the public site | `NEXT_PUBLIC_API_URL` was `localhost` at build time | Fix `frontend/.env.local`, then `./deploy/release.sh --web-only` |
| `429 Too many requests` on the public site | Global API rate limit (100 req / 15 min per IP) shared by all server-side renders (they all arrive from loopback) | See "Known issues" #1 — exempt loopback/`/health` requests |
| `413 Request Entity Too Large` on video upload | Nginx `client_max_body_size` too low for `/api/` | Confirm 210 MB on the `/api/` location, then `nginx -t && systemctl reload nginx` |
| `502 Bad Gateway` | API/web process down or on a different port | `pm2 logs square21-api --lines 50`, `ss -ltnp \| grep 3001` |
| `node: Cannot find module '/root/square21/backend/dist/main'` | PM2 entry point stale after the build layout change | Ecosystem file uses `dist/main.js`; if the old process used `dist/src/main.js`, reload via `pm2 startOrReload deploy/ecosystem.config.js` |
| Dashboard works, then 401s after ~24 h | Access token lifetime is 1 day while the NextAuth session lives longer | Re-login; long-term fix is refresh tokens or a longer `expiresIn` |
| Users show as logged in but admin pages 403 | Role not `ADMIN`, or the account was disabled | Check the `users` table (`role`, `status`) |
| Google login loops back to `/login` | Redirect URI mismatch or `NEXTAUTH_URL` wrong | Google console must list `https://square21marketing.com/api/auth/callback/google` |
| Emails not sent | `RESEND_API_KEY` missing/invalid, or the sending domain is not verified in Resend | Check `pm2 logs square21-api`; OTPs are logged when Resend is unconfigured (signup still works) |

Useful commands:

```bash
pm2 logs square21-api --lines 100
pm2 logs square21-web --lines 100
pm2 describe square21-api | grep -E 'script path|cwd|exec cwd'
curl -s http://127.0.0.1:3001/health
tail -f /var/log/nginx/square21.error.log
```

---

## 7. Known issues to fix next

These are recorded here because they affect production behaviour; none are fixed by this deployment setup.

1. **The global rate limiter will throttle the site's own SSR requests.** `backend/src/main.ts` applies 100 requests / 15 min per IP to every route, with `trust proxy: 1`. Next.js fetches the API through the public URL, so *all* server-rendered pages share the loopback IP bucket — after roughly 100 renders in 15 minutes, server-rendered data starts failing (and those errors are caught and swallowed). Fix: skip the limiter for loopback and `/health`, e.g. `skip: (req) => req.ip === '127.0.0.1' || req.path === '/health'`, or raise the read limit substantially.
2. **Admin-only endpoints are protected by authentication but not by role.** `PropertyController` mutations/upload routes, `LeadController` (`GET /leads`, `GET /leads/:id`, `PATCH /leads/:id/status`) and the two `/chatbot` admin routes use `AuthGuard('jwt')` without `RolesGuard` + `@Roles('ADMIN')`, so any self-registered user can edit the catalogue or read all customer leads and chat transcripts.
3. **`PATCH /users/preferences` returns 403 for normal users** — the class-level `@Roles('ADMIN')` on `UsersController` wins over the method-level auth guard.
4. **Uptime monitors must not poll `/api/health` more than a few times per 15 minutes** until issue 1 is fixed, or they will hit the global limiter themselves.
5. **Repo hygiene** (affects deploy size and speed, not runtime):
   - `backend/dist/` (88 files) is committed despite being in `.gitignore` → every build shows as a local change. Consider `git rm -r --cached backend/dist` and adding it to a root `.gitignore`.
   - `frontend/public/videos/` is ~500 MB (including a 33 MB unused `hero-video.mp4` and a full duplicate `backup/` copy) and `backend/*.log` files are tracked. Moving media to Cloudinary and untracking logs keeps clones and deploys small.
   - Dev-only scripts at the backend root (`get_otp.ts`, `fix-role.ts`, `update-role.*`, `seed-property.ts`, `check_history.js`, `verify_leads.js`) are tracked and were previously compiled into `dist/`. `tsconfig.build.json` now excludes them from the build; consider moving them to `backend/scripts/`.
6. **Chat conversations grow unbounded** (`ChatConversation.history` JSON per `visitorId`, client-supplied id, no pruning) and each message costs a Groq call.

---

## 8. Quick reference

```bash
./deploy/release.sh                    # deploy current main
./deploy/release.sh --rollback         # back to the previous commit
pm2 list                               # process state
pm2 logs square21-api --lines 100      # API logs
curl -s http://127.0.0.1:3001/health   # API + DB health
nginx -t && systemctl reload nginx     # only after a config change
```
