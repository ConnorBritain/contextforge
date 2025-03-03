@echo off
echo ========================================
echo Docker Setup for Context Generator
echo ========================================
echo.

echo This script will set up the Context Generator application with Docker.
echo.
echo Prerequisites:
echo - Docker Desktop must be installed and running
echo - You should have API keys for Anthropic and/or OpenAI
echo.

echo Press any key to continue or CTRL+C to cancel...
pause > nul

echo.
echo Step 1: Checking Docker...
echo.
docker --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker not found or not running.
    echo Please install Docker Desktop and make sure it's running.
    echo.
    pause
    exit /b 1
) else (
    echo Docker is available:
    docker --version
)

echo.
echo Step 2: Setting up API keys...
echo.
echo Please enter your API keys when prompted.
echo (Press Enter to skip if you don't have keys yet)
echo.

set /p anthropic_key=Anthropic API Key: 
set /p openai_key=OpenAI API Key: 

echo.
echo Step 3: Building and starting containers...
echo This will take a few minutes.
echo.

echo Building and starting Docker containers...
docker-compose down
docker-compose build --no-cache
docker-compose up -d

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to build or start Docker containers.
    echo See error messages above for details.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo The Context Generator is now running at:
echo    http://localhost:3000
echo.
echo To stop the application, use:
echo    docker-compose down
echo.
echo Press any key to exit...
pause > nul