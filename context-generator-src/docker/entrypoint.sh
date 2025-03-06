#!/bin/bash
set -e

echo "Starting ContextForge application container..."

# Create necessary directories if they don't exist
mkdir -p /app/config
mkdir -p /app/client/src/config

# Configure Firebase from environment variables
if [ -n "$FIREBASE_CONFIG" ]; then
  echo "Applying Firebase configuration..."
  
  # Extract server-side config (non REACT_APP_ variables)
  echo "$FIREBASE_CONFIG" | grep -v "^REACT_APP_" > /app/config/.env
  
  # Extract client-side config (REACT_APP_ variables)
  echo "$FIREBASE_CONFIG" | grep "^REACT_APP_" > /app/client/.env
  
  # Extract Firebase configuration values
  API_KEY=$(echo "$FIREBASE_CONFIG" | grep REACT_APP_FIREBASE_API_KEY | cut -d'=' -f2)
  AUTH_DOMAIN=$(echo "$FIREBASE_CONFIG" | grep REACT_APP_FIREBASE_AUTH_DOMAIN | cut -d'=' -f2)
  PROJECT_ID=$(echo "$FIREBASE_CONFIG" | grep REACT_APP_FIREBASE_PROJECT_ID | cut -d'=' -f2)
  STORAGE_BUCKET=$(echo "$FIREBASE_CONFIG" | grep REACT_APP_FIREBASE_STORAGE_BUCKET | cut -d'=' -f2)
  SENDER_ID=$(echo "$FIREBASE_CONFIG" | grep REACT_APP_FIREBASE_MESSAGING_SENDER_ID | cut -d'=' -f2)
  APP_ID=$(echo "$FIREBASE_CONFIG" | grep REACT_APP_FIREBASE_APP_ID | cut -d'=' -f2)
  MEASUREMENT_ID=$(echo "$FIREBASE_CONFIG" | grep REACT_APP_FIREBASE_MEASUREMENT_ID | cut -d'=' -f2)
  
  # Create firebase.js from template if it doesn't exist
  if [ -f /app/client/src/config/firebase.js.example ] && [ ! -f /app/client/src/config/firebase.js ]; then
    echo "Creating firebase.js from template..."
    cp /app/client/src/config/firebase.js.example /app/client/src/config/firebase.js
    
    # Replace placeholders with actual values
    sed -i "s/YOUR_API_KEY/$API_KEY/g" /app/client/src/config/firebase.js
    sed -i "s/your-project-id\.firebaseapp\.com/$AUTH_DOMAIN/g" /app/client/src/config/firebase.js
    sed -i "s/your-project-id/$PROJECT_ID/g" /app/client/src/config/firebase.js
    sed -i "s/your-project-id\.appspot\.com/$STORAGE_BUCKET/g" /app/client/src/config/firebase.js
    sed -i "s/YOUR_SENDER_ID/$SENDER_ID/g" /app/client/src/config/firebase.js
    sed -i "s/YOUR_APP_ID/$APP_ID/g" /app/client/src/config/firebase.js
    sed -i "s/YOUR_MEASUREMENT_ID/$MEASUREMENT_ID/g" /app/client/src/config/firebase.js
  fi
  
  echo "Firebase configuration complete."
else
  echo "Warning: FIREBASE_CONFIG not provided. Application may not function correctly."
fi

# Check for npm dependencies
if [ ! -d "/app/node_modules/firebase-admin" ]; then
  echo "Installing missing firebase-admin package..."
  npm install firebase-admin --no-save
fi

if [ ! -d "/app/client/node_modules/firebase" ]; then
  echo "Installing missing firebase package in client..."
  cd /app/client && npm install firebase --no-save
fi

echo "ContextForge container setup complete."

# Execute the main command
exec "$@"