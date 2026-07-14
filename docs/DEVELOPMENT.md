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

The required major Node version is 22. It is declared in `.nvmrc`, `.node-version` and `package.json`. If a different version is active, use the existing Node-22 login-shell environment; do not repair it with a global configuration change.

## Install and build

From the central project directory:

```bash
npm ci
npm run check
git diff --check
```

`npm ci` is the supported installation command. It must use `package-lock.json` without updating it. Astro writes the static build to `dist/`; `node_modules/`, `dist/`, and `.astro/` are ignored generated paths.

`npm run check` performs the deterministic content-structure checks and a production build. Content changes must also pass the legal publication gate in `AGENTS.md` and follow the applicable parts of `CONTENT_DOD.md`.

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
3. Create or reuse a `codex/<task>` branch. Parallel tasks require separate worktrees and separate branches. Do not work directly on `main`.
4. Run `npm run check` and `git diff --check`.
5. Review the complete diff, commit only intended files, push the task branch and create a pull request.
6. GitHub classifies sensitive changes, runs the required quality check and automatically merges eligible low-risk pull requests. Codex completes additional legal or infrastructure reviews when required.

Do not commit dependencies, build outputs, logs, environment files, credentials, private keys, personal audit data, or untracked files copied from another clone.

## Project-local Codex safety

`.codex/config.toml` allows unattended project work with `approval_policy = "never"`, while retaining the `workspace-write` sandbox. Network access is enabled only for project tasks such as source verification, GitHub and deployments. Do not switch this project to `danger-full-access` or change the global Codex configuration as part of project work.

## Backup and rollback

Before first-time setup, keep a timestamped archive adjacent to the project directory using the pattern:

```text
/Users/vkclaw/Documents/246eBauGB.pre-setup-YYYYMMDD-HHMMSS.tar
```

Verify an archive with `tar -tf` before relying on it. For a non-destructive rollback, stop project processes, rename the failed project directory to a new timestamped `*.failed-*` path, confirm the original target path no longer exists, and extract the verified archive under `/Users/vkclaw/Documents`. Never overwrite the failed directory, use `rsync --delete`, `git reset --hard`, or `git clean -fdx` as a shortcut.

Generated artifacts from a failed setup may be removed only when they are known to have been created by that setup and no user data is present. Prefer preserving the complete failed directory by renaming it until restoration has been verified.
