<div align="center">
  <h1>Daily</h1>
  <p>
    <strong>A lightweight desktop side-panel utility for your daily workflow</strong>
  </p>
  <p>
    <a href="https://github.com/REDrighthand05/daily-app/actions/workflows/ci.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/REDrighthand05/daily-app/ci.yml?branch=main&label=CI&logo=github" alt="CI">
    </a>
    <a href="https://github.com/REDrighthand05/daily-app/releases">
      <img src="https://img.shields.io/github/v/release/REDrighthand05/daily-app?include_prereleases&label=Release&logo=tauri" alt="Release">
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License">
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19">
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript" alt="TypeScript 6">
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/Tauri-v2-FFC131?logo=tauri" alt="Tauri v2">
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/Rust-2021-000000?logo=rust" alt="Rust 2021">
    </a>
  </p>
</div>

---

**Daily** is a polished, system-tray-hosted side panel for Windows. Press a global hotkey, and your quick notes, settings, and tools slide in from the edge of your screen. Inspired by tools like Snipaste, Notion Quick Capture, and Todoist — but focused, local, and yours.

## Features

- **System tray integration** — sits in your notification area. Left-click to toggle, right-click for menu.
- **Global shortcut** — default `Alt+Space` to show/hide from anywhere.
- **Side panel docking** — attach to the left or right screen edge, or float as a standalone window.
- **Acrylic blur** — modern frosted-glass effect on Windows 11/10.
- **Dark / Light / System themes** — follows your OS preference or locks to one.
- **Quick notes** — create, edit, delete, and full-text search through your notes in real time.
- **Opacity control** — adjust transparency from 30% to 100%.
- **Auto-hide on blur** — click outside and the panel disappears, staying out of your way.
- **Autostart option** — launch with Windows so it is always a keypress away.
- **Custom title bar** — clean, frameless window with drag-to-move and window controls.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt+Space` | Toggle Daily panel (configurable) |
| `Ctrl+N` | New note |
| `Ctrl+F` | Focus search |
| `Esc` | Close panel / clear search |

## Getting Started

### Prerequisites

- Windows 10 or later (WebView2 is built in)
- [Rust toolchain](https://rustup.rs) (nightly or stable 1.77+)
- [Node.js](https://nodejs.org) 22+

### Install from source

```bash
git clone https://github.com/REDrighthand05/daily-app.git
cd daily-app
npm ci
cd src-tauri
cargo build
cd ..
npm run tauri dev
```

### Download prebuilt binaries

> Prebuilt MSI/NSIS installers are available on the [Releases page](https://github.com/REDrighthand05/daily-app/releases).

## Screenshots

| Dark Theme | Light Theme |
|-----------|-------------|
| _screenshot coming soon_ | _screenshot coming soon_ |

| Side Panel (right dock) | Settings |
|------------------------|----------|
| _screenshot coming soon_ | _screenshot coming soon_ |

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Desktop Shell** | [Tauri v2](https://v2.tauri.app) |
| **Frontend** | [React 19](https://react.dev) + [TypeScript 6](https://www.typescriptlang.org) |
| **State** | [Zustand](https://github.com/pmndrs/zustand) |
| **Build** | [Vite 8](https://vitejs.dev) + [oxlint](https://oxc.rs) |
| **Backend** | [Rust 2021](https://www.rust-lang.org) (tray-icon, global-shortcut, autostart) |
| **Persistence** | Local JSON (settings) + SQLite (notes) |

## Project Structure

```
daily/
├── src/                          # React frontend (TypeScript)
│   ├── components/
│   │   ├── layout/               # Shell.tsx, TitleBar.tsx
│   │   ├── notes/                # NoteEditor.tsx, NoteList.tsx, NoteSearch.tsx
│   │   └── settings/             # SettingsPage.tsx
│   ├── stores/                   # Zustand state (appStore.ts)
│   ├── styles/                   # global.css, components.css
│   ├── bridge/                   # Tauri IPC layer (ipc.ts)
│   └── types/                    # TypeScript definitions
├── src-tauri/src/                # Rust backend
│   ├── lib.rs                    # Main entry: tray, shortcuts, window management
│   ├── settings.rs               # Settings persistence
│   ├── window.rs                 # Window position, opacity, attach/detach
│   ├── commands/                 # IPC command handlers
│   └── db/                       # Notes storage (SQLite)
├── .github/workflows/
│   ├── ci.yml                    # PR typecheck + lint + build
│   ├── release.yml               # Tag-triggered Tauri build + Release
│   └── changelog.yml             # Auto-changelog on PR merge
└── CHANGELOG.md
```

## Development

```bash
# Start dev server with hot reload
npm run tauri dev

# Type-check only
npx tsc -b

# Lint
npm run lint

# Production build
npm run tauri build
```

## Roadmap

- [ ] Search improvements and note categories
- [ ] Clipboard history module
- [ ] Markdown rendering in notes
- [ ] Customizable theme colours
- [ ] Plugin system
- [ ] Linux & macOS support

## Contributing

Contributions are welcome! Please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feat/my-feature`
5. Open a Pull Request

## License

[MIT](LICENSE)

---

<p align="center">
  <sub>Built with Tauri, React, Rust, and a keyboard shortcut.</sub>
</p>