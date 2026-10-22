# --- STAGE 1: Build ---
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies (termasuk devDependencies: vite, esbuild, typescript)
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy source code
COPY . .

# Build frontend (dist/) dan bundle server (dist-server/server.js)
RUN npm run build && npm run build:server

# --- STAGE 2: Production ---
FROM node:22-alpine AS runner

WORKDIR /app

# Cloud Run selalu meng-set PORT (default 8080) — nilai ini hanya fallback.
ENV NODE_ENV=production
ENV PORT=8080

# Copy package files
COPY package*.json ./

# Install hanya production dependencies
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

# Copy built assets
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/dist-server ./dist-server
COPY --from=builder --chown=node:node /app/public ./public

# Jalankan sebagai user non-root
USER node

# Expose port
EXPOSE 8080

# Jalankan node langsung (bukan lewat `npm start`) supaya SIGTERM dari
# Cloud Run (scale-to-zero / deploy baru) diterima proses ini sebagai PID 1.
CMD ["node", "dist-server/server.js"]
