@echo off
REM Windows setup script for Context Generator Docker testing

echo.
echo ===== Context Generator Docker Test Setup for Windows =====
echo.

REM Check if running with administrative privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo This script requires administrative privileges for some operations.
    echo Please run this script as Administrator and try again.
    echo Right-click on the script and select "Run as administrator".
    pause
    exit /b 1
)

REM Set up colors for output
set "RESET=[0m"
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"

REM Check for prerequisites
call :check_prerequisites

REM Setup environment
call :setup_environment

REM Install dependencies
call :install_dependencies

REM Build Docker
call :build_docker

REM Start Docker
call :start_docker

REM Ask if user wants to run tests
echo.
set /p run_tests_prompt="Would you like to run the token tracking and subscription tests? (y/n): "
if /i "%run_tests_prompt%"=="y" (
    call :run_tests
)

REM Ask if user wants to stop containers
echo.
set /p stop_prompt="Would you like to stop the Docker containers? (y/n): "
if /i "%stop_prompt%"=="y" (
    call :stop_docker
) else (
    echo.
    echo The Docker containers are still running.
    echo You can access the application at http://localhost:3000
    echo You can stop the containers later by running: docker-compose down
)

echo.
echo ===== Setup Complete =====
echo The Context Generator is now set up for testing with Docker.
echo If you want to deploy to production, review the .env.production file
echo and update it with your actual production values.
echo.
pause
exit /b 0

:check_prerequisites
echo.
echo ===== Checking Prerequisites =====
echo.

set missing=0

REM Check for Node.js
node --version >nul 2>&1
if %errorLevel% neq 0 (
    set missing=1
    echo %RED%Node.js is not installed.%RESET%
    call :install_nodejs
)

REM Check for npm
npm --version >nul 2>&1
if %errorLevel% neq 0 (
    set missing=1
    echo %RED%npm is not installed.%RESET%
    echo This should be installed with Node.js.
)

REM Check for Docker
docker --version >nul 2>&1
if %errorLevel% neq 0 (
    set missing=1
    echo %RED%Docker is not installed.%RESET%
    call :install_docker
)

REM Check for Docker Compose
docker-compose --version >nul 2>&1
if %errorLevel% neq 0 (
    set missing=1
    echo %RED%Docker Compose is not installed.%RESET%
    echo This should be installed with Docker Desktop.
)

if %missing% equ 1 (
    echo.
    echo %YELLOW%Some prerequisites were missing and need to be installed.%RESET%
    echo Please install the missing components and run this script again.
    pause
    exit /b 1
) else (
    echo %GREEN%All prerequisites are installed!%RESET%
)

exit /b 0

:install_nodejs
echo.
echo %YELLOW%Installing Node.js...%RESET%
echo.
echo This script can download the Node.js installer for you.
set /p install_nodejs="Would you like to download and install Node.js now? (y/n): "
if /i "%install_nodejs%"=="y" (
    echo Downloading Node.js installer...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.17.1/node-v18.17.1-x64.msi' -OutFile 'node-installer.msi'}"
    
    if exist node-installer.msi (
        echo Running Node.js installer...
        start /wait msiexec /i node-installer.msi /quiet
        echo Installation complete. You will need to restart this script after installation.
    ) else (
        echo Failed to download Node.js installer.
        echo Please download and install Node.js manually from: https://nodejs.org/en/download/
    )
) else (
    echo Please download and install Node.js manually from: https://nodejs.org/en/download/
)
exit /b 0

:install_docker
echo.
echo %YELLOW%Installing Docker Desktop...%RESET%
echo.
echo This script can download the Docker Desktop installer for you.
set /p install_docker="Would you like to download and install Docker Desktop now? (y/n): "
if /i "%install_docker%"=="y" (
    echo Downloading Docker Desktop installer...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe' -OutFile 'docker-installer.exe'}"
    
    if exist docker-installer.exe (
        echo Running Docker Desktop installer...
        start /wait docker-installer.exe
        echo Installation started. Please complete the installation wizard.
        echo After installation is complete, you need to restart your computer and run this script again.
    ) else (
        echo Failed to download Docker Desktop installer.
        echo Please download and install Docker Desktop manually from: https://www.docker.com/products/docker-desktop/
    )
) else (
    echo Please download and install Docker Desktop manually from: https://www.docker.com/products/docker-desktop/
)
exit /b 0

:setup_environment
echo.
echo ===== Setting Up Environment Files =====
echo.

REM Copy .env.docker to .env if it doesn't exist
if not exist .env (
    echo Creating .env file from .env.docker...
    copy .env.docker .env
    echo %GREEN%Created .env file%RESET%
) else (
    echo .env file already exists
)

REM Prompt user to edit .env file with actual API keys
echo.
echo For testing with real AI services, you need to update your API keys in the .env file.
set /p edit_env="Would you like to edit the .env file now? (y/n): "
if /i "%edit_env%"=="y" (
    start notepad .env
    echo %GREEN%.env file opened for editing%RESET%
) else (
    echo Please edit the .env file manually to add your API keys before testing.
)
exit /b 0

:install_dependencies
echo.
echo ===== Installing Dependencies =====
echo.

echo Installing server dependencies...
cd server && npm install
if %errorLevel% neq 0 (
    echo %RED%Failed to install server dependencies%RESET%
    pause
    exit /b 1
)

echo Installing client dependencies...
cd ../client && npm install
if %errorLevel% neq 0 (
    echo %RED%Failed to install client dependencies%RESET%
    pause
    exit /b 1
)

cd ..
echo %GREEN%All dependencies installed%RESET%
exit /b 0

:build_docker
echo.
echo ===== Building Docker Images =====
echo.

echo Building Docker images...
docker-compose build
if %errorLevel% neq 0 (
    echo %RED%Failed to build Docker images%RESET%
    pause
    exit /b 1
)

echo %GREEN%Docker images built successfully%RESET%
exit /b 0

:start_docker
echo.
echo ===== Starting Docker Containers =====
echo.

echo Starting containers in detached mode...
docker-compose up -d
if %errorLevel% neq 0 (
    echo %RED%Failed to start Docker containers%RESET%
    pause
    exit /b 1
)

echo Waiting for containers to be ready...
timeout /t 10 /nobreak > nul

echo %GREEN%Docker containers started successfully%RESET%
exit /b 0

:run_tests
echo.
echo ===== Running Token Tracking and Subscription Tests =====
echo.

echo Installing test dependencies...
npm install --no-save axios dotenv

echo Running test script...
node scripts/test-token-tracking.js
if %errorLevel% neq 0 (
    echo %RED%Tests failed%RESET%
    pause
    exit /b 1
)

echo %GREEN%Tests completed successfully%RESET%
exit /b 0

:stop_docker
echo.
echo ===== Stopping Docker Containers =====
echo.

echo Stopping containers...
docker-compose down
if %errorLevel% neq 0 (
    echo %RED%Failed to stop Docker containers%RESET%
    pause
    exit /b 1
)

echo %GREEN%Docker containers stopped successfully%RESET%
exit /b 0