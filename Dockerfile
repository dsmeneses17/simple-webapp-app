# ============================================
# Dockerfile — Webapp App Simple
# Lightweight Node.js server for E2E testing
# ============================================
FROM node:20-slim

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm install tsx

# Copy source code
COPY src/ ./src/
COPY .env.example ./.env

# Expose the web server port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "fetch('http://localhost:3000/api/health').then(r => { if(!r.ok) throw 1 }).catch(() => process.exit(1))"

# Start the server
CMD ["npx", "tsx", "src/server/app.ts"]
