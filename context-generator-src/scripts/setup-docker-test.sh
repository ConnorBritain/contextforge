#!/bin/bash
# Script to setup and test Docker deployment of Context Generator

# Text formatting
BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Function to print section header
print_header() {
  echo -e "\n${BOLD}${GREEN}==== $1 ====${NC}\n"
}

# Function to print status message
print_status() {
  echo -e "${YELLOW}$1${NC}"
}

# Function to print error message
print_error() {
  echo -e "${RED}ERROR: $1${NC}"
  exit 1
}

# Function to check for required tools and offer to install them
check_prerequisites() {
  print_header "Checking Prerequisites"
  local missing_tools=()
  local os_type="$(uname -s)"
  
  # Check for Docker
  if ! command -v docker &> /dev/null; then
    missing_tools+=("Docker")
  fi
  
  # Check for Docker Compose
  if ! command -v docker-compose &> /dev/null; then
    missing_tools+=("Docker Compose")
  fi
  
  # Check for Node.js
  if ! command -v node &> /dev/null; then
    missing_tools+=("Node.js")
  fi
  
  # Check for npm
  if ! command -v npm &> /dev/null; then
    missing_tools+=("npm")
  fi
  
  # If all tools are installed, proceed
  if [ ${#missing_tools[@]} -eq 0 ]; then
    echo "✅ All prerequisites are installed"
    return 0
  fi
  
  # Otherwise, offer to install missing tools
  echo -e "${YELLOW}The following tools are missing and required:${NC}"
  for tool in "${missing_tools[@]}"; do
    echo "  - $tool"
  done
  
  echo ""
  read -p "Would you like to attempt to install the missing prerequisites? (y/n): " install_prereqs
  
  if [[ $install_prereqs != "y" && $install_prereqs != "Y" ]]; then
    echo -e "${RED}Please install the missing prerequisites manually and run this script again.${NC}"
    exit 1
  fi
  
  # Install missing tools based on OS
  case "$os_type" in
    Linux*)
      install_prerequisites_linux "${missing_tools[@]}"
      ;;
    Darwin*)
      install_prerequisites_mac "${missing_tools[@]}"
      ;;
    MINGW*|MSYS*|CYGWIN*)
      install_prerequisites_windows "${missing_tools[@]}"
      ;;
    *)
      echo -e "${RED}Unsupported operating system: $os_type${NC}"
      echo "Please install the following tools manually:"
      for tool in "${missing_tools[@]}"; do
        echo "  - $tool"
      done
      exit 1
      ;;
  esac
  
  # Check again to make sure everything is installed
  check_prerequisites_silent
}

# Function to check prerequisites without offering to install
check_prerequisites_silent() {
  local missing=false
  
  if ! command -v docker &> /dev/null; then
    missing=true
  fi
  
  if ! command -v docker-compose &> /dev/null; then
    missing=true
  fi
  
  if ! command -v node &> /dev/null; then
    missing=true
  fi
  
  if ! command -v npm &> /dev/null; then
    missing=true
  fi
  
  if [ "$missing" = true ]; then
    echo -e "${RED}Some prerequisites are still missing after installation attempts.${NC}"
    echo "You may need to restart your terminal or computer for changes to take effect."
    echo "Alternatively, you can install the missing prerequisites manually."
    exit 1
  fi
  
  echo "✅ All prerequisites are now installed"
}

