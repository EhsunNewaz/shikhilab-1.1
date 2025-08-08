# Multi-stage build for optimized production image
FROM node:20.11.1-slim AS base

# Security: Create non-root user early
RUN groupadd -r nodejs --gid=1000 && useradd -r -g nodejs --uid=1000 nodejs

# Security: Install only essential packages and security updates
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    curl \
    ca-certificates \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

WORKDIR /app
COPY package.json package-lock.json turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/

# Dependencies stage
FROM base AS deps
RUN npm ci --include=dev

# Build stage
FROM deps AS build
COPY --chown=nodejs:nodejs apps/api ./apps/api
COPY --chown=nodejs:nodejs packages ./packages
WORKDIR /app/apps/api
USER nodejs
RUN npm run build && npm prune --production --omit=dev

# Production stage  
FROM node:20.11.1-slim AS production

# Security: Create non-root user
RUN groupadd -r nodejs --gid=1000 && useradd -r -g nodejs --uid=1000 nodejs

# Security: Install security updates and minimal packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    curl \
    ca-certificates \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

WORKDIR /app
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=build --chown=nodejs:nodejs /app/apps/api/package.json ./apps/api/
COPY --from=build --chown=nodejs:nodejs /app/packages ./packages

WORKDIR /app/apps/api

# Health check with proper error handling
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8080}/health || exit 1

# Security: Remove package managers and unnecessary files
RUN rm -rf /opt/yarn-* /usr/local/bin/yarn* /usr/local/bin/npm* 2>/dev/null || true

# Security: Run as non-root user
USER nodejs

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]