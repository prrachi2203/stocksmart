# Build stage
FROM node:20 AS builder

WORKDIR /app

COPY . .

# Install only once
RUN npm install --legacy-peer-deps

RUN npm run build

# Runtime stage
FROM node:20-slim

WORKDIR /app

# Copy only built output
COPY --from=builder /app/dist ./dist

# Minimal package.json (no heavy deps)
COPY package.json .

# Install ONLY runtime deps
RUN npm install express

EXPOSE 5000

CMD ["node", "dist/server.js"]
