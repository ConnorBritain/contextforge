@echo off
echo ========================================
echo Windows Script Diagnostic Tool
echo ========================================
echo.

echo This simple script will help diagnose issues with batch file execution.
echo.

echo Step 1: Checking basic batch functionality...
echo Hello World
echo.

echo Step 2: Checking environment variables...
echo Current directory: %CD%
echo Temp directory: %TEMP%
echo.

echo Step 3: Testing command execution...
ver
echo.

echo Step 4: Testing simple input/output...
set /p test_input="Type anything and press Enter: "
echo You entered: %test_input%
echo.

echo Step 5: Testing basic error handling...
set error_code=0
echo Error code set to: %error_code%
echo.

echo Step 6: Testing file system access...
echo Current files in this directory:
dir /b
echo.

echo Diagnostic test completed successfully.
echo.

echo Press any key to exit...
pause > nul