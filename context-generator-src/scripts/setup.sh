#!/bin/bash
# OS detection and setup script for Context Generator

# Text formatting
BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Detect the operating system
detect_os() {
  case "$(uname -s)" in
    Linux*)  
      echo "linux"
      ;;
    Darwin*) 
      echo "macos"
      ;;
    MINGW*|MSYS*|CYGWIN*)  
      echo "windows"
      ;;
    *)        
      echo "unknown"
      ;;
  esac
}

OS=$(detect_os)
echo -e "${BOLD}Detected operating system: ${GREEN}$OS${NC}"

# Run the appropriate setup script based on the OS
case "$OS" in
  linux)
    echo -e "\n${YELLOW}Running Linux setup script...${NC}"
    ./scripts/setup-docker-test.sh
    ;;
  macos)
    echo -e "\n${YELLOW}Running macOS setup script...${NC}"
    ./scripts/setup-docker-test-mac.sh
    ;;
  windows)
    if [ -f /bin/bash ]; then
      echo -e "\n${YELLOW}Running Windows setup script via Git Bash...${NC}"
      # For Git Bash environments, run the regular Bash script
      ./scripts/setup-docker-test.sh
    else
      echo -e "\n${YELLOW}Please run the Windows batch script instead:${NC}"
      echo -e "Right-click on ${BOLD}scripts/setup-docker-test-windows.bat${NC} and select 'Run as administrator'"
      exit 1
    fi
    ;;
  *)
    echo -e "\n${RED}Unsupported operating system. Please manually run:${NC}"
    echo "  - Linux/Git Bash: ./scripts/setup-docker-test.sh"
    echo "  - macOS: ./scripts/setup-docker-test-mac.sh"
    echo "  - Windows: scripts/setup-docker-test-windows.bat (as administrator)"
    exit 1
    ;;
esac