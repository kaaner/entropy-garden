# Entropy Garden - Docker Setup

FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# ============================================
# Dependencies Stage
# ============================================
FROM base AS deps

# Copy all package.json files
COPY packages/engine/package.json ./packages/engine/
COPY packages/ai/package.json ./packages/ai/
COPY apps/web/package.json ./apps/web/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# ============================================
# Builder Stage
# ============================================
FROM base AS builder

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/engine/node_modules ./packages/engine/node_modules
COPY --from=deps /app/packages/ai/node_modules ./packages/ai/node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

# Copy source code
COPY packages ./packages
COPY apps ./apps
COPY tsconfig.json ./

# Build packages
RUN pnpm --filter @entropy-garden/engine build
RUN pnpm --filter @entropy-garden/ai build

# Build web app
RUN pnpm --filter @entropy-garden/web build

# ============================================
# Runner Stage (Production)
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/apps/web/public ./apps/web/public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
