# Production image. Requires `output: 'standalone'` in next.config.ts.
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat

# ---------- dependencies ----------
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- build ----------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# `next build` imports the Payload config, which validates the environment at
# import time. These values are never used at runtime: the real ones are
# injected by the container.
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URI=postgres://build:build@localhost:5432/build \
    PAYLOAD_SECRET=build-time-placeholder-secret-not-used-at-runtime \
    PREVIEW_SECRET=build-time-placeholder-preview-secret \
    NEXT_PUBLIC_SERVER_URL=http://localhost:3000 \
    S3_BUCKET=build \
    S3_REGION=auto \
    S3_ENDPOINT=http://localhost:9000 \
    S3_ACCESS_KEY_ID=build \
    S3_SECRET_ACCESS_KEY=build \
    S3_FORCE_PATH_STYLE=true \
    S3_PUBLIC_URL=http://localhost:9000/build

RUN npm run build

# ---------- runtime ----------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
