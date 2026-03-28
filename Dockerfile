# Build stage
FROM node:20 AS builder

WORKDIR /app

COPY . .

# Install with relaxed rules
RUN npm install --force

RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./

RUN npm install --omit=dev --force

EXPOSE 5000

CMD ["node", "dist/server.js"]
