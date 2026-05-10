# H-Orchestra — TypeScript Conventions

## Strict Mode

All packages use `strict: true`. This means:
- No implicit `any` — annotate everything
- No unchecked array access — guard `arr[0]` with a null check or non-null assertion with justification
- No `// @ts-ignore` — fix the underlying type issue
- No `as unknown as X` casts — design around the type system

## Module Resolution

**Backend** uses `NodeNext` module resolution. All relative imports must use `.js` extension:
```typescript
import { parseFeatureList } from './feature-list.parser.js';  // correct
import { parseFeatureList } from './feature-list.parser';      // wrong — fails at runtime
```

**Frontend** uses `Bundler` resolution (Vite handles it). No `.js` extension needed.

**Cross-package** imports always use the package name:
```typescript
import type { FeatureTask } from '@h-orchestra/shared';  // correct
import type { FeatureTask } from '../../shared/src/...'; // wrong — never
```

## Nothing Design CSS Rules

```typescript
// CORRECT
style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}

// WRONG — never use Tailwind color/typography utilities
className="text-white bg-gray-900 font-mono"
```

Layout Tailwind utilities are allowed: `flex`, `grid`, `items-center`, `gap-4`, `w-full`, `overflow-hidden`, `truncate`, `col-span-*`.

## Comments

Write comments only for non-obvious WHY, never for WHAT:
```typescript
// CORRECT — explains a hidden constraint
// .tmp suffix prevents watcher from reading partial writes
await rename(tmp, target);

// WRONG — describes what the code does
// rename the temp file to the target path
await rename(tmp, target);
```

No multi-line comment blocks. No JSDoc for internal functions.

## File Organization

One concept per file. Named exports preferred over default for components (exception: route files use default exports because Fastify plugin convention).

Parser files: `<name>.parser.ts`
Route files: `<name>.route.ts`
Component files: `<Name>View.tsx` for views, `<Name>.tsx` for primitives

## Error Handling

Parsers must never throw — return a safe fallback:
```typescript
try {
  return JSON.parse(content) as FeatureList;
} catch {
  return { path: filePath, tasks: [], lastModified: new Date().toISOString() };
}
```

Routes may throw — Fastify catches and returns 500. But prefer explicit error handling at system boundaries (user input, external APIs).

## Adding to the Shared Package

After modifying `packages/shared/src/`, run:
```bash
pnpm --filter @h-orchestra/shared build
```
before typechecking the backend or frontend. The shared package exports compiled `dist/` — the consumers see the built output.
