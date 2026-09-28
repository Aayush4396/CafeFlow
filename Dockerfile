# Multi-stage build for CafeFlow (React + Express unified server)
FROM node:20-slim AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
RUN npm ci

# Copy source code and build frontend bundle
COPY . .
RUN npm run build

# Production runtime container
FROM node:20-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies including tsx
COPY package*.json ./
RUN npm ci --omit=dev && npm install tsx

# Copy built frontend assets and server files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/tsconfig.json ./

EXPOSE 3000

# Start unified Node.js/Express server via package.json start script
CMD ["npm", "start"]