# Function to install prerequisites on Linux
install_prerequisites_linux() {
  local tools=("$@")
  local distro=""
  
  # Detect Linux distribution
  if [ -f /etc/os-release ]; then
    . /etc/os-release
    distro="$ID"
  elif type lsb_release >/dev/null 2>&1; then
    distro=$(lsb_release -si | tr '[:upper:]' '[:lower:]')
  elif [ -f /etc/lsb-release ]; then
    . /etc/lsb-release
    distro="$DISTRIB_ID"
  elif [ -f /etc/debian_version ]; then
    distro="debian"
  elif [ -f /etc/fedora-release ]; then
    distro="fedora"
  elif [ -f /etc/centos-release ]; then
    distro="centos"
  else
    distro="unknown"
  fi
  
  echo -e "${YELLOW}Detected Linux distribution: $distro${NC}"
  
  for tool in "${tools[@]}"; do
    echo -e "${YELLOW}Installing $tool...${NC}"
    
    case "$tool" in
      "Docker")
        case "$distro" in
          ubuntu|debian)
            sudo apt-get update
            sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
            sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/$distro $(lsb_release -cs) stable"
            sudo apt-get update
            sudo apt-get install -y docker-ce
            sudo systemctl enable docker
            sudo systemctl start docker
            sudo usermod -aG docker "$USER"
            ;;
          fedora)
            sudo dnf -y install dnf-plugins-core
            sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
            sudo dnf install -y docker-ce docker-ce-cli containerd.io
            sudo systemctl enable docker
            sudo systemctl start docker
            sudo usermod -aG docker "$USER"
            ;;
          centos)
            sudo yum install -y yum-utils
            sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            sudo yum install -y docker-ce docker-ce-cli containerd.io
            sudo systemctl enable docker
            sudo systemctl start docker
            sudo usermod -aG docker "$USER"
            ;;
          *)
            echo -e "${RED}Unsupported Linux distribution for automatic Docker installation.${NC}"
            echo "Please install Docker manually: https://docs.docker.com/engine/install/"
            ;;
        esac
        ;;
      
      "Docker Compose")
        sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        ;;
      
      "Node.js"|"npm")
        case "$distro" in
          ubuntu|debian)
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
            ;;
          fedora|centos)
            curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
            if [ "$distro" = "fedora" ]; then
              sudo dnf install -y nodejs
            else
              sudo yum install -y nodejs
            fi
            ;;
          *)
            echo -e "${RED}Unsupported Linux distribution for automatic Node.js installation.${NC}"
            echo "Please install Node.js manually: https://nodejs.org/en/download/package-manager/"
            ;;
        esac
        ;;
    esac
  done
  
  echo -e "${GREEN}Installation attempts completed. You may need to log out and log back in for some changes to take effect.${NC}"
}

# Function to install prerequisites on macOS
install_prerequisites_mac() {
  local tools=("$@")
  
  # Check if Homebrew is installed
  if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH
    if [ -d "/opt/homebrew/bin" ]; then
      echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> "$HOME/.zprofile"
      eval "$(/opt/homebrew/bin/brew shellenv)"
    elif [ -d "/usr/local/bin" ]; then
      echo 'eval "$(/usr/local/bin/brew shellenv)"' >> "$HOME/.zprofile"
      eval "$(/usr/local/bin/brew shellenv)"
    fi
  fi
  
  for tool in "${tools[@]}"; do
    echo -e "${YELLOW}Installing $tool...${NC}"
    
    case "$tool" in
      "Docker")
        echo "Docker for Mac needs to be installed manually."
        echo "Please download from: https://docs.docker.com/desktop/install/mac-install/"
        echo "After installation, run this script again."
        exit 1
        ;;
      
      "Docker Compose")
        # Docker Compose comes with Docker Desktop for Mac
        echo "Docker Compose is included with Docker Desktop for Mac."
        echo "Please install Docker Desktop first."
        ;;
      
      "Node.js"|"npm")
        brew install node
        ;;
    esac
  done
  
  echo -e "${GREEN}Installation attempts completed.${NC}"
}

# Function to install prerequisites on Windows
install_prerequisites_windows() {
  local tools=("$@")
  
  echo -e "${YELLOW}Running in Windows environment.${NC}"
  
  for tool in "${tools[@]}"; do
    echo -e "${YELLOW}Installation instructions for $tool:${NC}"
    
    case "$tool" in
      "Docker")
        echo "1. Download Docker Desktop for Windows: https://docs.docker.com/desktop/install/windows-install/"
        echo "2. Run the installer and follow the instructions"
        echo "3. Make sure to enable WSL 2 integration when prompted"
        echo "4. After installation, start Docker Desktop and run this script again"
        ;;
      
      "Docker Compose")
        echo "Docker Compose is included with Docker Desktop for Windows."
        echo "Please install Docker Desktop first."
        ;;
      
      "Node.js"|"npm")
        echo "1. Download Node.js installer: https://nodejs.org/en/download/"
        echo "2. Run the installer and follow the instructions"
        echo "3. npm will be installed automatically with Node.js"
        echo "4. After installation, open a new terminal and run this script again"
        ;;
    esac
  done
  
  echo -e "${RED}Please install the required tools manually and run this script again.${NC}"
  exit 1
}

