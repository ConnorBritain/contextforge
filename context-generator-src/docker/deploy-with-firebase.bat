@echo off
REM ContextForge Docker Deployment with Firebase Configuration
setlocal EnableDelayedExpansion

echo ========================================
echo ContextForge Docker Deployment
echo ========================================

REM Check if we are in the right directory
if not exist "docker" (
  echo Error: This script must be run from the context-generator-src directory
  echo Please change to the context-generator-src directory and try again.
  exit /b 1
)

REM Function to generate Firebase configuration
:generate_firebase_config
  echo Generating Firebase configuration...
  
  REM Prompt for Firebase configuration
  set /p API_KEY="Firebase API Key: "
  set /p AUTH_DOMAIN="Firebase Auth Domain: "
  set /p PROJECT_ID="Firebase Project ID: "
  set /p STORAGE_BUCKET="Firebase Storage Bucket: "
  set /p SENDER_ID="Firebase Messaging Sender ID: "
  set /p APP_ID="Firebase App ID: "
  set /p MEASUREMENT_ID="Firebase Measurement ID: "
  
  REM Prompt for server-side Firebase configuration
  echo Do you have a Firebase service account JSON file? (y/n)
  set /p HAS_SERVICE_ACCOUNT="> "
  
  REM Create Firebase config
  set "FIREBASE_CONFIG=NODE_ENV=production"
  set "FIREBASE_CONFIG=!FIREBASE_CONFIG!^

PORT=5000"
  set "FIREBASE_CONFIG=!FIREBASE_CONFIG!^

REACT_APP_FIREBASE_API_KEY=%API_KEY%"
  set "FIREBASE_CONFIG=!FIREBASE_CONFIG!^

REACT_APP_FIREBASE_AUTH_DOMAIN=%AUTH_DOMAIN%"
  set "FIREBASE_CONFIG=!FIREBASE_CONFIG!^

REACT_APP_FIREBASE_PROJECT_ID=%PROJECT_ID%"
  set "FIREBASE_CONFIG=!FIREBASE_CONFIG!^

REACT_APP_FIREBASE_STORAGE_BUCKET=%STORAGE_BUCKET%"
  set "FIREBASE_CONFIG=!FIREBASE_CONFIG!^

REACT_APP_FIREBASE_MESSAGING_SENDER_ID=%SENDER_ID%"
  set "FIREBASE_CONFIG=!FIREBASE_CONFIG!^

REACT_APP_FIREBASE_APP_ID=%APP_ID%"
  set "FIREBASE_CONFIG=!FIREBASE_CONFIG!^

REACT_APP_FIREBASE_MEASUREMENT_ID=%MEASUREMENT_ID%"
  
  REM Process service account
  if /I "%HAS_SERVICE_ACCOUNT%"=="y" (
    echo Enter the path to your Firebase service account JSON file:
    set /p SERVICE_ACCOUNT_PATH="> "
    
    if exist "%SERVICE_ACCOUNT_PATH%" (
      REM Save service account to a temp file
      echo Reading service account from %SERVICE_ACCOUNT_PATH%
      set /p SERVICE_ACCOUNT=<"%SERVICE_ACCOUNT_PATH%"
      
      set "FIREBASE_CONFIG=!FIREBASE_CONFIG!^

FIREBASE_SERVICE_ACCOUNT=%SERVICE_ACCOUNT%"
      set "FIREBASE_CONFIG=!FIREBASE_CONFIG!^

FIREBASE_DATABASE_URL=https://%PROJECT_ID%.firebaseio.com"
    ) else (
      echo Error: Service account file not found at %SERVICE_ACCOUNT_PATH%
      exit /b 1
    )
  ) else (
    echo Enter Firebase Client Email:
    set /p CLIENT_EMAIL="> "
    
    echo Enter Firebase Private Key (simplified for this script, edit manually if needed):
    set /p PRIVATE_KEY="> "
    
    set "FIREBASE_CONFIG=!FIREBASE_CONFIG!^

FIREBASE_PROJECT_ID=%PROJECT_ID%"
    set "FIREBASE_CONFIG=!FIREBASE_CONFIG!^

FIREBASE_CLIENT_EMAIL=%CLIENT_EMAIL%"
    set "FIREBASE_CONFIG=!FIREBASE_CONFIG!^

FIREBASE_PRIVATE_KEY=%PRIVATE_KEY%"
    set "FIREBASE_CONFIG=!FIREBASE_CONFIG!^

FIREBASE_DATABASE_URL=https://%PROJECT_ID%.firebaseio.com"
  )
  
  echo Firebase configuration generated successfully!
  
  REM Export the configuration to a temporary file
  echo !FIREBASE_CONFIG! > firebase_config_temp.txt
  goto :eof

REM Main script logic
echo This script will help you deploy ContextForge with Firebase configuration.
echo It will build a Docker container that automatically configures both
echo client and server-side Firebase settings at startup.
echo.
echo Do you want to configure Firebase now? (y/n)
set /p CONFIGURE_FIREBASE="> "

if /I "%CONFIGURE_FIREBASE%"=="y" (
  call :generate_firebase_config
) else (
  echo Skipping Firebase configuration. The application may not function correctly.
)

REM Build and run the containers
echo Building and starting Docker containers...
cd docker

REM Export the FIREBASE_CONFIG environment variable
if exist "..\firebase_config_temp.txt" (
  set /p FIREBASE_CONFIG=<..\firebase_config_temp.txt
  set "FIREBASE_CONFIG=%FIREBASE_CONFIG%"
  del ..\firebase_config_temp.txt
)

docker-compose build
docker-compose up -d

echo Deployment complete!
echo The application should be running at: http://localhost:3000
echo.
echo To view logs: docker-compose -f docker-compose.yml logs -f
echo To stop the application: docker-compose -f docker-compose.yml down

endlocal