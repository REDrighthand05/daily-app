# Changelog

All notable changes to Daily will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

## [0.1.0] - 2026-07-02

### Added

- System tray icon with Show / Settings / Quit context menu
- Global shortcut toggle (default Alt+Space) to show/hide the side panel
- Side panel with configurable left/right screen-edge docking
- Acrylic-blur transparent window with no native decorations and custom title bar
- Auto-hide on focus loss (click-outside-to-dismiss behavior)
- Settings persistence via JSON file on disk (shortcut, position, opacity, autostart)
- Notes manager: create, edit, delete, and full-text search with real-time filtering
- Zustand-based frontend state management with IPC bridge to Rust backend
- Window opacity, position, detach/attach controls via IPC commands
- Autostart support via `tauri-plugin-autostart`

[Unreleased]: https://github.com/REDrighthand05/daily-app/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/REDrighthand05/daily-app/releases/tag/v0.1.0


