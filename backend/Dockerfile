# =========================
# Dependencies stage
# =========================
FROM node:18-alpine AS deps

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# =========================
# Production stage
# =========================
FROM node:18-alpine

WORKDIR /app

# Update all packages including libexpat
RUN apk update && apk upgrade

# Copy dependencies and app code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