# Function to setup environment files
setup_environment() {
  print_header "Setting Up Environment Files"
  
  # Copy .env.docker to .env if it doesn't exist
  if [ ! -f .env ]; then
    print_status "Creating .env file from .env.docker..."
    cp .env.docker .env
    echo "✅ Created .env file"
  else
    print_status ".env file already exists"
  fi
  
  # Prompt user to edit .env file with actual API keys
  echo -e "\n${BOLD}For testing with real AI services, you need to update your API keys in the .env file.${NC}"
  read -p "Would you like to edit the .env file now? (y/n): " edit_env
  
  if [[ $edit_env == "y" || $edit_env == "Y" ]]; then
    # Use default editor or fallback to nano
    ${EDITOR:-nano} .env
    echo "✅ .env file updated"
  else
    echo "Please edit the .env file manually to add your API keys before testing."
  fi
}

# Function to install dependencies
install_dependencies() {
  print_header "Installing Dependencies"
  
  print_status "Installing server dependencies..."
  cd server && npm install
  if [ $? -ne 0 ]; then
    print_error "Failed to install server dependencies"
  fi
  
  print_status "Installing client dependencies..."
  cd ../client && npm install
  if [ $? -ne 0 ]; then
    print_error "Failed to install client dependencies"
  fi
  
  cd ..
  echo "✅ All dependencies installed"
}

# Function to build Docker images
build_docker() {
  print_header "Building Docker Images"
  
  print_status "Building Docker images..."
  docker-compose build
  if [ $? -ne 0 ]; then
    print_error "Failed to build Docker images"
  fi
  
  echo "✅ Docker images built successfully"
}

# Function to start Docker containers
start_docker() {
  print_header "Starting Docker Containers"
  
  print_status "Starting containers in detached mode..."
  docker-compose up -d
  if [ $? -ne 0 ]; then
    print_error "Failed to start Docker containers"
  fi
  
  # Wait for containers to be ready
  print_status "Waiting for containers to be ready..."
  sleep 10
  
  # Check if containers are running
  if [ $(docker-compose ps -q | wc -l) -eq 0 ]; then
    print_error "No containers are running"
  fi
  
  echo "✅ Docker containers started successfully"
}

# Function to run token tracking tests
run_tests() {
  print_header "Running Token Tracking and Subscription Tests"
  
  # Install test dependencies
  print_status "Installing test dependencies..."
  npm install --no-save axios dotenv
  
  # Run the test script
  print_status "Running test script..."
  node scripts/test-token-tracking.js
  
  if [ $? -ne 0 ]; then
    print_error "Tests failed"
  fi
  
  echo "✅ Tests completed successfully"
}

# Function to stop Docker containers
stop_docker() {
  print_header "Stopping Docker Containers"
  
  print_status "Stopping containers..."
  docker-compose down
  if [ $? -ne 0 ]; then
    print_error "Failed to stop Docker containers"
  fi
  
  echo "✅ Docker containers stopped successfully"
}

# Main script execution
main() {
  print_header "Context Generator Docker Test Setup"
  
  # Change to the project root directory
  cd "$(dirname "$0")/.."
  
  # Execute functions in sequence
  check_prerequisites
  setup_environment
  install_dependencies
  build_docker
  start_docker
  
  # Ask if user wants to run tests
  read -p "Would you like to run the token tracking and subscription tests? (y/n): " run_tests_prompt
  
  if [[ $run_tests_prompt == "y" || $run_tests_prompt == "Y" ]]; then
    run_tests
  fi
  
  # Ask if user wants to stop containers
  read -p "Would you like to stop the Docker containers? (y/n): " stop_prompt
  
  if [[ $stop_prompt == "y" || $stop_prompt == "Y" ]]; then
    stop_docker
  else
    echo -e "\n${BOLD}The Docker containers are still running.${NC}"
    echo "You can access the application at http://localhost:3000"
    echo "You can stop the containers later by running: docker-compose down"
  fi
  
  print_header "Setup Complete"
  echo "The Context Generator is now set up for testing with Docker."
  echo "If you want to deploy to production, review the .env.production file"
  echo "and update it with your actual production values."
}

# Run the main function
main