# Build frontend
FROM node:20 AS frontend

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Backend runtime
FROM node:20-slim

WORKDIR /app

# Copy built frontend
COPY --from=frontend /app/dist ./dist

# Install ONLY backend deps
COPY package*.json ./
RUN npm install --omit=dev

EXPOSE 5000

CMD ["node", "dist/server.js"]
