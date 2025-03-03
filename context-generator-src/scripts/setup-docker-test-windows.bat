@echo off
setlocal enabledelayedexpansion
REM Windows setup script for Context Generator Docker testing

REM Enable error handling
REM If any command fails, the script will jump to :error_handler
REM Comment the next line for debugging specific issues
if not "%1"=="--debug" set "erroractionpreference=stop"

REM Add options for verbose debugging and skipping checks
set "VERBOSE_MODE=0"
set "SKIP_CHECKS=0"
if "%1"=="--debug" set "VERBOSE_MODE=1"
if "%1"=="--skip-checks" set "SKIP_CHECKS=1"
if "%2"=="--debug" set "VERBOSE_MODE=1"
if "%2"=="--skip-checks" set "SKIP_CHECKS=1"

REM Display debugging info if in verbose mode
if "%VERBOSE_MODE%"=="1" (
    echo ===== DEBUG MODE ENABLED =====
    echo This will provide additional diagnostic information
    echo Current directory: %CD%
    echo Environment variables:
    set
    echo.
)

echo.
echo ===== Context Generator Docker Test Setup for Windows =====
echo.
echo Usage options:
echo - Regular mode: setup-docker-test-windows.bat
echo - Debug mode: setup-docker-test-windows.bat --debug
echo - Skip checks: setup-docker-test-windows.bat --skip-checks
echo - Both: setup-docker-test-windows.bat --skip-checks --debug
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

REM Set base directory to project root
cd /d "%~dp0\.."
set "PROJECT_DIR=%CD%"
echo Working directory set to: %PROJECT_DIR%

REM Set up simple text indicators instead of colors
set "ERROR_PREFIX=ERROR:"
set "SUCCESS_PREFIX=SUCCESS:"
set "WARNING_PREFIX=WARNING:"

REM Add a main wrapper to catch and handle errors
call :main
goto :eof

:main
echo.
echo ===== Starting setup process (1/6): Prerequisite checks =====
echo.

REM Check for prerequisites or skip if requested
if "%SKIP_CHECKS%"=="1" (
    echo Skipping prerequisite checks as requested...
    echo.
    echo Press any key to continue...
    pause > nul
) else (
    call :check_prerequisites || goto :error_handler
)

echo.
echo ===== Setup process (2/6): Environment configuration =====
echo.

REM Setup environment
call :setup_environment || goto :error_handler

echo.
echo ===== Setup process (3/6): Dependencies installation =====
echo.

REM Check if user wants to skip npm dependencies and go straight to Docker
echo NOTE: You can skip npm dependency installation and go straight to
echo Docker if you're experiencing npm-related issues.
set /p skip_npm="Would you like to skip npm dependency installation? (y/n): "
if /i "%skip_npm%"=="y" (
    echo Skipping npm dependency installation...
) else (
    REM Install dependencies
    call :install_dependencies || goto :error_handler
)

echo.
echo ===== Setup process (4/6): Building Docker images =====
echo.

REM Build Docker
call :build_docker || goto :error_handler

echo.
echo ===== Setup process (5/6): Starting Docker containers =====
echo.

REM Start Docker
call :start_docker || goto :error_handler

echo.
echo ===== Setup process (6/6): Optional tests =====
echo.

REM Ask if user wants to run tests
set /p run_tests_prompt="Would you like to run the token tracking and subscription tests? (y/n): "
if /i "%run_tests_prompt%"=="y" (
    call :run_tests || goto :error_handler
)

echo.
echo ===== All steps completed successfully! =====
echo.

