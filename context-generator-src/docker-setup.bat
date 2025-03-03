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
echo Step 2: Setting up environment file...
echo.

if not exist ".env" (
    echo Creating .env file...
    copy .env.docker .env > nul
    if not exist ".env" (
        echo ERROR: Failed to create .env file.
        pause
        exit /b 1
    )
) else (
    echo Existing .env file found.
)

echo.
echo IMPORTANT: For security, we'll now open your .env file
echo to add your API keys directly. This way they won't be 
echo visible in command history or process listings.
echo.
echo Please enter your API keys in the editor that opens.
echo Find these lines in the file:
echo   ANTHROPIC_API_KEY=your-anthropic-api-key-here
echo   OPENAI_API_KEY=your-openai-api-key-here
echo.
echo Press any key to open the .env file...
pause > nul

start notepad .env

echo.
echo After saving and closing the editor, press any key to continue...
pause > nul

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
echo IMPORTANT: If you didn't set API keys in the .env file,
echo the application will use mock AI services. To use real 
echo AI services, you need to:
echo   1. Edit the .env file to add your API keys
echo   2. Restart the containers with: docker-compose restart
echo.
echo To stop the application, use:
echo    docker-compose down
echo.
echo Press any key to exit...
pause > nul