# Multi-stage build for context generator application

# -------- BASE STAGE --------
FROM node:18-alpine AS base
# Install wget for healthchecks
RUN apk --no-cache add wget
WORKDIR /app
ENV NODE_ENV=production

# -------- DEPENDENCIES STAGE --------
FROM base AS dependencies
# Copy package.json file
COPY package.json ./
# Install dependencies for both client and server
RUN npm install
# Explicitly install security-related dependencies to ensure they're available
RUN npm install --no-save helmet express-rate-limit express-mongo-sanitize xss-clean morgan

# -------- BUILD STAGE --------
FROM base AS build
# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules
# Copy application code
COPY . .
# Skip client build as there's no build script in package.json
# We'll use a static placeholder instead
WORKDIR /app/client
RUN mkdir -p build

# -------- PRODUCTION STAGE --------
FROM base AS production
# Copy only the built client and server files
COPY --from=build /app/client/build ./client/build
COPY --from=build /app/server ./server
COPY --from=build /app/shared ./shared
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production

# Expose the application ports
EXPOSE 5000
EXPOSE 3000

# Add a healthcheck to monitor the container
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the application
CMD ["node", "server/src/server.js"]