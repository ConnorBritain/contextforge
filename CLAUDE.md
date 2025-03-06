# CLAUDE.md - Context Generator Project Guide

## Commands
- `cd context-generator-src && npm install` - Install dependencies
- `npm run dev` - Start development server (both client and server)
- `npm run client` - Start client only
- `npm run server` - Start server only
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm test -- -t "test name"` - Run specific test
- `cd context-generator-src/client && npm run firebase:emulators:start` - Start Firebase emulators for local development

## Project Structure
- Configuration files are in their respective directories:
  - Environment config: `context-generator-src/config/`
  - Docker config: `context-generator-src/docker/`
- Development scripts: `context-generator-src/scripts/`

## Firebase Implementation
- Project: ContextForge
- Configuration stored in client/.env file (copy from config/.env.example)
- Authentication: Email/password and Google OAuth
- Database: Firestore for storing user profiles and documents
- Storage: For document attachments and user uploads
- To set up Firebase:
  1. Create a Firebase project in the Firebase console
  2. Enable Authentication (Email/password and Google providers)
  3. Enable Firestore Database 
  4. Enable Storage
  5. Add a web app to your Firebase project
  6. Copy the Firebase config to `config/.env` file
  7. Run `firebase init` in the project root to set up Firebase tools

## Code Style Guidelines
- React functional components with hooks
- ES6+ JavaScript with JSX
- Frontend: React (18+) with context API for state management
- Backend: Express.js with modular controller/service architecture (transitioning to Firebase)
- File naming: PascalCase for components, camelCase for utilities
- Error handling: Try/catch in async functions, ErrorMessage component for UI
- Import order: React/libraries, then local components, then styles
- Section formatting: Clear headings with consistent syntax (### for subsections)

## Document Processing
- Documents must maintain professional section structure
- Each document type follows specific template with consistent formatting
- Focus on enhancing prompt templates to create comprehensive, structured documents