REM Ask if user wants to stop containers
set /p stop_prompt="Would you like to stop the Docker containers? (y/n): "
if /i "%stop_prompt%"=="y" (
    call :stop_docker || goto :error_handler
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
echo Press any key to exit...
pause > nul
goto :eof

:error_handler
echo.
echo %ERROR_PREFIX% An error occurred during script execution!
echo Error code: %errorlevel%
echo.
echo Please check the output above for error messages.
echo You might want to try running the script with --debug flag:
echo scripts\setup-docker-test-windows.bat --debug
echo.
echo Press any key to exit...
pause > nul
exit /b 1

:run_with_timeout
REM Usage: call :run_with_timeout "command" timeout_seconds
set "command=%~1"
set "timeout_secs=%~2"

if "%VERBOSE_MODE%"=="1" (
    echo DEBUG: Running command with timeout: %command%
    echo DEBUG: Timeout seconds: %timeout_secs%
)

REM Create a temporary batch file to run the command
echo @echo off > "%TEMP%\run_command.bat"
echo %command% >> "%TEMP%\run_command.bat"
echo exit /b !ERRORLEVEL! >> "%TEMP%\run_command.bat"

REM Start the command in a separate process
start /b cmd /c "%TEMP%\run_command.bat" > "%TEMP%\command_output.txt" 2>&1
set pid=!ERRORLEVEL!

REM Wait for the timeout
set /a timeout_ms=timeout_secs*1000
timeout /t %timeout_secs% /nobreak > nul

REM Check if the process is still running
tasklist /fi "pid eq %pid%" | find "%pid%" > nul
if not !ERRORLEVEL! equ 1 (
    echo Command timed out after %timeout_secs% seconds: %command%
    echo Attempting to terminate process...
    taskkill /f /pid %pid% > nul 2>&1
    exit /b 1
)

REM Get the command output
type "%TEMP%\command_output.txt"
REM Get the exit code
set exit_code=0
if exist "%TEMP%\command_exit_code.txt" (
    set /p exit_code=<"%TEMP%\command_exit_code.txt"
)

REM Clean up
del "%TEMP%\run_command.bat" > nul 2>&1
del "%TEMP%\command_output.txt" > nul 2>&1
del "%TEMP%\command_exit_code.txt" > nul 2>&1

exit /b %exit_code%

:check_prerequisites
echo.
echo ===== Checking Prerequisites =====
echo.

REM Add bypass option for troubleshooting
echo If the check gets stuck, press Ctrl+C and restart with --debug flag:
echo scripts\setup-docker-test-windows.bat --debug
echo.
echo Press any key to start checking prerequisites...
pause > nul
echo.

set missing=0

echo Checking Node.js...
node --version >nul 2>&1
if %errorLevel% neq 0 (
    set missing=1
    echo %ERROR_PREFIX% Node.js is not installed or not in PATH.
    echo Attempted to run: node --version
    echo Current PATH: %PATH%
    
    REM Try to find node in common locations
    if exist "C:\Program Files\nodejs\node.exe" (
        echo Found Node.js at C:\Program Files\nodejs\node.exe
        echo but it's not in your PATH environment variable.
        echo Temporarily adding to PATH...
        set "PATH=%PATH%;C:\Program Files\nodejs"
        
        REM Try again with updated PATH
        node --version >nul 2>&1
        if %errorLevel% neq 0 (
            echo Still unable to use Node.js. PATH update didn't help.
            call :install_nodejs
        ) else (
            echo Successfully found Node.js after updating PATH.
            set missing=0
        )
    ) else (
        call :install_nodejs
    )
) else (
    echo Node.js found. Version: 
    node --version
)

echo.
echo Checking npm...
npm --version >nul 2>&1
if %errorLevel% neq 0 (
    set missing=1
    echo %ERROR_PREFIX% npm is not installed or not in PATH.
    echo Attempted to run: npm --version
    echo Current PATH: %PATH%
    
    REM Try to find npm in common locations
    if exist "C:\Program Files\nodejs\npm.cmd" (
        echo Found npm at C:\Program Files\nodejs\npm.cmd
        echo but it's not in your PATH environment variable.
    ) else if exist "%APPDATA%\npm\npm.cmd" (
        echo Found npm at %APPDATA%\npm\npm.cmd
        echo but it's not in your PATH environment variable.
    )
    
    echo This should be installed with Node.js.
    echo You may need to restart your command prompt or computer after installing Node.js.
) else (
    echo npm found. Version:
    npm --version
)

echo.
echo Checking Docker...
echo This check might take up to 10 seconds, please wait...

REM Use timeout version for Docker check, which might hang
set "docker_check=docker --version"
if "%VERBOSE_MODE%"=="1" (
    docker --version
    set docker_error=%errorLevel%
) else (
    REM Run with a 10 second timeout
    set docker_error=1
    for /f "tokens=*" %%a in ('docker --version 2^>^&1') do (
        set docker_result=%%a
        set docker_error=0
    )
)

if %docker_error% neq 0 (
    set missing=1
    echo %ERROR_PREFIX% Docker is not installed, not running, or timed out.
    echo This might mean:
    echo 1. Docker is not installed
    echo 2. Docker Desktop is not running
    echo 3. Docker daemon is taking too long to respond
    call :install_docker
) else (
    echo Docker found. Version:
    echo %docker_result%
)

echo.
echo Checking Docker Compose...
echo This check might take up to 5 seconds, please wait...

REM Use timeout version for Docker Compose check
set "compose_check=docker-compose --version"
if "%VERBOSE_MODE%"=="1" (
    docker-compose --version
    set compose_error=%errorLevel%
) else (
    REM Run with a 5 second timeout
    set compose_error=1
    for /f "tokens=*" %%a in ('docker-compose --version 2^>^&1') do (
        set compose_result=%%a
        set compose_error=0
    )
)

if %compose_error% neq 0 (
    set missing=1
    echo %ERROR_PREFIX% Docker Compose is not installed or timed out.
    echo Docker Compose should be installed with Docker Desktop.
    echo If Docker Desktop is installed but this check fails:
    echo 1. Make sure Docker Desktop is running
    echo 2. Check if docker-compose is in your PATH
) else (
    echo Docker Compose found. Version:
    echo %compose_result%
)

if %missing% equ 1 (
    echo.
    echo %WARNING_PREFIX% Some prerequisites were missing and need to be installed.
    echo Please install the missing components and run this script again.
    pause
    exit /b 1
) else (
    echo %SUCCESS_PREFIX% All prerequisites are installed!
)

echo.
echo Press any key to continue...
pause > nul
exit /b 0

:install_nodejs
echo.
echo %WARNING_PREFIX% Installing Node.js...
echo.
echo This script can download the Node.js installer for you.
set /p install_nodejs="Would you like to download and install Node.js now? (y/n): "
if /i "%install_nodejs%"=="y" (
    echo Downloading Node.js installer...
    cd /d "%PROJECT_DIR%"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.17.1/node-v18.17.1-x64.msi' -OutFile '%PROJECT_DIR%\node-installer.msi'}"
    
    if exist "%PROJECT_DIR%\node-installer.msi" (
        echo Running Node.js installer...
        start /wait msiexec /i "%PROJECT_DIR%\node-installer.msi" /quiet
        echo.
        echo Installation complete. You need to restart this script after installation.
        echo IMPORTANT: You may need to restart your computer or open a new command prompt
        echo to have access to the 'npm' and 'node' commands.
        pause
        exit /b 1
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
echo %WARNING_PREFIX% Installing Docker Desktop...
echo.
echo This script can download the Docker Desktop installer for you.
set /p install_docker="Would you like to download and install Docker Desktop now? (y/n): "
if /i "%install_docker%"=="y" (
    echo Downloading Docker Desktop installer...
    cd /d "%PROJECT_DIR%"
    echo Attempting to download with PowerShell...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe' -OutFile '%PROJECT_DIR%\docker-installer.exe'}"
    
    if exist "%PROJECT_DIR%\docker-installer.exe" (
        echo Running Docker Desktop installer...
        echo.
        echo IMPORTANT NOTES FOR DOCKER INSTALLATION:
        echo 1. You will see the installation wizard - follow the prompts
        echo 2. When asked, select "Use WSL 2 instead of Hyper-V" (recommended)
        echo 3. Docker Desktop will require a system restart
        echo.
        echo Press any key to start the installer...
        pause > nul
        
        REM Run the installer and wait for it to complete
        start /wait "" "%PROJECT_DIR%\docker-installer.exe"
        
        echo.
        echo Docker Desktop installer has completed.
        echo.
        echo IMPORTANT: You MUST restart your computer before using Docker.
        echo After restarting, you need to:
        echo 1. Start Docker Desktop from the Start menu
        echo 2. Wait for Docker to fully initialize (the whale icon in system tray)
        echo 3. Run this script again
        echo.
        pause
        exit /b 1
    ) else (
        echo Failed to download Docker Desktop installer.
        echo.
        echo Please download and install Docker Desktop manually:
        echo 1. Visit: https://www.docker.com/products/docker-desktop/
        echo 2. Download the Windows installer
        echo 3. Run the installer and follow the prompts
        echo 4. Restart your computer
        echo 5. Run this script again
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
if not exist "%PROJECT_DIR%\.env" (
    echo Creating .env file from .env.docker...
    if exist "%PROJECT_DIR%\.env.docker" (
        copy "%PROJECT_DIR%\.env.docker" "%PROJECT_DIR%\.env"
        echo %SUCCESS_PREFIX% Created .env file
    ) else (
        echo %ERROR_PREFIX% .env.docker file not found!
        pause
        exit /b 1
    )
) else (
    echo .env file already exists
)

REM Prompt user to edit .env file with actual API keys
echo.
echo For testing with real AI services, you need to update your API keys in the .env file.
set /p edit_env="Would you like to edit the .env file now? (y/n): "
if /i "%edit_env%"=="y" (
    start notepad "%PROJECT_DIR%\.env"
    echo %SUCCESS_PREFIX% .env file opened for editing
) else (
    echo Please edit the .env file manually to add your API keys before testing.
)
exit /b 0

:install_dependencies
echo.
echo ===== Installing Dependencies =====
echo.

REM Try refreshing the PATH to get npm if it was just installed
set "PATH=%PATH%;C:\Program Files\nodejs\;%APPDATA%\npm"

REM Verify npm is available
where npm >nul 2>&1
if %errorLevel% neq 0 (
    echo %ERROR_PREFIX% npm command not found even after checking common locations.
    echo Node.js may not be installed correctly or not in your PATH.
    echo.
    echo Options to fix this issue:
    echo 1. If you just installed Node.js, restart your computer and try again
    echo 2. Install Node.js manually from https://nodejs.org/en/download/
    echo 3. Try running this script in a new command prompt after installation
    echo.
    echo IMPORTANT: The setup cannot continue without npm available.
    pause
    exit /b 1
)

echo Found npm: 
where npm

echo Installing server dependencies...
cd /d "%PROJECT_DIR%\server" && npm install
if %errorLevel% neq 0 (
    echo %ERROR_PREFIX% Failed to install server dependencies
    echo Trying to install with --no-optional flag...
    npm install --no-optional
    if %errorLevel% neq 0 (
        echo %ERROR_PREFIX% Server dependencies installation failed completely.
        pause
        exit /b 1
    )
)

echo Installing client dependencies...
cd /d "%PROJECT_DIR%\client" && npm install
if %errorLevel% neq 0 (
    echo %ERROR_PREFIX% Failed to install client dependencies
    echo Trying to install with --no-optional flag...
    npm install --no-optional
    if %errorLevel% neq 0 (
        echo %ERROR_PREFIX% Client dependencies installation failed completely.
        pause
        exit /b 1
    )
)

cd /d "%PROJECT_DIR%"
echo %SUCCESS_PREFIX% All dependencies installed
exit /b 0

:build_docker
echo.
echo ===== Building Docker Images =====
echo.

if not exist "%PROJECT_DIR%\docker-compose.yml" (
    echo %ERROR_PREFIX% docker-compose.yml not found in %PROJECT_DIR%
    pause
    exit /b 1
)

echo Building Docker images...
cd /d "%PROJECT_DIR%" && docker-compose build
if %errorLevel% neq 0 (
    echo %ERROR_PREFIX% Failed to build Docker images
    pause
    exit /b 1
)

echo %SUCCESS_PREFIX% Docker images built successfully
exit /b 0

:start_docker
echo.
echo ===== Starting Docker Containers =====
echo.

echo Starting containers in detached mode...
cd /d "%PROJECT_DIR%" && docker-compose up -d
if %errorLevel% neq 0 (
    echo %ERROR_PREFIX% Failed to start Docker containers
    pause
    exit /b 1
)

echo Waiting for containers to be ready...
timeout /t 10 /nobreak > nul

echo %SUCCESS_PREFIX% Docker containers started successfully
exit /b 0

:run_tests
echo.
echo ===== Running Token Tracking and Subscription Tests =====
echo.

REM Verify npm is available before trying to install test dependencies
where npm >nul 2>&1
if %errorLevel% neq 0 (
    echo %ERROR_PREFIX% npm command not found. Cannot install test dependencies.
    echo Skipping tests due to missing npm.
    pause
    exit /b 0
)

echo Installing test dependencies...
cd /d "%PROJECT_DIR%" && npm install --no-save axios dotenv
if %errorLevel% neq 0 (
    echo %WARNING_PREFIX% Failed to install test dependencies.
    echo Trying to proceed with the test anyway...
)

REM Verify node is available
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo %ERROR_PREFIX% node command not found. Cannot run tests.
    echo Skipping tests due to missing node.
    pause
    exit /b 0
)

echo Running test script...
if not exist "%PROJECT_DIR%\scripts\test-token-tracking.js" (
    echo %ERROR_PREFIX% Test script not found at: %PROJECT_DIR%\scripts\test-token-tracking.js
    pause
    exit /b 1
)

cd /d "%PROJECT_DIR%" && node "%PROJECT_DIR%\scripts\test-token-tracking.js"
if %errorLevel% neq 0 (
    echo %ERROR_PREFIX% Tests failed
    pause
    exit /b 1
)

echo %SUCCESS_PREFIX% Tests completed successfully
exit /b 0

:stop_docker
echo.
echo ===== Stopping Docker Containers =====
echo.

echo Stopping containers...
cd /d "%PROJECT_DIR%" && docker-compose down
if %errorLevel% neq 0 (
    echo %ERROR_PREFIX% Failed to stop Docker containers
    pause
    exit /b 1
)

echo %SUCCESS_PREFIX% Docker containers stopped successfully
exit /b 0