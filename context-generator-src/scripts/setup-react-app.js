/**
 * Script to set up the React application with proper configurations
 * Runs during initial setup to address common React setup issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up React application...');

// Paths
const clientDir = path.join(__dirname, '..', 'client');
const srcDir = path.join(clientDir, 'src');
const nodeModulesDir = path.join(clientDir, 'node_modules');

// Make sure the src directory exists
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
  console.log('Created src directory');
}

// Install React and related dependencies if not already installed
if (!fs.existsSync(nodeModulesDir) || !fs.existsSync(path.join(nodeModulesDir, 'react'))) {
  console.log('Installing React dependencies...');
  try {
    execSync('cd client && npm install react react-dom react-router-dom react-scripts axios --save', { stdio: 'inherit' });
    console.log('React dependencies installed successfully');
  } catch (error) {
    console.error('Failed to install React dependencies:', error.message);
    process.exit(1);
  }
}

// Create an .env file in the client directory if it doesn't exist
const envFilePath = path.join(clientDir, '.env');
if (!fs.existsSync(envFilePath)) {
  console.log('Creating .env file with React configuration...');
  
  const envContent = `
# React environment variables
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Context Generator
BROWSER=none
# Disable deprecated warnings
DISABLE_ESLINT_PLUGIN=true
SKIP_PREFLIGHT_CHECK=true
  `.trim();
  
  fs.writeFileSync(envFilePath, envContent);
  console.log('.env file created');
}

// Add CRACO configuration if needed for advanced React configuration 
const cracoConfigPath = path.join(clientDir, 'craco.config.js');
if (!fs.existsSync(cracoConfigPath)) {
  console.log('Creating CRACO configuration...');
  
  const cracoConfig = `
module.exports = {
  babel: {
    plugins: [
      '@babel/plugin-transform-private-methods',
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-private-property-in-object',
    ],
  },
  webpack: {
    configure: {
      // Webpack configuration overrides if needed
    },
  },
};
  `.trim();
  
  fs.writeFileSync(cracoConfigPath, cracoConfig);
  console.log('CRACO configuration created');
}

// Create or update .gitignore
const gitignorePath = path.join(clientDir, '.gitignore');
if (!fs.existsSync(gitignorePath)) {
  console.log('Creating .gitignore for React app...');
  
  const gitignoreContent = `
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
  `.trim();
  
  fs.writeFileSync(gitignorePath, gitignoreContent);
  console.log('.gitignore created');
}

console.log('✅ React application setup completed!');