# Stage 1: Build
FROM oven/bun:1.3.9-alpine AS builder

WORKDIR /app

# Copy monorepo root files needed for workspace resolution
COPY package.json bun.lock ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Install all workspace dependencies
RUN bun install

# Build-time public env vars (inlined by SvelteKit at build time)
ARG PUBLIC_TEST_VAR
ENV PUBLIC_TEST_VAR=$PUBLIC_TEST_VAR

# Build the SvelteKit app
WORKDIR /app/apps/web
RUN bun run build

# Stage 2: Production
FROM oven/bun:1.3.9-alpine AS runner

WORKDIR /app

# Copy the built output (adapter-node bundles the server)
COPY --from=builder /app/apps/web/build ./build

EXPOSE 3000

CMD ["bun", "build/index.js"]
