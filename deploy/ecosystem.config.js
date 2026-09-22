/**
 * ===========================================================================
 * Square21 Marketing — PM2 process definitions
 * ===========================================================================
 *
 * SAFETY: this file only mentions the two square21 apps. It never stops,
 * deletes or renames processes belonging to other projects on the box.
 *
 *   # See what is already running BEFORE you start anything:
 *   pm2 list
 *
 *   # Start / gracefully reload only these two apps:
 *   pm2 startOrReload deploy/ecosystem.config.js
 *
 *   # Persist the process list so it survives a reboot:
 *   pm2 save
 *   # (first time only, so PM2 revives the list on boot:)
 *   pm2 startup
 *
 * ⚠️ `pm2 save` snapshots the WHOLE current process list — including other
 *    projects. Never run `pm2 delete all` on this box. If another project is
 *    currently stopped and must stay stopped, that is fine; the snapshot
 *    simply records it as stopped.
 *
 * The repo path is taken from this file's location, so a differently named
 * checkout works unchanged. Overridable:
 *   SQUARE21_ROOT=/path/to/repo SQUARE21_API_PORT=3001 \
 *   SQUARE21_WEB_PORT=3000 pm2 startOrReload deploy/ecosystem.config.js
 * ===========================================================================
 */
const path = require('path');

// The repository root is derived from this file's own location, so the
// directory can be named anything, anywhere (/root/square21, /root/suqare21,
// a staging copy, ...) without editing this file. Override only if you really
// need to: SQUARE21_ROOT=/some/other/path pm2 startOrReload ...
const ROOT = process.env.SQUARE21_ROOT || path.resolve(__dirname, '..');
const API_PORT = process.env.SQUARE21_API_PORT || 3001;
const WEB_PORT = process.env.SQUARE21_WEB_PORT || 3000;

const LOG_DIR = process.env.SQUARE21_LOG_DIR || path.join(ROOT, 'logs');

/** Shared defaults — unique names keep every log file square21-prefixed. */
const defaults = {
  instances: 1,
  exec_mode: 'fork',
  autorestart: true,
  watch: false,
  max_restarts: 10,
  restart_delay: 4000,
  exp_backoff_restart_delay: 200,
  kill_timeout: 10000, // let Nest close the Prisma/pg pool cleanly
  time: true, // timestamp every log line
  merge_logs: true,
};

module.exports = {
  apps: [
    {
      ...defaults,

      // --- NestJS API -------------------------------------------------------
      // The API reads its PORT from here and its config from backend/.env,
      // which ConfigModule loads from cwd. `cwd` MUST be the backend folder.
      name: 'square21-api',
      cwd: path.join(ROOT, 'backend'),
      script: 'dist/main.js',
      max_memory_restart: '512M',
      out_file: path.join(LOG_DIR, 'square21-api.out.log'),
      error_file: path.join(LOG_DIR, 'square21-api.err.log'),
      env: {
        NODE_ENV: 'production',
        PORT: API_PORT,
      },
    },
    {
      ...defaults,

      // --- Next.js web app --------------------------------------------------
      // Runs the local Next binary directly (no npm wrapper) so PM2 sends
      // signals to the actual server process.
      // Reminder: NEXT_PUBLIC_* values are baked in at BUILD time.
      name: 'square21-web',
      cwd: path.join(ROOT, 'frontend'),
      script: 'node_modules/next/dist/bin/next',
      args: `start -p ${WEB_PORT}`,
      max_memory_restart: '1G',
      out_file: path.join(LOG_DIR, 'square21-web.out.log'),
      error_file: path.join(LOG_DIR, 'square21-web.err.log'),
      env: {
        NODE_ENV: 'production',
        PORT: WEB_PORT,
      },
    },
  ],
};
