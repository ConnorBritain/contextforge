/**
 * Unified Docker Setup Script for Context Generator
 * 
 * This script handles Docker setup with dynamic port allocation.
 * It can be used directly with Node.js or called from platform-specific
 * shell scripts (Windows batch, Linux/Mac bash).
 */

// Ensure js-yaml is installed
try {
  require('js-yaml');
} catch (error) {
  console.error('Required dependency js-yaml is not installed.');
  console.error('Please run: npm install --no-save js-yaml');
  process.exit(1);
}

const dockerUtils = require('./docker-utils');
const { exec } = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

// Console colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Ask a yes/no question
 * 
 * @param {string} question - The question to ask
 * @param {boolean} defaultAnswer - The default answer if user presses Enter
 * @returns {Promise<boolean>} - The user's answer
 */
function askYesNo(question, defaultAnswer = true) {
  return new Promise((resolve) => {
    const suffix = defaultAnswer ? ' (Y/n)' : ' (y/N)';
    rl.question(question + suffix + ': ', (answer) => {
      if (answer.trim() === '') {
        resolve(defaultAnswer);
      } else {
        resolve(answer.trim().toLowerCase() === 'y');
      }
    });
  });
}

/**
 * Execute a command and return the result
 * 
 * @param {string} command - The command to execute
 * @returns {Promise<string>} - The command output
 */
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command}`);
    
    exec(command, { cwd: dockerUtils.PROJECT_ROOT }, (error, stdout, stderr) => {
      if (error) {
        console.error(`${colors.red}Command failed: ${error}${colors.reset}`);
        console.error(stderr);
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

/**
 * Main setup function
 * 
 * @param {object} options - Setup options
 * @returns {Promise<void>}
 */
async function setupDocker(options = {}) {
  const skipChecks = options.skipChecks || false;
  const skipPrompts = options.skipPrompts || false;
  
  try {
    console.log(`\n${colors.bright}${colors.cyan}====== Context Generator Docker Setup ======${colors.reset}\n`);
    
    // Step 1: Check Docker
    console.log(`${colors.yellow}Step 1: Checking Docker availability...${colors.reset}`);
    if (!skipChecks) {
      const dockerAvailable = await dockerUtils.checkDockerAvailable();
      if (!dockerAvailable) {
        console.error(`${colors.red}ERROR: Docker not found or not running.${colors.reset}`);
        console.error('Please install Docker and ensure it is running before continuing.');
        process.exit(1);
      }
      console.log(`${colors.green}Docker is available.${colors.reset}\n`);
    } else {
      console.log('Skipping Docker availability check.');
    }
    
    // Step 2: Setup .env file
    console.log(`${colors.yellow}Step 2: Setting up environment file...${colors.reset}`);
    await dockerUtils.setupEnvFile();
    
    if (!skipPrompts) {
      const editEnv = await askYesNo('Would you like to edit the .env file?', false);
      if (editEnv) {
        const envPath = path.join(dockerUtils.PROJECT_ROOT, 'config', '.env');
        console.log(`Please edit the file at: ${envPath}`);
        
        // Open the file with the default editor based on the platform
        const platform = process.platform;
        if (platform === 'win32') {
          await executeCommand(`start notepad "${envPath}"`);
        } else if (platform === 'darwin') {
          await executeCommand(`open "${envPath}"`);
        } else {
          // Linux or other
          await executeCommand(`xdg-open "${envPath}" || nano "${envPath}" || vi "${envPath}"`);
        }
        
        console.log('Waiting for you to finish editing the .env file...');
        await askYesNo('Press Y when you have finished editing the file', true);
      }
    }
    
    // Step 3: Update Docker Compose with dynamic ports
    console.log(`\n${colors.yellow}Step 3: Finding available ports...${colors.reset}`);
    const portInfo = await dockerUtils.updateDockerComposeWithAvailablePorts();
    
    // Step 4: Build and start containers
    console.log(`\n${colors.yellow}Step 4: Building and starting Docker containers...${colors.reset}`);
    console.log('This may take several minutes on the first run.');
    
    try {
      // Stop any running containers first
      await executeCommand('docker-compose down');
      
      // Build and start containers
      if (options.rebuild) {
        await executeCommand('docker-compose build --no-cache');
      } else {
        await executeCommand('docker-compose build');
      }
      
      await executeCommand('docker-compose up -d');
      
      console.log(`\n${colors.bright}${colors.green}====== Setup Complete! ======${colors.reset}\n`);
      console.log(`The Context Generator is now running at: ${colors.cyan}http://localhost:${portInfo.mainPort}${colors.reset}\n`);
      
      console.log(`${colors.yellow}Notes:${colors.reset}`);
      console.log('- If you need real AI services, make sure you have API keys in the .env file');
      console.log('- To stop the application: docker-compose down');
      console.log('- To view logs: docker-compose logs\n');
      
    } catch (error) {
      console.error(`${colors.red}ERROR: Failed to build or start Docker containers.${colors.reset}`);
      console.error('See error messages above for details.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error(`${colors.red}ERROR: ${error.message}${colors.reset}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// If this script is run directly
if (require.main === module) {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const options = {
    skipChecks: args.includes('--skip-checks'),
    skipPrompts: args.includes('--skip-prompts'),
    rebuild: args.includes('--rebuild')
  };
  
  setupDocker(options).catch(error => {
    console.error(`Unhandled error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = setupDocker;