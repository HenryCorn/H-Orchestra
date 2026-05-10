# Conventions

These rules apply to every file in `packages/`. They are enforced by reviewer + ESLint where possible.

## TypeScript

- `strict: true`. No `// @ts-ignore`, `// @ts-expect-error`, or `as unknown as X` without a comment justifying it.
- `noUncheckedIndexedAccess: true`. Treat array/object access as possibly undefined.
- No `any`. When you cannot type something precisely, use `unknown` and narrow.
- Public exports have explicit return types. Local variables can rely on inference.

## Module resolution

- `module: NodeNext`, `moduleResolution: NodeNext`.
- Relative imports use `.js` suffix even in `.ts` source: `import { x } from './x.js';`.
- Cross-package imports via `@h-orchestra/shared`. Never reach into `packages/<other>/src/`.

## File naming

- Source files: `kebab-case.ts` (`feature-list.parser.ts`, `harness-aggregator.ts`).
- React components: `PascalCase.tsx` (`TasksView.tsx`, `MetricDisplay.tsx`).
- Tests: colocated under `__tests__/`, named `<unit>.test.ts` or `<unit>.test.tsx`.
- Fixtures: `__tests__/fixtures/` with realistic content (this repo's own AGENTS.md, real feature_list, etc.).

## Backend patterns

- **Parsers** return `Result<T, ParseError>`. They never throw on malformed input.
- **Routes** are Fastify plugin factories. Register in `packages/backend/src/routes/index.ts`. Use Fastify schema validation.
- **Watchers** emit normalized events on the harness event bus. Subscribers stay decoupled.
- **Atomic writes** for any mutation of `feature_list.json` or harness files: write to `<file>.tmp`, then `rename`.
- **No global state.** Pass dependencies via Fastify decorators or function args.

## Frontend patterns

- **Tokens.css only** for colors, typography, spacing. Tailwind utilities are allowed for layout (`flex`, `grid`, `gap-*`, `p-*`) but never for colors (`bg-red-500` is forbidden).
- **One Zustand store** seeded from initial SSE snapshot, patched by subsequent events. No prop drilling.
- **Hooks** wrap store selectors and SSE subscriptions. Components consume hooks, not stores directly.
- **Views** live in `packages/frontend/src/components/<area>/<Area>View.tsx`. They are full panels rendered by the active route.
- **Primitives** live in `packages/frontend/src/components/primitives/` and are token-driven.
- **Touch targets** ≥44px for interactive elements (Nothing Design accessibility rule).

## Nothing Design hard rules

- No `box-shadow`, `text-shadow`, `filter: blur`, or `linear-gradient` outside reference dot-matrix backgrounds.
- `border-radius` ≤ `--radius-card` (16px) for everything except pill buttons (`--radius-pill` 999px).
- One accent moment per screen. `--color-critical` (#D71921) is reserved for errors and destructive actions.
- Labels: Space Mono, ALL CAPS, `letter-spacing: 0.08em`.
- Body text: Space Grotesk.
- Display numbers (metrics, hero counts): Doto.
- Use opacity or pattern to differentiate data, not extra color.

## Error handling

- At system boundaries (parsers, routes, fetch): catch and convert to typed errors.
- Inside trusted code: let exceptions bubble; framework guarantees apply.
- Never `catch (e) {}`. Either rethrow with context or convert to `Result.err`.

## Logging

- Backend uses Fastify's pino logger. `app.log.info / warn / error`.
- No `console.log` in committed code (allowed in dev iteration, removed before review).

## Testing

- See `docs/verification.md` for the anti-mock policy. Summary: real Chokidar against tmp dirs, real Fastify instance for route tests, real DOM for component tests.
- One test file per source file under `__tests__/`. Test name describes behaviour, not implementation: `it('rejects unknown status values', ...)` not `it('parseFeatureList', ...)`.

## Comments

- Default to no comments. Names should carry the meaning.
- Write a comment only when the **why** is non-obvious (constraint, workaround, surprising invariant).
- Never describe what the next line does.
- No TODOs in committed code; convert to `feature_list.json` entries.

## Commit messages

- Imperative, scoped by feature id: `feat(backend-parser-01): feature_list.json parser with Result<T,E>`.
- One feature per PR. PR title = first line of the lead commit.

## Dependencies

- Add a runtime dep only when justified in the implementer report.
- Prefer the standard library and the existing toolchain over a new package.
- Lockfile is committed; never run `pnpm install --no-frozen-lockfile` in CI.
