# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Todoji (투두지) is a city-building simulation web app that recommends and tracks todo items for goal achievement. As users complete tasks, buildings are constructed on a map, creating a growing city visualization. The project uses isometric-inspired 2D design implemented with Pixi.js for lightweight, smooth web performance.

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **UI Libraries**: Tailwind CSS 4, Material-UI (MUI), shadcn/ui components, Headless UI
- **2D Graphics**: Pixi.js 8, @pixi/react for interactive map rendering with zoom/pan/drag capabilities
- **Animation**: Motion (Framer Motion)
- **Date Handling**: dayjs, date-fns, MUI Date Pickers
- **State Management**: Context API (no external state management library currently)

## Common Commands

```bash
# Development
npm run dev          # Start development server (Next.js dev mode)

# Build & Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

## Architecture Overview

### App Structure (Next.js App Router)

The project uses Next.js 15 App Router with the following key pages:

- `/` (root) - Redirects to `/home`
- `/home` - Main application interface with city map and todo list
- `/goal-setting` - Multi-step goal creation wizard (5 steps)
- `/weekly-feedback` - Weekly feedback modal/page
- `/profile` - User profile page
- `/dashboard` - Dashboard page

### Core UI Patterns

#### 1. Bottom Sheet Pattern

The main interface (`/home`) uses a custom draggable bottom sheet implementation:

- **Components**: `BottomSheet` component with `useDragToSnap` hook
- **Context**: `BottomSheetContext` provides `currentSnapRatio` and `mapZoomRatio` to coordinate UI state
- **Snap Points**: Configurable height ratios (default: `[0.04, 0.35, 1]` = 4%, 35%, 100% of viewport)
- **Interaction**: Bottom sheet height inversely affects map zoom level (lower sheet = more map visible)

The bottom sheet contains the todo list, while the city map (Pixi.js canvas) renders behind it at full screen.

#### 2. Modal Pattern

Two modal systems are in use:

- **CustomModal**: MUI-based modal wrapper (src/app/components/CustomModal.tsx)
  - Used for: TodoDetailModalContent, VillageDetailModalContent, BuildingDetailModalContent, NewGoalCreationModalContent
  - Centered overlay with consistent styling

- **useModal Hook**: Custom hook for modal state management (src/app/hooks/useModal.ts)
  - Returns: `isOpen`, `selectedItem`, `handleOpenWithItem`, `handleCloseModal`

#### 3. City Map Architecture

- **Component**: `CityAreaContents` (src/app/components/CityAreaContents.tsx)
- **Rendering**: Full-screen background layer that stays behind the bottom sheet
- **Context Integration**: Consumes `mapZoomRatio` from `BottomSheetContext` to adjust Pixi.js zoom
- **Interactivity**:
  - Village click handler: Opens village detail modal
  - Building click handler: Opens building detail modal with status (`NOT_BUILDABLE`, `BUILDABLE`, `BUILT`)

**Note**: Pixi.js integration is planned but not fully implemented yet. Current implementation shows placeholder UI.

### State Management

- **Context API**: Primary state mechanism
  - `BottomSheetContext`: Manages bottom sheet snap state and derived map zoom ratio
- **Local State**: Component-level `useState` for modals, forms, and UI interactions
- **No Global Store**: Currently no Redux, Zustand, or similar library

### Component Patterns

- **Client Components**: Most components use `'use client'` directive due to interactive nature
- **Modal Content Components**: Separate content components for each modal type (e.g., `TodoDetailModalContent`, `VillageDetailModalContent`)
- **Custom Hooks**:
  - `useDragToSnap`: Pointer event handling for draggable bottom sheet
  - `useModal`: Modal open/close state management

## Development Guidelines

### File Organization

- `src/app/components/` - Shared/reusable components (modals, bottom sheet, etc.)
- `src/app/context/` - React Context providers
- `src/app/hooks/` - Custom React hooks
- Route pages live in their respective directories under `src/app/`

### TypeScript Configuration

- Strict mode enabled
- Path alias configured: `@/*` maps to `src/*`
- Target: ES2017

### Styling Approach

- **Primary**: Tailwind CSS utility classes
- **MUI Components**: Material-UI components (Box, Modal, DatePicker) with inline `sx` styles
- **Global Styles**: `src/app/globals.css`
- **Color System**: Some hardcoded colors exist (e.g., `#D9D9D9`, `#FFF`) - consider extracting to design tokens

### Gitmoji Commit Convention

This repository uses Gitmoji for commit messages. Common emojis:

- ✨ `:sparkles:` - New features
- 🐛 `:bug:` - Bug fixes
- 🎨 `:art:` - Code structure/style improvements (no functional change)
- 💄 `:lipstick:` - UI/style changes
- 🔧 `:wrench:` - Configuration changes
- 🔥 `:fire:` - Remove code/files

**When creating commits**, follow this convention and include co-authorship footer:
```
✨ Add feature description

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Key Implementation Details

### Bottom Sheet Drag Mechanics

The `useDragToSnap` hook handles pointer events to create smooth drag-to-snap behavior:

1. **Pointer Down**: Captures starting position and current transform
2. **Pointer Move**: Updates translateY in real-time (transitions disabled)
3. **Pointer Up**: Snaps to nearest snap point based on drag distance (50px threshold)
4. Global event listeners ensure tracking continues even when pointer leaves element

### Goal Setting Flow

The `/goal-setting` page implements a 5-step wizard:

1. Final Goal (with deadline selection: date range or duration)
2. Sub-goal 1 (with action items)
3. Sub-goal 2 (with action items)
4. Sub-goal 3 (with action items)
5. Village Name

Features a custom progress bar component and inline calendar component.

### Modal Management

Multiple modals can be mounted simultaneously in `/home` page. Each modal has:
- Independent open/close state
- Selected item state (todo, village, building)
- Callback handlers passed from parent

## Known Issues & TODOs

- City map Pixi.js integration is incomplete (placeholder UI currently)
- Typo: `/dashbord` directory should be `/dashboard`
- TODO comments indicate:
  - Global style variables needed for colors (CustomModal.tsx:7)
  - Map zoom ratio calculation refinement (BottomSheetContext.tsx:24)
- No backend integration yet (static/mock data)
