# Docker Setup Guide for Windows

This guide will help you set up and run the Context Generator application using Docker Desktop on Windows.

## Prerequisites

1. Windows 10 64-bit: Pro, Enterprise, or Education (Build 16299 or later) or Windows 11
2. Hyper-V and Containers Windows features must be enabled
3. BIOS-level hardware virtualization support must be enabled in BIOS settings
4. At least 4GB of RAM

## Installation Steps

### 1. Install Docker Desktop

1. Download Docker Desktop from [Docker Hub](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe)
2. Double-click the installer and follow the installation instructions
3. After installation, restart your computer
4. Start Docker Desktop from the Start menu
5. Wait for Docker Desktop to start (the whale icon in the system tray will stop animating when Docker is ready)

### 2. Run the Setup Script

1. Open Command Prompt as Administrator
2. Navigate to the project directory:
   ```
   cd path\to\context-generator-src
   ```
3. Run the setup script:
   ```
   scripts\setup-docker-test-windows.bat
   ```
4. Follow the prompts in the script to:
   - Check prerequisites
   - Set up environment files
   - Install dependencies
   - Build and start Docker containers
   - Run tests (optional)

### 3. Access the Application

Once the containers are running:

1. Open your web browser
2. Navigate to [http://localhost:3000](http://localhost:3000)
3. The Context Generator application should now be running in your browser

## Common Issues and Solutions

### WSL 2 Backend Issues

If you encounter issues with WSL 2 backend:

1. Open PowerShell as Administrator
2. Run:
   ```
   wsl --update
   ```
3. Restart Docker Desktop

### Container Build Failures

If container builds fail:

1. Ensure Docker Desktop has enough resources:
   - Open Docker Desktop settings
   - Go to Resources
   - Allocate at least 4GB of RAM and 2 CPUs

### Environment Variable Issues

If API keys or environment variables aren't working:

1. Stop the containers: `docker-compose down`
2. Edit the `.env` file in the root directory
3. Ensure all required API keys are properly set
4. Rebuild and restart the containers:
   ```
   docker-compose build
   docker-compose up -d
   ```

### MongoDB Connection Issues

If MongoDB connection fails:

1. Check that the MongoDB container is running:
   ```
   docker ps | findstr mongodb
   ```
2. If not running, check logs:
   ```
   docker-compose logs mongodb
   ```
3. Ensure the correct MongoDB URI is in your `.env` file

## Stopping the Application

To stop the application:

1. In Command Prompt, navigate to the project directory
2. Run:
   ```
   docker-compose down
   ```

## Advanced: Viewing Logs

To view application logs:

```
docker-compose logs -f app
```

To view MongoDB logs:

```
docker-compose logs -f mongodb
```

Press Ctrl+C to stop viewing logs.

## Manual Docker Commands

If you need to run Docker commands manually:

1. Build images:
   ```
   docker-compose build
   ```

2. Start containers:
   ```
   docker-compose up -d
   ```

3. Stop containers:
   ```
   docker-compose down
   ```

4. View all containers:
   ```
   docker ps -a
   ```