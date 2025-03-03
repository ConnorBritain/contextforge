#!/bin/bash

# Docker Setup for Context Generator
echo "========================================"
echo "Docker Setup for Context Generator"
echo "========================================"
echo

echo "This script will set up the Context Generator application with Docker."
echo "Docker containers will be started with dynamic port allocation."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is required but not found."
    echo "Please install Node.js and try again."
    echo
    exit 1
fi

# Parse command line arguments
SKIP_CHECKS=""
SKIP_PROMPTS=""
REBUILD=""

for arg in "$@"; do
    case $arg in
        --skip-checks)
            SKIP_CHECKS="--skip-checks"
            ;;
        --skip-prompts)
            SKIP_PROMPTS="--skip-prompts"
            ;;
        --rebuild)
            REBUILD="--rebuild"
            ;;
    esac
done

# Get the directory this script is in
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to the script directory
cd "$SCRIPT_DIR" || exit 1

# Install required dependencies
echo "Installing required dependencies..."
npm list js-yaml --silent || npm install --no-save js-yaml

# Run the Node.js setup script
echo "Running Docker setup with Node.js..."
node scripts/docker-setup.js $SKIP_CHECKS $SKIP_PROMPTS $REBUILD

if [ $? -ne 0 ]; then
    echo
    echo "ERROR: Docker setup failed. See error messages above."
    echo
    exit 1
fi