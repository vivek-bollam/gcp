# Build stage (for deps)
FROM node:18.18.0-alpine3.17 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# Production stage
FROM node:18.18.0-alpine3.17 AS production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
