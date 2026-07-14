# Repository guidance

- The central working copy is on `mac-mini-von-loco` at `/Users/vkclaw/Documents/246eBauGB`.
- Treat GitHub as version control and backup; do not work directly on `main`.
- Reuse an existing branch naming convention when one is established; otherwise use a short task-oriented branch.
- Use the existing Node 22 and npm runtime. Do not install global packages or change system, shell, Git, npm, SSH, Tailscale, or Codex configuration.
- Install exactly from the lockfile with `npm ci`; do not update the lockfile as part of setup.
- Validate changes at minimum with `npm run build` and `git diff --check`.
- Start the development server only on `127.0.0.1:4321`, never on a wildcard interface.
- Follow `CONTENT_DOD.md` and `PROMPT_CONTRACT.md` for content and sourcing changes.
- Never commit secrets, credentials, private keys, or personal audit data.
- Untracked files from a MacBook clone are not automatically part of this repository and must not be copied, committed, or published without explicit approval.
