#!/bin/bash
# Deployment script for Context Generator application

# Exit on error
set -e

# Load environment variables from .env.production
if [ -f .env.production ]; then
  export $(grep -v '^#' .env.production | xargs)
else
  echo "Error: .env.production file not found!"
  exit 1
fi

# Check if docker and docker-compose are installed
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Aborting."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose is required but not installed. Aborting."; exit 1; }

# Display deployment info
echo "===== Context Generator Deployment ====="
echo "Environment: PRODUCTION"
echo "Timestamp: $(date)"
echo "=======================================\n"

# Build and deploy with Docker Compose
echo "Building and deploying application..."
docker-compose -f docker-compose.yml build --no-cache
docker-compose -f docker-compose.yml up -d

# Check if containers are running
echo "Checking container status..."
sleep 5
if [ "$(docker ps -q -f name=context-generator)" ]; then
  echo "✓ Application container is running"
else
  echo "✗ Application container failed to start. Check logs with 'docker logs context-generator'"
  exit 1
fi

if [ "$(docker ps -q -f name=context-generator-mongodb)" ]; then
  echo "✓ MongoDB container is running"
else
  echo "✗ MongoDB container failed to start. Check logs with 'docker logs context-generator-mongodb'"
  exit 1
fi

echo "\nDeployment completed successfully!"
echo "The application is available at: http://localhost:$PORT"