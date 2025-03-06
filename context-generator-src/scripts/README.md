# Scripts Directory

This directory contains utility scripts for setup, configuration, and deployment of the Context Generator application.

## Core Scripts

- `install-helper.js` - Runs during npm install to set up dependencies and configuration
- `docker-setup.js` - Node.js script for Docker configuration with dynamic port allocation
- `docker-utils.js` - Utility functions for Docker setup
- `setup-react-app.js` - Configures the React client application

## Usage

Most scripts are executed automatically during setup or are called from npm scripts defined in `package.json`.

### Installation

The installation helper runs automatically during `npm install` or can be manually triggered:

```bash
node scripts/install-helper.js
```

### Docker Setup

Docker setup can be initiated from the root directory:

```bash
node scripts/docker-setup.js
```

Or with options:
```bash
node scripts/docker-setup.js --rebuild
```

## Script Descriptions

### install-helper.js

This script runs automatically after npm install to:
- Create `.npmrc` files to reduce npm warnings
- Set up Babel config for the React client
- Install essential dependencies like Firebase and xss-clean
- Run npm audit fix in the client directory

### docker-setup.js

Handles Docker setup with:
- Dynamic port allocation to avoid conflicts
- Environment file creation if not present
- Building and starting Docker containers
- User-friendly prompts and error handling

### docker-utils.js

Provides utility functions for Docker setup:
- Port availability checking
- Finding available port ranges
- Docker Compose configuration
- Environment file management

### setup-react-app.js

Sets up the React application with:
- React configuration
- Environment variables
- CRACO configuration (if needed)
- Development dependencies