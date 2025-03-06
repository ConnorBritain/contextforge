# Context Generator Deployment Guide

This document provides instructions for testing and deploying the Context Generator application. It covers local development setup, Docker deployment for testing, and production deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Docker Deployment](#docker-deployment)
5. [Testing Token Tracking and Subscription](#testing-token-tracking-and-subscription)
6. [Production Deployment](#production-deployment)
7. [Security Considerations](#security-considerations)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

Before starting, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- Docker and Docker Compose
- MongoDB (v4.4 or higher, optional for local development without Docker)
- API keys for Anthropic and/or OpenAI

## Environment Setup

The application uses environment variables for configuration. Several example files are provided:

- `.env.example`: Basic template with all available options
- `.env.docker`: Configuration for Docker development environment
- `.env.production`: Configuration for production deployment

To set up your environment:

1. For local development:
   ```bash
   cp .env.example .env
   ```

2. For Docker testing:
   ```bash
   cp .env.docker .env
   ```

3. For production:
   ```bash
   cp .env.production .env
   ```

After copying the appropriate file, edit it to add your actual API keys and other sensitive information.

## Local Development

To run the application locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

This will start both the client and server in development mode with hot reloading.

Alternatively, you can start them individually:

```bash
# Start server only
npm run server

# Start client only
npm run client
```

## Docker Deployment

For a more production-like environment, use Docker:

### Automated Setup

We provide a script to automate the Docker setup and testing:

```bash
./scripts/setup-docker-test.sh
```

This script will:
1. Check prerequisites
2. Set up environment files
3. Install dependencies
4. Build Docker images
5. Start Docker containers
6. Optionally run tests
7. Optionally stop containers when done

### Manual Setup

If you prefer manual setup:

1. Build the Docker images:
   ```bash
   docker-compose build
   ```

2. Start the containers:
   ```bash
   docker-compose up -d
   ```

3. View logs:
   ```bash
   docker-compose logs -f
   ```

4. Stop the containers:
   ```bash
   docker-compose down
   ```

## Testing Token Tracking and Subscription

To test the token tracking and subscription functionality:

1. Ensure the application is running (either locally or in Docker)

2. Run the token tracking test script:
   ```bash
   node scripts/test-token-tracking.js
   ```

This script tests:
- User registration and login
- Document generation and token usage tracking
- Subscription tier limits
- Subscription upgrades and downgrades

## Production Deployment

For production deployment:

1. Configure your production environment:
   ```bash
   cp .env.production .env
   ```

2. Update the `.env` file with your production values:
   - Set strong passwords for MongoDB
   - Use actual API keys
   - Configure production URLs
   - Set a strong JWT secret

3. Build and deploy using Docker:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

### Considerations for Production

- **Domain and SSL**: Set up a domain name and SSL certificates (using Let's Encrypt)
- **Reverse Proxy**: Use Nginx or similar as a reverse proxy
- **Database Backups**: Configure regular MongoDB backups
- **Monitoring**: Set up health check monitoring

## Security Considerations

Several security measures are implemented:

1. **Rate Limiting**: Prevents abuse of the API
2. **Input Validation**: All user input is validated
3. **Authentication**: JWT-based authentication for API access
4. **Data Sanitization**: Protection against XSS and NoSQL injection
5. **HTTPS**: All production traffic should use HTTPS
6. **Environment Variables**: Sensitive information is stored in environment variables

## Monitoring and Maintenance

### Health Checks

The application provides health check endpoints:

- `/api/health`: Basic status check
- `/api/health/details`: Detailed status including database connection

### Database Maintenance

For MongoDB maintenance:

1. **Backups**: Regular backups should be configured
2. **Indexing**: Ensure proper indexing for performance
3. **Monitoring**: Set up monitoring for database performance

### Logs

Logs are available through:

- Docker logs: `docker-compose logs -f`
- Application logs: Check the configured log files or stdout

### Upgrades

To update the application:

1. Pull the latest code
2. Build new Docker images
3. Restart the containers with the new images