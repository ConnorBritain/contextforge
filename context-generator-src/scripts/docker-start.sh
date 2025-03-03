#!/bin/bash

# Stop any running containers
echo "Stopping any running containers..."
docker-compose down

# Install js-yaml if needed
if ! npm list -g js-yaml > /dev/null 2>&1; then
  echo "Installing js-yaml package..."
  npm install -g js-yaml
fi

# Find available ports and update docker-compose.yml
echo "Finding available ports..."
node ./scripts/find-available-ports.js

# Build and start containers
echo "Building and starting Docker containers..."
docker-compose up -d

# Check if containers started successfully
if [ $? -eq 0 ]; then
  echo "Docker containers started successfully!"
  echo "You can now access the application at the URL shown above."
else
  echo "Error: Failed to start Docker containers."
  echo "Please check the error messages above."
fi