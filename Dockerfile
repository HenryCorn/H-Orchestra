# ============================================================
# Stage 1: Builder
# ============================================================
FROM node:20-alpine AS builder

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace manifests first for layer caching
COPY pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/

RUN pnpm install --frozen-lockfile

# Copy source
COPY tsconfig.base.json ./
COPY packages/shared/ ./packages/shared/
COPY packages/backend/ ./packages/backend/
COPY packages/frontend/ ./packages/frontend/

# Build in dependency order
RUN pnpm --filter @h-orchestra/shared build
RUN pnpm --filter @h-orchestra/frontend build
RUN pnpm --filter @h-orchestra/backend build

# ============================================================
# Stage 2: Production image
# ============================================================
FROM node:20-alpine AS production

RUN apk add --no-cache su-exec
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy built artifacts
COPY --from=builder /app/packages/backend/dist/ ./packages/backend/dist/
COPY --from=builder /app/packages/frontend/dist/ ./packages/frontend/dist/
COPY --from=builder /app/packages/shared/dist/ ./packages/shared/dist/
COPY --from=builder /app/packages/backend/package.json ./packages/backend/
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./

# Install production deps only
RUN pnpm install --prod --frozen-lockfile

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
ENV CHOKIDAR_USEPOLLING=true
ENV MOUNT_PATH=/mounted-repo

EXPOSE 3001
VOLUME ["/mounted-repo"]

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "packages/backend/dist/index.js"]
