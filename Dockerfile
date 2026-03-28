# Build stage
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

# Clean install (better for CI/CD)
RUN npm ci || npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev || npm install --only=production --legacy-peer-deps

EXPOSE 5000

CMD ["node", "dist/server.js"]
