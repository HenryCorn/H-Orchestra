---
name: add-backend-parser
description: Add a new file/format parser to packages/backend/src/parsers/. Use when a feature parses a new harness artifact (markdown, JSON, YAML) into a typed shape.
---

# add-backend-parser

Recipe for adding a parser. Implementer uses this when the feature is `backend-parser-*`.

## Where things live

```
packages/backend/src/parsers/
  index.ts                       ← ParserRegistry, buildHarnessSnapshot
  <name>.parser.ts               ← new parser
  __tests__/
    fixtures/                    ← real fixture files
    <name>.parser.test.ts        ← tests against fixtures
```

## Contract

Every parser exports a single function:

```ts
export async function parse<Name>(filePath: string): Promise<Result<<Name>, ParseError>>
```

- Returns `Result<T, ParseError>` (from `@h-orchestra/shared`). Never throws on malformed input.
- File-not-found returns `Result.err({ code: 'FILE_NOT_FOUND', path })`.
- Malformed input returns `Result.err({ code: 'PARSE_ERROR', path, detail })`.
- Success returns `Result.ok(<T>)`.

## Steps

1. **Define the output type** in `packages/shared/src/types/<name>.ts` and re-export from `packages/shared/src/index.ts`.
2. **Add parser error codes** to `packages/shared/src/errors.ts` if the existing taxonomy doesn't fit.
3. **Create the parser file** `packages/backend/src/parsers/<name>.parser.ts`.
   - Read with `fs.readFile(path, 'utf8')`.
   - Catch `ENOENT` → `Result.err({ code: 'FILE_NOT_FOUND', path })`.
   - Parse (gray-matter for markdown frontmatter, `JSON.parse` with try/catch for JSON).
   - Validate shape; collect issues into a single `ParseError`.
4. **Add fixtures** in `packages/backend/src/parsers/__tests__/fixtures/<name>/`:
   - `valid.<ext>` (happy path)
   - `malformed.<ext>` (missing required field or syntax error)
   - `empty.<ext>`
5. **Write tests** in `packages/backend/src/parsers/__tests__/<name>.parser.test.ts`. Real fs reads. No `vi.mock`.
6. **Register in `parsers/index.ts`** with the file glob it handles.
7. **Run `pnpm --filter @h-orchestra/backend test`** and confirm green.
8. **Run `./init.sh`**.

## Acceptance pattern

Every parser feature should have these acceptance criteria:

- Parser exports `parse<Name>(filePath): Promise<Result<<Name>, ParseError>>`
- Tests run against real fixture files (no `vi.mock`)
- Malformed input returns `Result.err`, never throws
- Missing file returns `Result.err({ code: 'FILE_NOT_FOUND' })`
- Registered in `parsers/index.ts`

## Anti-patterns

- `vi.mock('node:fs')` — forbidden. See `docs/verification.md`.
- Throwing on malformed input — return `Result.err`.
- Coupling to other parsers — each parser is independent; the aggregator composes them.
- Caching inside the parser — caching belongs to the route layer.
