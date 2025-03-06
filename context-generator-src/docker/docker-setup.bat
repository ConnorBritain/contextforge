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

REM Install required dependencies
echo Installing required dependencies...
echo This may take a moment...

REM Use a temporary batch file to run npm commands to avoid premature termination
echo @echo off > temp_npm.bat
echo cd /d "%~dp0" >> temp_npm.bat
echo npm list js-yaml --silent 2^>nul ^|^| npm install --no-save js-yaml >> temp_npm.bat
echo echo. >> temp_npm.bat
echo echo Dependencies check completed. >> temp_npm.bat
echo echo. >> temp_npm.bat
echo echo Press any key to continue with Docker setup... >> temp_npm.bat
echo pause ^> nul >> temp_npm.bat
echo exit /b 0 >> temp_npm.bat

REM Run the temporary batch file
call temp_npm.bat
del temp_npm.bat

REM Run the Node.js setup script
echo Running Docker setup with Node.js...
echo This may take several minutes...

REM Use a temporary batch file to run Node.js command
echo @echo off > temp_node.bat
echo cd /d "%~dp0" >> temp_node.bat
echo node scripts/docker-setup.js %SKIP_CHECKS% %SKIP_PROMPTS% %REBUILD% >> temp_node.bat
echo set NODE_EXIT_CODE=%%errorlevel%% >> temp_node.bat
echo echo. >> temp_node.bat
echo echo Node.js script completed with exit code %%NODE_EXIT_CODE%% >> temp_node.bat
echo echo. >> temp_node.bat
echo echo Press any key to continue... >> temp_node.bat
echo pause ^> nul >> temp_node.bat
echo exit /b %%NODE_EXIT_CODE%% >> temp_node.bat

REM Run the temporary batch file and capture exit code
call temp_node.bat
set NODE_EXIT_CODE=%errorlevel%
del temp_node.bat

echo.
if %NODE_EXIT_CODE% neq 0 (
    echo ERROR: Docker setup failed. See error messages above.
    echo.
) else (
    echo Docker setup completed. Check the messages above for details.
    echo.
)

echo Press any key to exit...
pause > nul

if %NODE_EXIT_CODE% neq 0 (
    exit /b 1
)