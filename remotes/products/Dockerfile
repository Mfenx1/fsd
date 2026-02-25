# syntax=docker/dockerfile:1
FROM node:20-alpine3.20@sha256:3bc9a4c4cc25cfde1e8f946341c85f333c36517aafda829b4bb7e785e9b5995c AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
  (test -f package-lock.json && npm ci) || npm install

COPY . .
RUN npm run build:remote

FROM nginxinc/nginx-unprivileged:alpine AS runner

COPY --from=builder /app/dist-remote/products.js /usr/share/nginx/html/
COPY --from=builder /app/dist-remote/manifest.json /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

LABEL org.opencontainers.image.title="Products Remote"
LABEL org.opencontainers.image.description="ESM module for federated host"

CMD ["nginx", "-g", "daemon off;"]
