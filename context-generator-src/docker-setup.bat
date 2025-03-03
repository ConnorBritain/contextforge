@echo off
echo ========================================
echo Docker Setup for Context Generator
echo ========================================
echo.

echo This script will set up the Context Generator application with Docker.
echo Docker containers will be started with dynamic port allocation.
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

REM Parse command line arguments
set SKIP_CHECKS=
set SKIP_PROMPTS=
set REBUILD=

:parse_args
if "%~1"=="" goto end_parse_args
if /i "%~1"=="--skip-checks" set SKIP_CHECKS=--skip-checks
if /i "%~1"=="--skip-prompts" set SKIP_PROMPTS=--skip-prompts
if /i "%~1"=="--rebuild" set REBUILD=--rebuild
shift
goto parse_args
:end_parse_args

REM Make sure we're in the right directory
cd /d "%~dp0"

REM Run the Node.js setup script
echo Running Docker setup with Node.js...
node scripts/docker-setup.js %SKIP_CHECKS% %SKIP_PROMPTS% %REBUILD%

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Docker setup failed. See error messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo Press any key to exit...
pause > nul