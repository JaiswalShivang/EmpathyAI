# Multi-stage build for EmpathyAI application

# Stage 1: Build the client
FROM node:18-alpine AS client-builder

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci --only=production

COPY client/ ./
RUN npm run build

# Stage 2: Setup the server
FROM node:18-alpine AS server

WORKDIR /app

# Copy server files
COPY server/package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY server/ ./

# Copy built client files
COPY --from=client-builder /app/client/dist ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S empathyai -u 1001

# Change ownership of the app directory
RUN chown -R empathyai:nodejs /app
USER empathyai

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

CMD ["npm", "start"]