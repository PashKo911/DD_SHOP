# ---------- Dockerfile (place in repo root) ----------
# Stage 1: build client (Vite)
FROM node:18-bullseye AS client-build
WORKDIR /app/client

# copy client package files first for layer caching
COPY client/package*.json ./
# if you use pnpm/yarn adjust commands
RUN npm install --legacy-peer-deps --force

# copy client sources and build
COPY client/ ./
RUN npm run build

# Stage 2: install server production deps
FROM node:18-alpine AS server-deps
WORKDIR /app/server

COPY server/package*.json ./
# use ci if you have lockfile, otherwise npm install
RUN npm ci --production --no-audit --silent

# Stage 3: final image
FROM node:18-alpine AS final
WORKDIR /app

# copy built client
COPY --from=client-build /app/client/dist ./client/dist

# copy server code and prod node_modules
COPY --from=server-deps /app/server/node_modules ./server/node_modules
COPY server ./server

ENV NODE_ENV=production

# Expose a default port; Render will set PORT env var at runtime
EXPOSE 3000

# If your server entry is server/index.js and it uses process.env.PORT -> good.
# Using node directly (avoid relying on npm start to reduce layers).
# CMD ["node", "server/app.mjs"]
CMD ["npm", "start"]
# ----------------------------------------------------
