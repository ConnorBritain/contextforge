/**
 * Docker Utilities for Context Generator
 * 
 * This file contains utilities for Docker setup and configuration,
 * including dynamic port allocation.
 */

const fs = require('fs');
const net = require('net');
const path = require('path');
const os = require('os');

// Ensure js-yaml is installed
let yaml;
try {
  yaml = require('js-yaml');
} catch (error) {
  console.error('Required dependency js-yaml is not installed.');
  console.error('Please run: npm install --no-save js-yaml');
  process.exit(1);
}

// Project root directory
const PROJECT_ROOT = path.resolve(__dirname, '..');

/**
 * Check if a port is available on a specific host
 * 
 * @param {number} port - The port to check
 * @param {string} host - The host to check (default: '0.0.0.0')
 * @returns {Promise<boolean>} - True if port is available, false otherwise
 */
function isPortAvailableOnHost(port, host = '0.0.0.0') {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', () => {
      // Port is in use on this host
      resolve(false);
    });
    
    server.once('listening', () => {
      // Port is available, close the server
      server.close();
      resolve(true);
    });
    
    server.listen(port, host);
  });
}

/**
 * Comprehensively check if a port is available
 * Checks on both 0.0.0.0 (all interfaces), 127.0.0.1 (localhost) and
 * even attempts to connect to it as a client to truly verify availability
 * 
 * @param {number} port - The port to check
 * @returns {Promise<boolean>} - True if port is available, false otherwise
 */
async function isPortAvailable(port) {
  // First check if port is in use by any service on all interfaces
  const availableAllInterfaces = await isPortAvailableOnHost(port, '0.0.0.0');
  if (!availableAllInterfaces) {
    return false;
  }
  
  // Then check if port is in use specifically on localhost
  const availableLocalhost = await isPortAvailableOnHost(port, '127.0.0.1');
  if (!availableLocalhost) {
    return false;
  }
  
  // Finally, try to connect to the port as a client to see if anything responds
  try {
    const isReachable = await new Promise((resolve) => {
      const client = new net.Socket();
      const timeout = setTimeout(() => {
        client.destroy();
        resolve(false); // Not reachable (timeout)
      }, 200);
      
      client.connect(port, '127.0.0.1', () => {
        clearTimeout(timeout);
        client.destroy();
        resolve(true); // Reachable (something is listening)
      });
      
      client.on('error', () => {
        clearTimeout(timeout);
        client.destroy();
        resolve(false); // Not reachable (connection error)
      });
    });
    
    // If we can connect to it, it's NOT available (something is listening)
    return !isReachable;
  } catch (error) {
    // If there's an error connecting, it might be available
    return true;
  }
}

/**
 * Find the next available port starting from the given port
 * Uses a smart strategy for checking ports:
 * 1. First checks specific ports we're likely to use (3000, 5000, 8000, 8080)
 * 2. Then checks nearby ports
 * 3. Then jumps to higher port ranges to avoid common services
 * 
 * @param {number} startPort - The port to start checking from
 * @returns {Promise<number>} - The next available port
 */
async function findNextAvailablePort(startPort) {
  // Common development ports to try first
  const commonPorts = [3000, 5000, 8000, 8080];
  
  // Try starting port first if it's not in the common ports list
  if (!commonPorts.includes(startPort)) {
    if (await isPortAvailable(startPort)) {
      return startPort;
    }
    console.log(`Port ${startPort} is in use, checking alternatives...`);
  }
  
  // Try common development ports first
  for (const port of commonPorts) {
    // Skip if it's lower than our desired starting port
    if (port < startPort) continue;
    
    if (await isPortAvailable(port)) {
      return port;
    }
    console.log(`Port ${port} is in use, checking alternatives...`);
  }
  
  // Try consecutive ports in a range around the start port
  const rangeStart = Math.min(startPort, 3000); // Don't go below 3000
  const rangeEnd = rangeStart + 20;             // Check up to 20 ports in this range
  
  for (let port = rangeStart; port <= rangeEnd; port++) {
    // Skip ports we've already checked
    if (port === startPort || commonPorts.includes(port)) continue;
    
    if (await isPortAvailable(port)) {
      return port;
    }
    console.log(`Port ${port} is in use, checking alternatives...`);
  }
  
  // If we still haven't found a port, try higher ranges which are less likely to be in use
  // Start from port 9000 and check blocks of 1000 ports, sampling a few from each block
  for (let block = 9; block <= 60; block++) { // Up to port 60000
    const blockBase = block * 1000;
    
    // Check a few random ports in each block
    const portsToCheck = [
      blockBase,
      blockBase + 100,
      blockBase + 500,
      blockBase + 900
    ];
    
    for (const port of portsToCheck) {
      if (await isPortAvailable(port)) {
        return port;
      }
      console.log(`Port ${port} is in use, checking alternatives...`);
    }
  }
  
  throw new Error(`Could not find an available port after extensive searching. Please specify a port manually.`);
}

