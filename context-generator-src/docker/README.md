# Docker Configuration

This directory contains Docker-related files for containerizing and deploying the Context Generator application.

## Files

- `docker-compose.yml` - Docker Compose configuration for multi-container setup
- `Dockerfile` - Container definition for the application
- `entrypoint.sh` - Container startup script that handles configuration
- `deploy-with-firebase.sh` - Linux/macOS deployment script with Firebase setup
- `deploy-with-firebase.bat` - Windows deployment script with Firebase setup
- `docker-setup.bat` - Basic Windows setup script
- `docker-setup.sh` - Basic Linux/macOS setup script
- `docker-troubleshoot.bat` - Windows troubleshooting script

## Docker Deployment Options

### Option 1: Automated Firebase Deployment (Recommended)

For a fully automated deployment that handles Firebase configuration:

**On Linux/macOS:**
```bash
cd context-generator-src
./docker/deploy-with-firebase.sh
```

**On Windows:**
```batch
cd context-generator-src
docker\deploy-with-firebase.bat
```

This approach:
- Prompts for Firebase configuration
- Automatically sets up both client and server environments
- Installs missing dependencies at runtime
- Works in any environment without manual file editing

For details on this approach, see the [Docker Firebase Setup Guide](../docs/DOCKER_FIREBASE_SETUP.md).

### Option 2: Basic Setup

For a simpler setup without Firebase (or with manual Firebase configuration):

**On Linux/macOS:**
```bash
cd context-generator-src
./docker/docker-setup.sh
```

**On Windows:**
```batch
cd context-generator-src
docker\docker-setup.bat
```

### Option 3: Manual Setup

If you prefer to manually set up Docker:

1. Copy environment variables:
   ```bash
   cp docker/.env.docker config/.env
   ```

2. Build and start containers:
   ```bash
   docker-compose -f docker/docker-compose.yml build
   docker-compose -f docker/docker-compose.yml up -d
   ```

3. View logs:
   ```bash
   docker-compose -f docker/docker-compose.yml logs -f
   ```

4. Stop containers:
   ```bash
   docker-compose -f docker/docker-compose.yml down
   ```

## Troubleshooting

If you encounter issues with Docker deployment:

- On Windows, run the troubleshooting script: `docker\docker-troubleshoot.bat`
- Check the Docker logs: `docker-compose -f docker/docker-compose.yml logs`
- Verify your environment variables in `.env`
- See the [Docker Windows Guide](../docs/DOCKER_WINDOWS_GUIDE.md) for Windows-specific issues
- For Firebase issues, see the [Docker Firebase Setup Guide](../docs/DOCKER_FIREBASE_SETUP.md)

For more detailed instructions, see the [Deployment Documentation](../docs/DEPLOYMENT.md).