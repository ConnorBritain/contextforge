# Docker Configuration

This directory contains Docker-related files for containerizing and deploying the Context Generator application.

## Files

- `docker-compose.yml` - Docker Compose configuration for multi-container setup
- `.env.docker` - Docker-specific environment variables
- `docker-setup.bat` - Windows setup script
- `docker-setup.sh` - Linux/macOS setup script
- `docker-troubleshoot.bat` - Windows troubleshooting script

## Docker Deployment

### Basic Usage

To start the application with Docker:

```bash
# Navigate to the project root
cd context-generator-src

# Run the setup script (detects your OS automatically)
./docker/docker-setup.sh
```

For Windows:
```batch
docker\docker-setup.bat
```

### Manual Setup

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

For more detailed instructions, see the [Deployment Documentation](../docs/DEPLOYMENT.md).