@echo off
echo ==========================================
echo Docker Start with Dynamic Port Allocation
echo ==========================================
echo.

REM Stop any running containers
echo Stopping any running containers...
docker-compose down
if %errorlevel% neq 0 (
    echo Error stopping containers. Make sure Docker is running.
    pause
    exit /b 1
)

REM Install js-yaml if needed
echo Checking if js-yaml is installed...
call npm list -g js-yaml >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing js-yaml package...
    call npm install -g js-yaml
    if %errorlevel% neq 0 (
        echo Failed to install js-yaml package.
        pause
        exit /b 1
    )
)

REM Find available ports and update docker-compose.yml
echo Finding available ports...
node .\scripts\find-available-ports.js
if %errorlevel% neq 0 (
    echo Error finding available ports.
    pause
    exit /b 1
)

REM Build and start containers
echo Building and starting Docker containers...
docker-compose up -d
if %errorlevel% neq 0 (
    echo Error: Failed to start Docker containers.
    echo Please check the error messages above.
    pause
    exit /b 1
) else (
    echo Docker containers started successfully!
    echo You can now access the application at the URL shown above.
)

pause