/**
 * Check if a continuous range of ports is available
 * Useful for finding a block of ports that are all available together
 * 
 * @param {number} startPort - The first port in the range
 * @param {number} count - How many consecutive ports to check
 * @returns {Promise<boolean>} - True if all ports in the range are available
 */
async function isPortRangeAvailable(startPort, count) {
  for (let i = 0; i < count; i++) {
    const port = startPort + i;
    if (!(await isPortAvailable(port))) {
      return false;
    }
  }
  return true;
}

/**
 * Find a range of consecutive available ports
 * 
 * @param {number} count - How many consecutive ports needed
 * @param {number} startPort - The port to start searching from
 * @returns {Promise<number>} - The starting port of an available range
 */
async function findAvailablePortRange(count, startPort = 8000) {
  // Check some common ranges first (8000+, 9000+, 10000+)
  const commonRangeStarts = [8000, 9000, 10000, 3000];
  
  for (const rangeStart of commonRangeStarts) {
    // Skip if it's lower than our desired starting port
    if (rangeStart < startPort) continue;
    
    if (await isPortRangeAvailable(rangeStart, count)) {
      return rangeStart;
    }
    console.log(`Port range ${rangeStart}-${rangeStart + count - 1} has conflicts, checking alternatives...`);
  }
  
  // Check every 1000 ports in higher ranges
  for (let block = 11; block <= 60; block++) { // 11000 to 60000
    const rangeStart = block * 1000;
    if (await isPortRangeAvailable(rangeStart, count)) {
      return rangeStart;
    }
    console.log(`Port range ${rangeStart}-${rangeStart + count - 1} has conflicts, checking alternatives...`);
  }
  
  // If we still haven't found a range, try a more exhaustive search
  // Start from 8000 and check every 100 ports
  for (let port = Math.max(8000, startPort); port <= 60000; port += 100) {
    if (await isPortRangeAvailable(port, count)) {
      return port;
    }
  }
  
  throw new Error(`Could not find ${count} consecutive available ports after extensive searching.`);
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
    
    // If we have multiple ports to map, try to find a continuous range
    // so that all services can be on adjacent ports
    if (currentPorts.length > 1) {
      console.log(`Searching for ${currentPorts.length} consecutive available ports...`);
      const rangeStart = await findAvailablePortRange(currentPorts.length);
      
      // Map container ports to host ports in the range we found
      const updatedPorts = [];
      const portMap = {};
      
      currentPorts.forEach((portMapping, index) => {
        const availablePort = rangeStart + index;
        updatedPorts.push(`${availablePort}:${portMapping.container}`);
        portMap[portMapping.container] = availablePort;
        console.log(`Mapped port ${portMapping.container} in container to available port ${availablePort} on host`);
      });
      
      // Update the configuration
      dockerComposeConfig.services.app.ports = updatedPorts;
      
      // Write the updated configuration back to the file
      fs.writeFileSync(dockerComposePath, yaml.dump(dockerComposeConfig));
      
      console.log('Docker Compose configuration updated with consecutive available ports.');
      console.log(`The application will be available at: http://localhost:${portMap[5000] || updatedPorts[0].split(':')[0]}`);
      
      return {
        portMap,
        mainPort: portMap[5000] || updatedPorts[0].split(':')[0]
      };
    } 
    else {
      // For a single port, just find the next available port
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
    }
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
  isPortAvailableOnHost,
  findNextAvailablePort,
  isPortRangeAvailable,
  findAvailablePortRange,
  updateDockerComposeWithAvailablePorts,
  checkDockerAvailable,
  setupEnvFile,
  PROJECT_ROOT
};