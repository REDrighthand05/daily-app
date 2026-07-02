# Contributing to Daily

Thank you for your interest! Contributions of all kinds are welcome.

## Getting Started

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Install dependencies: `npm ci`
4. Start the dev server: `npm run tauri dev`

## Development Guidelines

### TypeScript / React
- Use TypeScript strict mode (already configured).
- Prefer functional components with hooks.
- State management via Zustand — avoid prop-drilling.

### Rust
- Follow Rust 2021 idioms.
- Use `tauri::State` for shared state management.
- Keep IPC command handlers thin; delegate to modules.

### Commits
We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation only
- `style:` — formatting, missing semicolons, etc.
- `refactor:` — code change that neither fixes a bug nor adds a feature
- `perf:` — performance improvement
- `test:` — adding or fixing tests
- `chore:` — build process, CI, dependencies

### Pull Requests
- Open an issue first to discuss significant changes.
- Keep PRs focused — one feature or fix per PR.
- Ensure CI passes (type-check, lint, build).

## Code of Conduct

Be respectful, constructive, and inclusive.