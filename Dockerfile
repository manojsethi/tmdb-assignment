FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 9000

ENV TMDB_PORT=9000
ENV TMDB_BASE_URL=https://api.themoviedb.org/3
ENV NODE_ENV=production

CMD ["node", "dist/modules/main"]
