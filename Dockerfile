# --- STAGE 1: Build ---
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# --- STAGE 2: Production ---
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy package files
COPY package*.json ./

# Install only production dependencies + tsx (needed for server.ts)
RUN npm ci --omit=dev && npm install tsx --no-save

# Copy built assets and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/index.html ./index.html
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/vite.config.ts ./vite.config.ts

# Expose port (Cloud Run uses PORT env, default 8080)
EXPOSE 8080

# Run server
CMD ["npm", "start"]
