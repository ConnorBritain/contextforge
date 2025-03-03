const fs = require('fs');
const net = require('net');
const path = require('path');
const yaml = require('js-yaml');

// Function to check if a port is available
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

// Find the next available port starting from the given port
async function findNextAvailablePort(startPort) {
  let port = startPort;
  
  while (!(await isPortAvailable(port))) {
    console.log(`Port ${port} is in use, trying next port...`);
    port++;
  }
  
  return port;
}

async function updateDockerComposeFile() {
  try {
    const dockerComposePath = path.join(__dirname, '..', 'docker-compose.yml');
    const dockerComposeContent = fs.readFileSync(dockerComposePath, 'utf8');
    
    // Parse the YAML content
    const dockerComposeConfig = yaml.load(dockerComposeContent);
    
    // Get the current port mappings
    const currentPorts = dockerComposeConfig.services.app.ports.map(port => {
      // Ports can be in the format "3000:5000" or just "5000"
      const parts = port.toString().split(':');
      return parts.length > 1 ? { host: parseInt(parts[0]), container: parseInt(parts[1]) } : { host: parseInt(parts[0]), container: parseInt(parts[0]) };
    });
    
    // Update port mappings with available ports
    const updatedPorts = [];
    for (const portMapping of currentPorts) {
      const availablePort = await findNextAvailablePort(portMapping.host);
      updatedPorts.push(`${availablePort}:${portMapping.container}`);
      console.log(`Mapped port ${portMapping.container} in container to available port ${availablePort} on host`);
    }
    
    // Update the configuration
    dockerComposeConfig.services.app.ports = updatedPorts;
    
    // Write the updated configuration back to the file
    fs.writeFileSync(dockerComposePath, yaml.dump(dockerComposeConfig));
    
    console.log('Docker Compose configuration updated with available ports.');
    console.log(`The application will be available at: http://localhost:${updatedPorts[0].split(':')[0]}`);
  } catch (error) {
    console.error('Error updating Docker Compose configuration:', error);
    process.exit(1);
  }
}

// Run the update function
updateDockerComposeFile();