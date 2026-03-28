# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build without needing API key
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache dumb-init

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.ts ./

RUN npm install --omit=dev

EXPOSE 5000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
