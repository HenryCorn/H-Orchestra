# syntax=docker/dockerfile:1.7

# ----- Stage 1: builder -----
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* tsconfig.base.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY packages/backend ./packages/backend
COPY packages/frontend ./packages/frontend

RUN pnpm -r build

# Frontend bundle is served statically from backend; copy into a known location.
RUN mkdir -p packages/backend/public \
 && cp -R packages/frontend/dist/. packages/backend/public/

# Prune dev deps so the runtime image stays small.
RUN pnpm install --prod --frozen-lockfile

# ----- Stage 2: runtime -----
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3001 \
    HOST=0.0.0.0 \
    MOUNT_PATH=/mounted-repo \
    CHOKIDAR_USEPOLLING=true

RUN apk add --no-cache wget tini \
 && addgroup -S app && adduser -S -G app app \
 && mkdir -p /mounted-repo /data/templates \
 && chown -R app:app /app /data

COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/packages/shared/package.json ./packages/shared/
COPY --from=builder --chown=app:app /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder --chown=app:app /app/packages/backend/package.json ./packages/backend/
COPY --from=builder --chown=app:app /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder --chown=app:app /app/packages/backend/public ./packages/backend/public
COPY --chown=app:app entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER app
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- "http://localhost:${PORT}/health" || exit 1

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/entrypoint.sh"]
CMD ["node", "packages/backend/dist/index.js"]
