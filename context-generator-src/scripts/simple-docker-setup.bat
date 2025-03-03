@echo off
echo ===============================================
echo Simple Docker Setup for Context Generator
echo ===============================================
echo.

REM Set base directory to project root
cd /d "%~dp0\.."
set "PROJECT_DIR=%CD%"
echo Working directory set to: %PROJECT_DIR%
echo.

REM Create .env file if it doesn't exist
if not exist "%PROJECT_DIR%\.env" (
    echo Creating .env file from .env.docker...
    if exist "%PROJECT_DIR%\.env.docker" (
        copy "%PROJECT_DIR%\.env.docker" "%PROJECT_DIR%\.env"
        echo Created .env file successfully.
    ) else (
        echo Error: .env.docker file not found!
        goto :error
    )
) else (
    echo .env file already exists.
)

echo.
echo For testing with real AI services, you need to update your API keys in the .env file.
set /p edit_env="Would you like to edit the .env file now? (y/n): "
if /i "%edit_env%"=="y" (
    start notepad "%PROJECT_DIR%\.env"
    echo .env file opened for editing.
    echo Please save the file after editing.
    echo Press any key after you've finished editing...
    pause > nul
)

echo.
echo Checking Docker...
docker --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Docker not found or not running.
    echo Please make sure Docker Desktop is installed and running.
    goto :error
) else (
    echo Docker is available.
)

echo.
echo Building Docker images...
echo This may take several minutes.
cd /d "%PROJECT_DIR%" && docker-compose build
if %errorlevel% neq 0 (
    echo Failed to build Docker images.
    goto :error
)

echo.
echo Starting Docker containers...
cd /d "%PROJECT_DIR%" && docker-compose up -d
if %errorlevel% neq 0 (
    echo Failed to start Docker containers.
    goto :error
)

echo.
echo Success! Docker containers are now running.
echo You can access the application at http://localhost:3000
echo.
echo To stop the containers later, run: docker-compose down
echo.
echo Press any key to exit...
pause > nul
exit /b 0

:error
echo.
echo An error occurred during setup.
echo.
echo Press any key to exit...
pause > nul
exit /b 1