# syntax=docker/dockerfile:1
FROM node:20-alpine3.20@sha256:3bc9a4c4cc25cfde1e8f946341c85f333c36517aafda829b4bb7e785e9b5995c AS host-builder
WORKDIR /app
ARG NEXT_PUBLIC_PRODUCTS_REMOTE_URL=/remotes/products.js
ARG NEXT_PUBLIC_CHAT_REMOTE_URL=/remotes/chat.js
ARG NEXT_PUBLIC_APP_URL=http://localhost
ARG NEXT_PUBLIC_API_BASE=https://dummyjson.com

COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
  npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts

COPY . .
RUN --mount=type=cache,target=/app/.next/cache \
  DOCKER_BUILD=1 NEXT_TELEMETRY_DISABLED=1 \
  NEXT_PUBLIC_PRODUCTS_REMOTE_URL="$NEXT_PUBLIC_PRODUCTS_REMOTE_URL" \
  NEXT_PUBLIC_CHAT_REMOTE_URL="$NEXT_PUBLIC_CHAT_REMOTE_URL" \
  NEXT_PUBLIC_APP_URL="$NEXT_PUBLIC_APP_URL" \
  NEXT_PUBLIC_API_BASE="$NEXT_PUBLIC_API_BASE" \
  npm run build:docker

FROM node:20-alpine3.20 AS products-builder
WORKDIR /app
COPY remotes/products/package.json remotes/products/package-lock.json* ./
RUN npm ci 2>/dev/null || npm install
COPY remotes/products/ .
RUN npm run build:remote

FROM node:20-alpine3.20 AS chat-builder
WORKDIR /app
COPY remotes/chat/package.json remotes/chat/package-lock.json* ./
RUN npm ci 2>/dev/null || npm install
COPY remotes/chat/ .
RUN npm run build:remote

FROM node:20-alpine3.20
RUN apk add --no-cache nginx

WORKDIR /var/www

RUN mkdir -p /var/www/host
COPY --from=host-builder /app/.next/standalone/ /var/www/host/
COPY --from=host-builder /app/.next/static /var/www/host/.next/static
COPY --from=host-builder /app/public /var/www/host/public

RUN mkdir -p /var/www/products
COPY --from=products-builder /app/dist-remote/products.js /var/www/products/
COPY --from=products-builder /app/dist-remote/manifest.json /var/www/products/

RUN mkdir -p /var/www/chat
COPY --from=chat-builder /app/dist-remote/chat.js /var/www/chat/
COPY --from=chat-builder /app/dist-remote/manifest.json /var/www/chat/
COPY --from=chat-builder /app/dist-remote/style.css /var/www/chat/

COPY docker/one-server/nginx.conf /etc/nginx/nginx.conf
COPY docker/one-server/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
