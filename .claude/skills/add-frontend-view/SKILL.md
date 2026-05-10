---
name: add-frontend-view
description: Add a new top-level view (route) to packages/frontend/. Use when the feature is a frontend-view-* item — a full panel rendered by the active-view router.
---

# add-frontend-view

Recipe for adding a top-level view.

## Where things live

```
packages/frontend/src/
  components/
    <area>/
      <Area>View.tsx              ← the panel
      sub-components.tsx          ← cards, panels owned by this view
  hooks/
    use<Area>.ts                  ← selector + SSE wiring
  stores/
    <area>.store.ts               ← Zustand slice (or extend harness.store)
  api/
    client.ts                     ← add fetch<Area>() method
  App.tsx                         ← register in ActiveView union + router
  components/layout/Sidebar.tsx   ← add nav entry
```

## Steps

1. **Define types** if the view needs new ones — usually they already live in `@h-orchestra/shared`.
2. **Add an API client method** in `src/api/client.ts` matching the backend route.
3. **Add a hook** `src/hooks/use<Area>.ts` that selects from the store and triggers the initial fetch.
4. **Build the view component** at `src/components/<area>/<Area>View.tsx`:
   - Token-driven styling: `var(--color-*)`, `var(--font-*)`, `var(--spacing-*)`.
   - Zero hex literals. Zero Tailwind color utilities.
   - Touch targets ≥44px.
   - Use the design-system primitives (`Card`, `Badge`, `PillButton`, etc.) — never reimplement.
   - Empty states are explicit text (`[NO DATA]`), not blank panels.
5. **Register in App.tsx**:
   - Add the view to the `ActiveView` union type.
   - Add a `case` to the active-view router.
6. **Add a Sidebar entry** in `src/components/layout/Sidebar.tsx`. Space Mono, ALL CAPS, with a keyboard shortcut number.
7. **Hook up SSE.** If the view needs live updates, ensure the relevant SSE event is dispatched into the store by `useSSE`.
8. **Write tests** with `@testing-library/react`:
   - Render the view inside a real Zustand store
   - Assert against rendered DOM (`getByRole`, `getByText`)
   - Use `userEvent` for interactions
   - **Do not** use `toMatchSnapshot` as the only assertion
9. **Run `pnpm --filter @h-orchestra/frontend typecheck && test`**.
10. **Run `./init.sh`**.
11. **Smoke check** in the dev server: open http://localhost:5173, navigate to the new view, confirm it renders without console errors.

## Anti-patterns

- Tailwind color utilities (`bg-red-500`, `text-gray-400`). Use `var(--color-*)` only.
- Inline hex literals or RGB strings. Tokens only.
- Modal popups for content (Nothing Design rule — expand inline).
- Skeleton loading screens. Use `[LOADING…]` text.
- Toast notifications. Use inline `[SAVED]` text near the action.
- Sad-face illustrations or emoji as UI elements.
- Snapshot-only tests.
