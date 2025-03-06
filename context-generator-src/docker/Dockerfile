FROM node:16 AS build

# Server setup
WORKDIR /app
COPY . .
RUN npm install
RUN cd client && npm install

# Build process
RUN cd client && npm run build

# Runtime stage
FROM node:16-slim
WORKDIR /app
COPY --from=build /app .

# Install only production dependencies 
RUN npm ci --only=production
RUN cd client && npm ci --only=production

# Set up entrypoint script that will handle configuration
COPY ./docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "start"]