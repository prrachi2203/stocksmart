# Build stage
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Production stage
FROM node:18-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./

RUN npm install --only=production --legacy-peer-deps

EXPOSE 5000

CMD ["node", "dist/server.js"]
