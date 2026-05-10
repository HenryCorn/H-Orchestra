# H-Orchestra

A cross-platform Docker-containerized control plane for long-running AI agent harnesses. Mount any repository that follows the [Anthropic multi-agent harness pattern](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) and get real-time visualization of task state, agent roles, session progress, Mermaid sequence diagrams, tracing, and scaffolding templates — all in a monochrome industrial UI.

---

## Quickstart

### Option A — Docker (recommended for using H-Orchestra)

```bash
# Point at any agent project on your machine
REPO_PATH=/path/to/your/agent/project docker compose up

# Open http://localhost:3001
```

On Linux, pass your UID/GID to avoid file permission issues in the mounted volume:

```bash
HOST_UID=$(id -u) HOST_GID=$(id -g) REPO_PATH=/path/to/project docker compose up
```

**With tracing enabled:**

```bash
REPO_PATH=/path/to/project \
LANGFUSE_SECRET_KEY=sk-lf-... \
LANGFUSE_PUBLIC_KEY=pk-lf-... \
docker compose up
```

### Option B — Local dev (for developing H-Orchestra itself)

**Prerequisites:** Node.js ≥ 20, pnpm ≥ 9

```bash
# Install dependencies (one-time)
pnpm install

# Run backend + frontend in watch mode
MOUNT_PATH=/path/to/your/agent/project pnpm dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## What H-Orchestra discovers

Drop it on any repository that follows the [Anthropic multi-agent harness pattern](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) (reference: [betta-tech/ejemplo-harness-subagentes](https://github.com/betta-tech/ejemplo-harness-subagentes)):

| File | Purpose |
|---|---|
| `CLAUDE.md` / `AGENTS.md` | System prompt / navigation map shown in Dashboard |
| `feature_list.json` | Task list with status tracking |
| `progress/current.md` | Live session state shown in Dashboard |
| `progress/history.md` | Completed session archive |
| `CHECKPOINTS.md` | Objective quality gate definitions |
| `init.sh` | Bootstrap + verification script |
| `.claude/agents/*.md` | Agent role definitions (leader, implementer, reviewer) |
| `.claude/skills/*/SKILL.md` | Claude Code skill definitions (legacy) |

---

## Views

| View | What it shows |
|---|---|
| **Dashboard** | Harness health, task completion %, current session state, agent activity feed |
| **Tasks** | Full task list with status cycling, add/delete, drag-to-reorder, filter by status |
| **Diagram** | Auto-generated Mermaid.js sequence diagram from progress history |
| **Agents** | `.claude/agents/` role cards (leader, implementer, reviewer) + checkpoint gates |
| **Tracing** | Langfuse or Helicone traces with span tree |
| **Scaffold** | Apply a Python or .NET harness template to a new project |

---

## Scaffold a new harness

1. Open **Scaffold** view
2. Pick Python or .NET template
3. Fill in project name, Python/dotnet version, test runner
4. Enter the absolute path of the target directory
5. Click **SCAFFOLD** — files are written atomically

This creates: `init.sh`, `CLAUDE.md`, `claude-progress.txt`, `feature_list.json`, `.claude/skills/base/SKILL.md`

---

## Tracing setup

H-Orchestra acts as a proxy to your tracing backend — no CORS issues, credentials stay server-side.

**Langfuse (self-hosted or cloud):**
```bash
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_BASE_URL=https://cloud.langfuse.com   # or your self-hosted URL
```

**Helicone:**
```bash
HELICONE_API_KEY=sk-helicone-...
```

---

## Build for production / multi-arch

```bash
# Build the full stack (shared → frontend → backend)
pnpm build

# Build and push multi-arch Docker image (amd64 + arm64)
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag h-orchestra:latest \
  --push .
```

---

## Project layout

```
H-Orchestra/
├── packages/
│   ├── shared/      TypeScript types only (SSEEvent, HarnessSnapshot, etc.)
│   ├── backend/     Fastify + Chokidar file watcher + parsers + SSE
│   └── frontend/    React 19 + Zustand + Nothing Design UI
├── Dockerfile       Multi-stage, node:20-alpine, su-exec for Linux UID mapping
├── docker-compose.yml
├── docker-compose.dev.yml
└── entrypoint.sh   Platform detection, WSL2 warning, UID/GID mapping
```

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `REPO_PATH` | `.` | Host path to mount (docker compose only) |
| `MOUNT_PATH` | `/mounted-repo` | In-container path of the mounted repo |
| `PORT` | `3001` | Backend listen port |
| `CHOKIDAR_USEPOLLING` | `true` | Force polling for Docker volumes |
| `HOST_UID` | — | Linux: map container process to this UID |
| `HOST_GID` | — | Linux: map container process to this GID |
| `LANGFUSE_SECRET_KEY` | — | Enable Langfuse tracing |
| `LANGFUSE_PUBLIC_KEY` | — | Langfuse public key |
| `LANGFUSE_BASE_URL` | `https://cloud.langfuse.com` | Langfuse endpoint |
| `HELICONE_API_KEY` | — | Enable Helicone tracing |

---

## Windows / WSL2 note

If your project lives on a Windows drive (`C:\`), H-Orchestra will log a warning at startup:

```
WARNING: project is mounted from a Windows drive (/mnt/c/...).
WARNING: File watching across the WSL2/NTFS boundary has high latency.
WARNING: For best performance, clone your project under ~/projects/ in WSL2.
```

For reliable file watching, keep the project on the native WSL2 filesystem (`~/`).

---

## Design system

UI built on the [Nothing Design](https://github.com/dominikmartn/nothing-design-skill) system:
- **Space Grotesk** — body text
- **Space Mono** — code, labels, metadata (ALL CAPS)
- **Doto** — large metric numbers
- Monochrome palette: `#000` background · `#111` surface · `#E8E8E8` text
- Red `#D71921` used exclusively for critical failures
