@echo off
echo ==========================================
echo Docker Troubleshooting Tool
echo ==========================================
echo.
echo This script will help diagnose connection issues with the Docker containers.
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is required but not found.
    echo Please install Node.js and try again.
    echo.
    pause
    exit /b 1
)

REM Make sure we're in the right directory
cd /d "%~dp0"

REM Install required dependencies
echo Installing required dependencies...
npm list js-yaml --silent || npm install --no-save js-yaml

REM Check if Docker is running
echo Step 1: Checking Docker status...
docker info > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker does not appear to be running.
    echo Please start Docker Desktop and try again.
    goto :end
) else (
    echo Docker is running.
)

echo.
echo Step 2: Checking container status...
docker ps -a
echo.

echo Step 3: Checking if the context-generator container is running...
docker ps | findstr context-generator > nul
if %errorlevel% neq 0 (
    echo ERROR: context-generator container is not running!
    echo.
    echo Do you want to try starting the container with dynamic port allocation?
    choice /C YN /M "Try starting container with dynamic ports"
    if %errorlevel% equ 1 (
        echo.
        echo Running Docker setup with dynamic port allocation...
        node scripts/docker-setup.js --skip-prompts
        goto :end
    )
) else (
    echo Container is running.
)

echo.
echo Step 4: Checking container logs for errors...
echo Last 30 lines of logs:
docker logs --tail 30 context-generator
echo.

echo.
echo Step 5: Checking Docker Compose configuration...
echo Retrieving port mappings from docker-compose.yml...
node -e "const fs=require('fs');const yaml=require('js-yaml');const config=yaml.load(fs.readFileSync('docker-compose.yml','utf8'));console.log('Current port mappings:');console.log(config.services.app.ports);"
echo.

echo.
echo Step 6: Checking network connectivity...
FOR /F "tokens=1 delims=:" %%a IN ('docker-compose port app 5000 2^>nul') DO set HOST_URL=%%a
FOR /F "tokens=2 delims=:" %%a IN ('docker-compose port app 5000 2^>nul') DO set HOST_PORT=%%a

if defined HOST_PORT (
    echo Testing mapped port %HOST_PORT%...
    powershell -Command "try { $client = New-Object System.Net.Sockets.TcpClient('localhost', '%HOST_PORT%'); echo 'Connection successful on port %HOST_PORT%'; $client.Close() } catch { echo 'Connection failed on port %HOST_PORT%' }"
    echo.
) else (
    echo Could not determine the mapped port from docker-compose port command.
    echo Testing default ports...
    powershell -Command "try { $client = New-Object System.Net.Sockets.TcpClient('localhost', 3000); echo 'Connection successful on port 3000'; $client.Close() } catch { echo 'Connection failed on port 3000' }"
    echo.
    powershell -Command "try { $client = New-Object System.Net.Sockets.TcpClient('localhost', 5000); echo 'Connection successful on port 5000'; $client.Close() } catch { echo 'Connection failed on port 5000' }"
    echo.
)

echo.
echo Step 7: Confirming network settings...
docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' context-generator
echo.

echo.
echo Would you like to restart the container with dynamic port allocation?
choice /C YN /M "Restart with dynamic ports"
if %errorlevel% equ 1 (
    echo.
    echo Running Docker setup with dynamic port allocation...
    node scripts/docker-setup.js --skip-prompts
    goto :end
)

echo.
echo Troubleshooting complete. 
echo If you still cannot connect, try:
echo 1. Disabling Windows Firewall temporarily
echo 2. Checking for any antivirus software blocking connections
echo 3. Restarting Docker Desktop completely
echo 4. Running docker-setup.bat to use dynamic port allocation
echo.

:end
pause