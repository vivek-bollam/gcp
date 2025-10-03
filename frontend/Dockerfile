# =========================
# Build stage
# =========================
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# =========================
# Production stage
# =========================
FROM nginx:alpine

# Update all packages including libexpat
RUN apk update && apk upgrade

# Copy built app from build stage
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


