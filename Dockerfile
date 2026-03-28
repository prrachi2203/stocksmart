# Build stage
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

# Install ALL deps (including dev)
RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Install only production deps
RUN npm install --omit=dev

EXPOSE 5000

CMD ["node", "dist/server.js"]
