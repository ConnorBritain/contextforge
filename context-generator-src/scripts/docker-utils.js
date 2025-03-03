/**
 * Docker Utilities for Context Generator
 * 
 * This file contains utilities for Docker setup and configuration,
 * including dynamic port allocation.
 */

const fs = require('fs');
const net = require('net');
const path = require('path');
const yaml = require('js-yaml');
const os = require('os');

// Project root directory
const PROJECT_ROOT = path.resolve(__dirname, '..');

/**
 * Check if a port is available
 * 
 * @param {number} port - The port to check
 * @returns {Promise<boolean>} - True if port is available, false otherwise
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', () => {
      // Port is in use
      resolve(false);
    });
    
    server.once('listening', () => {
      // Port is available, close the server
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
}

/**
 * Find the next available port starting from the given port
 * 
 * @param {number} startPort - The port to start checking from
 * @returns {Promise<number>} - The next available port
 */
async function findNextAvailablePort(startPort) {
  let port = startPort;
  
  while (!(await isPortAvailable(port))) {
    console.log(`Port ${port} is in use, trying next port...`);
    port++;
    
    // Avoid scanning too many ports
    if (port > startPort + 100) {
      throw new Error(`Could not find an available port after checking 100 ports starting from ${startPort}`);
    }
  }
  
  return port;
}

/**
 * Update the docker-compose.yml file with available ports
 * 
 * @returns {Promise<object>} - Object containing the mapped ports
 */
async function updateDockerComposeWithAvailablePorts() {
  try {
    const dockerComposePath = path.join(PROJECT_ROOT, 'docker-compose.yml');
    const dockerComposeContent = fs.readFileSync(dockerComposePath, 'utf8');
    
    // Parse the YAML content
    const dockerComposeConfig = yaml.load(dockerComposeContent);
    
    // Get the current port mappings
    const currentPorts = dockerComposeConfig.services.app.ports.map(port => {
      // Ports can be in the format "3000:5000" or just "5000"
      const parts = port.toString().split(':');
      return parts.length > 1 ? 
        { host: parseInt(parts[0]), container: parseInt(parts[1]) } : 
        { host: parseInt(parts[0]), container: parseInt(parts[0]) };
    });
    
    // Update port mappings with available ports
    const updatedPorts = [];
    const portMap = {};
    
    for (const portMapping of currentPorts) {
      const availablePort = await findNextAvailablePort(portMapping.host);
      updatedPorts.push(`${availablePort}:${portMapping.container}`);
      portMap[portMapping.container] = availablePort;
      console.log(`Mapped port ${portMapping.container} in container to available port ${availablePort} on host`);
    }
    
    // Update the configuration
    dockerComposeConfig.services.app.ports = updatedPorts;
    
    // Write the updated configuration back to the file
    fs.writeFileSync(dockerComposePath, yaml.dump(dockerComposeConfig));
    
    console.log('Docker Compose configuration updated with available ports.');
    console.log(`The application will be available at: http://localhost:${portMap[5000] || updatedPorts[0].split(':')[0]}`);
    
    return {
      portMap,
      mainPort: portMap[5000] || updatedPorts[0].split(':')[0]
    };
  } catch (error) {
    console.error('Error updating Docker Compose configuration:', error);
    throw error;
  }
}

/**
 * Check if Docker is installed and running
 * 
 * @returns {Promise<boolean>} - True if Docker is available, false otherwise
 */
function checkDockerAvailable() {
  return new Promise((resolve) => {
    const { exec } = require('child_process');
    exec('docker --version', (error) => {
      if (error) {
        console.error('Docker not found or not running');
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * Create a .env file if it doesn't exist
 * 
 * @returns {Promise<boolean>} - True if .env file exists or was created
 */
function setupEnvFile() {
  return new Promise((resolve) => {
    const envPath = path.join(PROJECT_ROOT, '.env');
    const envDockerPath = path.join(PROJECT_ROOT, '.env.docker');
    
    if (!fs.existsSync(envPath)) {
      if (fs.existsSync(envDockerPath)) {
        fs.copyFileSync(envDockerPath, envPath);
        console.log('Created .env file from .env.docker template');
      } else {
        // Create a minimal default .env file
        const defaultEnv = 
`NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://user:password@mongodb:27017/context-generator?authSource=admin
JWT_SECRET=context-generator-secret-key-for-testing
AI_PROVIDER=mock
USE_REAL_AI=false
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5000`;
        
        fs.writeFileSync(envPath, defaultEnv);
        console.log('Created default .env file');
      }
      resolve(true);
    } else {
      console.log('.env file already exists');
      resolve(true);
    }
  });
}

module.exports = {
  isPortAvailable,
  findNextAvailablePort,
  updateDockerComposeWithAvailablePorts,
  checkDockerAvailable,
  setupEnvFile,
  PROJECT_ROOT
};