FROM node:20

WORKDIR /app

COPY package*.json ./

# install ONLY production deps
RUN npm install --omit=dev

COPY . .

# build (uses dev deps already in repo build stage)
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]
