#!/bin/bash
# ContextForge Docker Deployment with Firebase Configuration

# Display colorful headers
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}ContextForge Docker Deployment${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if we are in the right directory
if [ ! -d "docker" ]; then
  echo -e "${RED}Error: This script must be run from the context-generator-src directory${NC}"
  echo "Please change to the context-generator-src directory and try again."
  exit 1
fi

# Function to generate Firebase configuration
generate_firebase_config() {
  echo -e "${YELLOW}Generating Firebase configuration...${NC}"
  
  # Prompt for Firebase configuration
  read -p "Firebase API Key: " API_KEY
  read -p "Firebase Auth Domain: " AUTH_DOMAIN
  read -p "Firebase Project ID: " PROJECT_ID
  read -p "Firebase Storage Bucket: " STORAGE_BUCKET
  read -p "Firebase Messaging Sender ID: " SENDER_ID
  read -p "Firebase App ID: " APP_ID
  read -p "Firebase Measurement ID: " MEASUREMENT_ID
  
  # Prompt for server-side Firebase configuration
  echo -e "${YELLOW}Do you have a Firebase service account JSON file? (y/n)${NC}"
  read -p "> " HAS_SERVICE_ACCOUNT
  
  # Create Firebase config
  FIREBASE_CONFIG="NODE_ENV=production\n"
  FIREBASE_CONFIG+="PORT=5000\n"
  FIREBASE_CONFIG+="REACT_APP_FIREBASE_API_KEY=${API_KEY}\n"
  FIREBASE_CONFIG+="REACT_APP_FIREBASE_AUTH_DOMAIN=${AUTH_DOMAIN}\n"
  FIREBASE_CONFIG+="REACT_APP_FIREBASE_PROJECT_ID=${PROJECT_ID}\n"
  FIREBASE_CONFIG+="REACT_APP_FIREBASE_STORAGE_BUCKET=${STORAGE_BUCKET}\n"
  FIREBASE_CONFIG+="REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${SENDER_ID}\n"
  FIREBASE_CONFIG+="REACT_APP_FIREBASE_APP_ID=${APP_ID}\n"
  FIREBASE_CONFIG+="REACT_APP_FIREBASE_MEASUREMENT_ID=${MEASUREMENT_ID}\n"
  
  if [[ "$HAS_SERVICE_ACCOUNT" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Enter the path to your Firebase service account JSON file:${NC}"
    read -p "> " SERVICE_ACCOUNT_PATH
    
    if [ -f "$SERVICE_ACCOUNT_PATH" ]; then
      # Escape any special characters in the JSON and convert to one line
      SERVICE_ACCOUNT=$(cat "$SERVICE_ACCOUNT_PATH" | tr -d '\n' | sed 's/"/\\"/g')
      FIREBASE_CONFIG+="FIREBASE_SERVICE_ACCOUNT=\"${SERVICE_ACCOUNT}\"\n"
      FIREBASE_CONFIG+="FIREBASE_DATABASE_URL=https://${PROJECT_ID}.firebaseio.com\n"
    else
      echo -e "${RED}Error: Service account file not found at ${SERVICE_ACCOUNT_PATH}${NC}"
      exit 1
    fi
  else
    echo -e "${YELLOW}Enter Firebase Private Key (press Enter, then paste, then press Ctrl+D):${NC}"
    PRIVATE_KEY=$(cat)
    echo -e "${YELLOW}Enter Firebase Client Email:${NC}"
    read -p "> " CLIENT_EMAIL
    
    FIREBASE_CONFIG+="FIREBASE_PROJECT_ID=${PROJECT_ID}\n"
    FIREBASE_CONFIG+="FIREBASE_CLIENT_EMAIL=${CLIENT_EMAIL}\n"
    FIREBASE_CONFIG+="FIREBASE_PRIVATE_KEY=\"${PRIVATE_KEY}\"\n"
    FIREBASE_CONFIG+="FIREBASE_DATABASE_URL=https://${PROJECT_ID}.firebaseio.com\n"
  fi
  
  echo -e "${GREEN}Firebase configuration generated successfully!${NC}"
  
  # Export the configuration as an environment variable
  export FIREBASE_CONFIG=$(echo -e "$FIREBASE_CONFIG")
}

# Main script logic
echo -e "${CYAN}This script will help you deploy ContextForge with Firebase configuration.${NC}"
echo "It will build a Docker container that automatically configures both"
echo "client and server-side Firebase settings at startup."
echo ""
echo -e "${YELLOW}Do you want to configure Firebase now? (y/n)${NC}"
read -p "> " CONFIGURE_FIREBASE

if [[ "$CONFIGURE_FIREBASE" =~ ^[Yy]$ ]]; then
  generate_firebase_config
else
  echo -e "${YELLOW}Skipping Firebase configuration. The application may not function correctly.${NC}"
fi

# Build and run the containers
echo -e "${YELLOW}Building and starting Docker containers...${NC}"
cd docker
docker-compose build
docker-compose up -d

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${CYAN}The application should be running at: http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}To view logs:${NC} docker-compose -f docker/docker-compose.yml logs -f"
echo -e "${YELLOW}To stop the application:${NC} docker-compose -f docker/docker-compose.yml down"