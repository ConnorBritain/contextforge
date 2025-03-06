# Docker Firebase Deployment Guide for ContextForge

This guide explains the automated approach for deploying ContextForge with Firebase in Docker containers. This solution solves the common issue of Firebase configuration in containerized environments.

## The Problem

When deploying the application in a new environment or container, you typically encounter these issues:

1. Missing Firebase modules (`firebase-admin` on server, `firebase` on client)
2. Missing Firebase configuration in both client and server environments
3. The need to manually configure multiple `.env` files and create a `firebase.js` file

## The Solution: Automated Docker Deployment

Our Docker-based solution automates the entire process:

1. A single `FIREBASE_CONFIG` environment variable contains all Firebase configuration
2. An entrypoint script configures both client and server at container startup
3. Missing dependencies are installed automatically if needed
4. No manual file copying or editing required

## How to Use the Automated Deployment

### Option 1: Using the Deployment Scripts

We provide ready-to-use scripts that handle everything:

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

The script will:
1. Prompt you for Firebase configuration details
2. Build the Docker container
3. Start the application with proper Firebase configuration

### Option 2: Manual Configuration

If you prefer to set up manually:

1. Create a `.env` file with all your Firebase configuration:

```
NODE_ENV=production
PORT=5000
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}
```

2. Export the entire file as `FIREBASE_CONFIG`:

```bash
export FIREBASE_CONFIG=$(cat .env)
```

3. Build and run with Docker Compose:

```bash
cd context-generator-src/docker
docker-compose build
docker-compose up -d
```

## Understanding How It Works

### 1. The Dockerfile

The Dockerfile uses a multi-stage build:
- First stage installs all dependencies and builds the client
- Second stage creates a production-ready image
- The entrypoint script handles runtime configuration

### 2. The Entrypoint Script

When the container starts:
1. The `entrypoint.sh` script extracts configuration from `FIREBASE_CONFIG`
2. Client variables (starting with `REACT_APP_`) go to `/app/client/.env`
3. Server variables go to `/app/config/.env`
4. The script generates a proper `firebase.js` file from the template
5. Any missing npm dependencies are automatically installed

### 3. Docker Compose Configuration

The Docker Compose file passes the `FIREBASE_CONFIG` environment variable to the container:

```yaml
environment:
  - FIREBASE_CONFIG=${FIREBASE_CONFIG}
```

## CI/CD Integration

For CI/CD pipelines, you can secure your Firebase configuration:

**GitHub Actions example:**
```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and deploy
        env:
          FIREBASE_CONFIG: ${{ secrets.FIREBASE_CONFIG }}
        run: |
          cd context-generator-src/docker
          docker-compose build
          docker-compose up -d
```

**Store your complete Firebase configuration as a GitHub secret named `FIREBASE_CONFIG`.**

## Troubleshooting

If you encounter issues:

1. Check the Docker logs:
   ```bash
   docker-compose -f docker/docker-compose.yml logs
   ```

2. Verify your Firebase configuration is complete and correct

3. Ensure your Firebase project has Authentication enabled

4. If you're using a service account, make sure it has the necessary permissions

## Security Considerations

- The `FIREBASE_CONFIG` contains sensitive information - never commit it to your repository
- For production, use Docker secrets or a secrets management system
- Rotate your Firebase keys regularly 
- The service account should have minimal required permissions

By using this approach, you can deploy ContextForge with Firebase in any container environment without manual configuration.