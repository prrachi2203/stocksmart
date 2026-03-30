# ---------- BUILD STAGE ----------
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache dumb-init
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY server.js ./
RUN npm install --omit=dev
EXPOSE 5000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]

