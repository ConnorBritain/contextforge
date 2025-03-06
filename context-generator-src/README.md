# ContextForge

A context generation platform for enhancing AI prompts with structured data.

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up environment configuration (see below)
4. Set up Firebase (see [Firebase Setup Guide](./docs/FIREBASE_SETUP.md))
5. Start development server: `npm run dev`

## Configuration Files

The application uses several configuration files located in specific directories:

- **Environment Variables**: Located in the `config/` directory
  - `config/.env` - Main environment configuration
  - `config/.env.example` - Example configuration template
  - `config/.env.production` - Production environment configuration

- **Docker Configuration**: Located in the `docker/` directory
  - `docker/docker-compose.yml` - Docker Compose configuration
  - `docker/.env.docker` - Docker-specific environment variables
  - `docker/docker-setup.sh` - Setup script for Unix/Mac
  - `docker/docker-setup.bat` - Setup script for Windows

## Firebase Setup

This application uses Firebase for authentication and data storage. You need to create a Firebase project and add your configuration.

1. Copy `client/src/config/firebase.js.example` to `client/src/config/firebase.js`
2. Add your Firebase configuration values in the new file
3. See the [Firebase Setup Guide](./docs/FIREBASE_SETUP.md) for detailed instructions

## Common Issues and Solutions

### CORS Errors

If you see CORS errors in the console, make sure:
- Both the client and server are running
- The server is using the correct port (usually 5000)
- You've correctly set up the Firebase configuration

### Authentication Errors

- "auth/configuration-not-found": See the [Firebase Setup Guide](./docs/FIREBASE_SETUP.md)
- Other authentication errors: Check that you've enabled Email/Password authentication in Firebase Console

## Development

- `npm run dev` - Start both client and server
- `npm run client` - Start only the client
- `npm run server` - Start only the server

## Contributing

Contributions are welcome. Please ensure you follow the existing code style and patterns.