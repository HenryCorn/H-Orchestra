# Verification

The reviewer's C4 gate (`CHECKPOINTS.md`) demands "real verification — no mocks". This file says exactly what that means.

## Why no mocks

We're building a tool that watches files, parses harness artifacts, and serves them over HTTP/SSE. Every layer touches real filesystem or network state. Mocking those layers tests the mock, not the code. Mocked tests pass while production breaks — that's how the previous attempt accumulated technical debt.

## What to do instead

### Backend parsers

- Test against fixture files in `packages/backend/src/parsers/__tests__/fixtures/`.
- Fixtures should include: a happy path, a malformed example, and an edge case (empty file, missing field).
- Use `node:fs/promises` directly. **Do not `vi.mock('node:fs')`**.

### Backend routes

- Spin up a real Fastify instance per test (`fastify()` then `await app.ready()`).
- Make real HTTP requests via `app.inject()` or `supertest`.
- Read and write actual files in a `mkdtemp()` directory; clean up in `afterEach`.
- **Do not mock `fastify`, `node:http`, or any Fastify plugin.**

### Backend watcher

- Spin up a real Chokidar instance against a tmp directory.
- Trigger filesystem events with real `fs.writeFile` / `fs.unlink`.
- Assert events arrive within a tolerance (e.g. `await waitFor(() => events.length === 1, { timeout: 1000 })`).

### Frontend components

- Use `@testing-library/react` to render and `userEvent` to interact.
- Assert against rendered DOM via `getByRole`, `getByText`, `findByLabelText`.
- **Do not use `toMatchSnapshot()` as the only assertion** — snapshots silently update and don't enforce behaviour.

### Frontend hooks

- Test hooks via `renderHook` from `@testing-library/react`.
- Real Zustand store, real reducer.
- Mock only network at the boundary using `vi.spyOn(globalThis, 'fetch')` returning a `Response`.

### Mermaid output

- Validate with `mermaid.parse()` rather than string equality. The library handles whitespace and formatting; we only care that the output is a valid sequence diagram with the expected actors and messages.

### End-to-end

- E2E tests run a real backend bound to an ephemeral port and a real headless browser (Playwright) against the served frontend.
- The mounted repo is a fixture in `e2e/fixtures/<harness-name>/`.
- Assertions are against rendered text and HTTP responses, not internal state.

## Acceptable mocks

There are three legitimate cases for a mock:

1. **Network at the system boundary.** Mocking `fetch` against an external API (Langfuse, Helicone) is fine. Use `vi.spyOn(globalThis, 'fetch')` returning a real `Response` object.
2. **Time.** `vi.useFakeTimers()` to test debounce / throttle / heartbeat behaviour.
3. **Random.** `vi.spyOn(crypto, 'randomUUID')` if you need deterministic ids in a test.

Anything else needs a comment in the test explaining why.

## Pre-commit verification

The implementer's `progress/impl_<id>.md` must show evidence of:

- `pnpm typecheck` exit 0
- `pnpm test` exit 0 with at least one new test exercising the feature
- `./init.sh` exit 0

The reviewer re-runs all three and rejects with `CHANGES_REQUESTED:` if any fails.

## CI verification

The `ci.yml` workflow runs the full stack on every PR:

- `pnpm install --frozen-lockfile`
- `pnpm typecheck`
- `pnpm -r build`
- `pnpm test`
- `actionlint` on workflows

The `harness.yml` workflow runs `./init.sh` and asserts feature_list invariants. The `docker.yml` workflow builds the image and curls `/health` against the running container.

A PR cannot merge with any of these failing.
