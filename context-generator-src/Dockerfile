# Multi-stage build for context generator application

# -------- BASE STAGE --------
FROM node:18-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# -------- DEPENDENCIES STAGE --------
FROM base AS dependencies
# Copy package.json file
COPY package.json ./
# Install dependencies for both client and server
RUN npm install

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

# Start the application
CMD ["node", "server/src/server.js"]