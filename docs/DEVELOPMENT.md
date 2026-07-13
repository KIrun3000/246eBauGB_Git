# Development

## Central working copy

- Host: `mac-mini-von-loco`
- Project path: `/Users/vkclaw/Documents/246eBauGB`
- GitHub repository: `https://github.com/KIrun3000/246eBauGB_Git.git`

The Mac mini directory is the central working copy. Work from a MacBook is performed over SSH against this directory. A separate MacBook clone is not an automatic source of project files.

## Prerequisites

Use the already installed Node 22 and npm 10 from the Mac mini login shell. Do not install or update Node, npm, Astro, package managers, or other tools globally, and do not change global shell or package-manager configuration.

Verify the runtime before project commands:

```bash
command -v node
node --version
npm --version
```

The expected major Node version is 22. If a different version is active, use the existing Node-22 login-shell environment; do not repair it with a global configuration change.

## Install and build

From the central project directory:

```bash
npm ci
npm run build
git diff --check
```

`npm ci` is the supported installation command. It must use `package-lock.json` without updating it. Astro writes the static build to `dist/`; `node_modules/`, `dist/`, and `.astro/` are ignored generated paths.

The repository currently defines `dev`, `build`, `preview`, and `astro` scripts. It does not define a separate automated test, lint, or type-check script. Content changes must also follow the checks in `CONTENT_DOD.md`.

## Development server

Bind only to the loopback interface:

```bash
npm run dev -- --host 127.0.0.1 --port 4321
```

Do not bind the server to `0.0.0.0` or expose it through firewall or Tailscale port-forwarding changes.

## Access from a MacBook

While the loopback-only development server is running on the Mac mini, create a temporary SSH tunnel from a MacBook:

```bash
ssh -N -L 4321:127.0.0.1:4321 mac-mini-von-loco
```

Open `http://127.0.0.1:4321` locally. Stop the tunnel and development server after the check, then verify on both machines that no process started for the check still listens on port 4321.

## Branch and backup workflow

1. Confirm the worktree is clean and `main` tracks `origin/main`.
2. Update only by a normal fetch and fast-forward workflow; never force-push or rewrite `main`.
3. Create or reuse a task branch following the repository's established naming convention. Do not work directly on `main`.
4. Run at least `npm run build` and `git diff --check`, plus applicable content checks.
5. Review the complete diff, commit only intended files, and push the task branch to GitHub for backup.
6. Merge to `main` only through the separately approved repository workflow.

Do not commit dependencies, build outputs, logs, environment files, credentials, private keys, personal audit data, or untracked files copied from another clone.

## Project-local Codex safety

`.codex/config.toml` deliberately limits this repository to on-request approvals and workspace-write sandboxing. Do not weaken these settings or change the global Codex configuration as part of project work.

## Backup and rollback

Before first-time setup, keep a timestamped archive adjacent to the project directory using the pattern:

```text
/Users/vkclaw/Documents/246eBauGB.pre-setup-YYYYMMDD-HHMMSS.tar
```

Verify an archive with `tar -tf` before relying on it. For a non-destructive rollback, stop project processes, rename the failed project directory to a new timestamped `*.failed-*` path, confirm the original target path no longer exists, and extract the verified archive under `/Users/vkclaw/Documents`. Never overwrite the failed directory, use `rsync --delete`, `git reset --hard`, or `git clean -fdx` as a shortcut.

Generated artifacts from a failed setup may be removed only when they are known to have been created by that setup and no user data is present. Prefer preserving the complete failed directory by renaming it until restoration has been verified.
