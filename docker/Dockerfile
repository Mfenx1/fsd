# syntax=docker/dockerfile:1
FROM node:20-alpine3.20 AS remotes

WORKDIR /app

COPY remotes/products/package.json remotes/products/package-lock.json* remotes/products/
WORKDIR /app/remotes/products
RUN --mount=type=cache,target=/root/.npm \
  npm ci 2>/dev/null || npm install
COPY remotes/products/ ./
RUN npm run build:remote

WORKDIR /app
COPY remotes/chat/package.json remotes/chat/package-lock.json* remotes/chat/
WORKDIR /app/remotes/chat
RUN --mount=type=cache,target=/root/.npm \
  npm ci 2>/dev/null || npm install
COPY remotes/chat/ ./
RUN npm run build:remote

FROM node:20-alpine3.20 AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
  npm ci --ignore-scripts

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_PRODUCTS_REMOTE_URL=/remotes/products.js
ENV NEXT_PUBLIC_CHAT_REMOTE_URL=/remotes/chat.js

COPY . .
RUN mkdir -p public/remotes
COPY --from=remotes /app/remotes/products/dist-remote/products.js public/remotes/
COPY --from=remotes /app/remotes/products/dist-remote/manifest.json public/remotes/products-manifest.json
COPY --from=remotes /app/remotes/chat/dist-remote/chat.js public/remotes/
COPY --from=remotes /app/remotes/chat/dist-remote/style.css public/remotes/chat.css
COPY --from=remotes /app/remotes/chat/dist-remote/manifest.json public/remotes/chat-manifest.json

ENV DOCKER_BUILD=1
RUN --mount=type=cache,target=/app/.next/cache \
  npm run build:docker

FROM node:20-alpine3.20 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3000/api/health || exit 1

LABEL org.opencontainers.image.source=""
LABEL org.opencontainers.image.description="Next.js Host + federated remotes"

CMD ["node", "server.js"]
