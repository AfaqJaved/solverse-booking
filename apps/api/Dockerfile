FROM oven/bun:1.3.9-alpine AS base
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---
FROM base AS prepare
COPY . .
RUN bunx turbo@^2 prune @solverse/api --docker

# ---
FROM base AS builder
# Install deps with pruned lockfile (cached layer)
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/bun.lock ./bun.lock
RUN bun install --frozen-lockfile

# Build with full source
COPY --from=prepare /app/out/full/ .
RUN bunx turbo run build --filter=@solverse/api...

# ---
FROM base AS runner

# Root node_modules
COPY --from=builder /app/node_modules ./node_modules

# Per-package node_modules (bun workspace packages may have their own)
COPY --from=builder /app/packages/domain/node_modules ./packages/domain/node_modules
COPY --from=builder /app/packages/persistence/node_modules ./packages/persistence/node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

# Built workspace packages
COPY --from=builder /app/packages/domain ./packages/domain
COPY --from=builder /app/packages/persistence ./packages/persistence

# Compiled API — keep original path so Bun resolves apps/api/node_modules correctly
COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 3001

CMD ["bun", "apps/api/dist/src/main.js"]
