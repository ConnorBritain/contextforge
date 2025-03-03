@echo off
echo ===============================================
echo Docker Setup Instructions for Context Generator
echo ===============================================
echo.
echo This script provides step-by-step instructions 
echo for setting up the Context Generator with Docker.
echo.
echo Press any key to continue through each step...
pause > nul
echo.

echo Step 1: Create Environment File
echo ------------------------------
echo Copy the .env.docker file to .env in the project root:
echo    copy .env.docker .env
echo.
echo Then edit the .env file to add your API keys.
echo.
pause > nul

echo Step 2: Ensure Docker is Running
echo -----------------------------
echo Make sure Docker Desktop is installed and running.
echo You should see the Docker icon in your system tray.
echo.
pause > nul

echo Step 3: Build Docker Images
echo -----------------------
echo Open a command prompt in the project directory and run:
echo    docker-compose build
echo.
echo This will build the necessary Docker images.
echo This may take several minutes.
echo.
pause > nul

echo Step 4: Start Docker Containers
echo ---------------------------
echo Run the following command:
echo    docker-compose up -d
echo.
echo This starts the containers in detached mode.
echo.
pause > nul

echo Step 5: Access the Application
echo --------------------------
echo Once the containers are running, you can access
echo the application at http://localhost:3000
echo.
pause > nul

echo Step 6: Stop Containers (When Finished)
echo -----------------------------------
echo When you're done, you can stop the containers with:
echo    docker-compose down
echo.
echo.
echo These instructions are also available in the
echo DOCKER_WINDOWS_GUIDE.md file in the project directory.
echo.
echo Press any key to exit...
pause > nul