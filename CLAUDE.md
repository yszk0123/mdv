# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

mdv is a Markdown viewer/editor with real-time GFM preview. It runs as both a standalone web app and a VS Code extension. Markdown is parsed into structured table data for display and editing.

## Commands

```bash
# Install dependencies (uses pnpm via .npmrc)
pnpm install

# Dev server (web app at localhost:3000)
pnpm dev

# Build web app
pnpm build

# Run all tests (vitest, runs from root)
pnpm test

# Lint/format check (Biome)
pnpm check

# VS Code extension development
pnpm vscode:webview    # Build webview assets for VS Code
pnpm vscode:dev        # Watch mode for VS Code extension

# Package & deploy VS Code extension
pnpm --filter vscode-mdv package
pnpm --filter vscode-mdv deploy

# Version bumping
pnpm version:patch     # ./scripts/version.sh patch
```

## Architecture

**Monorepo** with npm workspaces (`packages/*`), three packages:

- **`@mdv/core`** (`packages/core`) — Shared types and configuration. Defines `ParserOptions`, `Configuration`, and message types (`VscodeMessage`, `WebviewMessage`) for VS Code ↔ webview communication.

- **`@mdv/web`** (`packages/web`) — React 19 frontend with Tailwind CSS 4. Two entry points:
  - `src/web.tsx` — Standalone web app
  - `src/vscode.tsx` — VS Code webview entry point
  - Key feature: `features/parser/` — Parses markdown into `TableData` (headings/rows/columns) for structured editing, then stringifies back to markdown.
  - Uses Jotai for state, react-markdown + remark-gfm for rendering.
  - Two Vite configs: `vite.config.mts` (web) and `vite.vscode.config.mts` (VS Code webview build).

- **`vscode-mdv`** (`packages/vscode`) — VS Code extension. Hosts the web UI in a webview panel, syncs document text via postMessage. Built with esbuild (`esbuild.mjs`).

## Code Style

- **Biome** for linting and formatting (single quotes, 2-space indent, 100 line width)
- TypeScript with `"type": "module"` throughout
- CI runs `biome check` and `vitest` on PRs
