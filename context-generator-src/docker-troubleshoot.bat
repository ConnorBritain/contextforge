@echo off
echo ==========================================
echo Docker Troubleshooting Tool
echo ==========================================
echo.
echo This script will help diagnose connection issues with the Docker containers.
echo.

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
    echo Attempting to start it...
    docker-compose up -d
) else (
    echo Container is running.
)

echo.
echo Step 4: Checking container logs for errors...
echo Last 30 lines of logs:
docker logs --tail 30 context-generator
echo.

echo.
echo Step 5: Checking network connectivity...
echo.
echo Testing port 3000...
powershell -Command "try { $client = New-Object System.Net.Sockets.TcpClient('localhost', 3000); echo 'Connection successful on port 3000'; $client.Close() } catch { echo 'Connection failed on port 3000' }"
echo.
echo Testing port 5000...
powershell -Command "try { $client = New-Object System.Net.Sockets.TcpClient('localhost', 5000); echo 'Connection successful on port 5000'; $client.Close() } catch { echo 'Connection failed on port 5000' }"
echo.

echo.
echo Step 6: Confirming network settings...
docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' context-generator
echo.

echo.
echo Step 7: Restarting container to apply port changes...
docker-compose down
docker-compose up -d
echo.

echo.
echo Troubleshooting complete. Try accessing:
echo - http://localhost:3000
echo - http://localhost:5000
echo - http://127.0.0.1:3000
echo - http://127.0.0.1:5000
echo.
echo If you still cannot connect, try:
echo 1. Disabling Windows Firewall temporarily
echo 2. Checking for any antivirus software blocking connections
echo 3. Restarting Docker Desktop completely
echo.

:end
pause