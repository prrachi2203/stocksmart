# Multi-stage build for production
FROM node:20-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Final stage
FROM node:20-slim

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.ts ./
RUN npm install --production
RUN npm install -g tsx

EXPOSE 3000
CMD ["npm", "run", "start"]
