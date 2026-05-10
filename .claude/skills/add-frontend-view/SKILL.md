---
name: add-frontend-view
description: Add a new view panel to the H-Orchestra UI following the Nothing Design system
trigger: add a view for
version: 1.0.0
author: H-Orchestra
tags:
  - frontend
  - react
  - nothing-design
  - typescript
---

## Context

Views are full-panel components rendered by `App.tsx` based on `useUIStore().activeView`. Navigation is controlled by the `Sidebar.tsx` `NAV_ITEMS` array. Each view should follow the Nothing Design system strictly — CSS custom properties for all colors/typography, Tailwind only for layout utilities.

## Steps

1. **Create the view component** at `packages/frontend/src/components/<name>/<Name>View.tsx`
   - Wrap content in a `<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', maxWidth: 900 }}>` container
   - Start with an `<h1 className="text-heading">VIEW NAME</h1>` heading
   - Use existing primitives from `components/primitives/`: `Card`, `PillButton`, `Badge`, `SegmentedProgress`, `MetricDisplay`
   - Labels: always use `<span className="label">LABEL TEXT</span>` (auto uppercase, mono)
   - Code/paths: `fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)'`
   - Never use Tailwind color or typography utilities

2. **Add the view name** to the `ActiveView` union in `packages/frontend/src/stores/ui.store.ts`
   ```typescript
   export type ActiveView = 'dashboard' | 'tasks' | ... | '<name>';
   ```

3. **Add a nav entry** in `packages/frontend/src/components/layout/Sidebar.tsx`
   - Add to `NAV_ITEMS` array: `{ view: '<name>', label: 'LABEL', glyph: '◈' }`
   - Pick an unused Unicode glyph (geometric/technical characters preferred)
   - Label: ALL CAPS, max 6 characters

4. **Register the view** in `packages/frontend/src/App.tsx`
   - Import: `import { <Name>View } from './components/<name>/<Name>View';`
   - Add: `{activeView === '<name>' && <<Name>View />}`

5. **Create a hook** if the view needs data (at `packages/frontend/src/hooks/use<Name>.ts`)
   - Prefer Zustand selectors from `harness.store.ts` for harness data
   - Use `useEffect` + `api.<name>.list()` for data not in the SSE stream

6. **Run typecheck**: `pnpm typecheck`

7. **Visual check**: Start `pnpm dev`, navigate to the new view, verify:
   - Text uses Space Grotesk (body) or Space Mono (labels/metadata)
   - Background is `var(--color-surface)` for cards, `#000` for root
   - No colored elements except `var(--color-critical)` for errors
   - Borders are 1px solid `var(--color-border)` (#2A2A2A)
