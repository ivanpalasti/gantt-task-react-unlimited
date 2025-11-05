# Copilot Instructions for `gantt-task-react`

## Project Overview
- **Purpose:** Interactive Gantt chart component for React, written in TypeScript.
- **Entry Point:** `src/components/gantt/gantt.tsx` (core Gantt chart logic)
- **Demo/Example:** See `example/` for a runnable demo app and usage patterns.

## Architecture & Key Patterns
- **Component Structure:**
  - `src/components/gantt/` — Main Gantt chart rendering and logic
  - `src/components/calendar/` — Timeline/calendar header
  - `src/components/grid/` — Task grid/table
  - `src/components/task-item/` — Task bar, milestone, and project rendering
  - `src/components/other/` — Arrows, tooltips, scrollbars
  - `src/components/task-list/` — Task list and headers
- **Helpers:**
  - `src/helpers/` — Date, bar, and utility logic
- **Types:**
  - `src/types/` — Core types: `Task`, `BarTask`, `GanttTaskActions`, etc.

## Developer Workflows
- **Build:** `npm run build` (standard React/TypeScript build)
- **Test:** `npm test` (Jest, see `src/App.test.tsx` and `test/`)
- **Run Example:**
  1. `cd example`
  2. `npm install && npm start`
- **Debug:** Use the example app for live debugging; main Gantt logic is in `src/components/gantt/`.

## Project-Specific Conventions
- **Task Types:** `task`, `milestone`, `project` (see `Task` type in `src/types/public-types.ts`)
- **Custom Rendering:**
  - Tooltips, task list headers, and tables are customizable via props (see `README.md` for prop types)
- **Undoable Actions:** Event handlers (e.g., `onDateChange`, `onDelete`) can return `false` or throw to cancel/undo changes.
- **Styling:**
  - CSS Modules for all styles (e.g., `gantt.module.css`)
  - Import `gantt-task-react/dist/index.css` for consumers

## Integration & Extensibility
- **External Usage:** Import `Gantt` and types from the package root
- **Props:** See `README.md` for detailed prop documentation and examples
- **Localization:** Timeline supports locale via `DisplayOption.locale` prop
- **RTL Support:** Enable with `DisplayOption.rtl`

## Examples & References
- **Example Usage:** `example/src/App.tsx` and `README.md`
- **Custom Components:** See `src/components/other/tooltip.tsx` for tooltip customization
- **Type Definitions:** `src/types/` for all public and internal types

---

**For AI agents:**
- Prefer updating or extending existing components over creating new ones unless adding new features
- Follow the established folder/component structure
- Reference the example app and `README.md` for usage patterns
- When in doubt, mimic the style and patterns of `src/components/gantt/gantt.tsx` and related helpers
