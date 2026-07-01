# ---- deps: install node modules ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

# ---- build: compile Next (standalone output) ----
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- runner: minimal self-contained server ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# non-root user
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -S nextjs

# standalone output bundles only what's needed to run
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
