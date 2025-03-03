# AI Context Generator

A full-stack application for generating professional context documents using AI. The application creates three document types:

1. Target Market Audience Profiles
2. Business Dimensional Profiles
3. AI Style Guides

## Features

- Document generation with AI (Anthropic Claude or OpenAI)
- Multi-step form wizard for data collection
- Document preview and editing
- Export to multiple formats (Markdown, HTML, Text)
- User authentication and document management
- Token usage tracking and subscription management
- Usage dashboards with visual metrics
- Responsive design for desktop and mobile

## Technology Stack

- **Frontend**: React with Context API
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **AI Integration**: Anthropic Claude and OpenAI
- **Authentication**: JWT-based auth
- **Subscription**: Tiered plans with usage limits
- **Containerization**: Docker for deployment

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   cd context-generator-src
   npm run install-all
   ```
3. Configure environment variables (see .env.example)
4. Start the development server:
   ```
   npm run dev
   ```

## Deployment

### Using Docker (Recommended)

1. Configure environment variables in `.env.production`
2. Run the deployment script:
   ```
   cd context-generator-src
   ./scripts/deploy.sh
   ```

### Manual Deployment

1. Build the client:
   ```
   cd context-generator-src/client
   npm run build
   ```
2. Set up environment variables for production
3. Start the server:
   ```
   cd context-generator-src
   NODE_ENV=production npm start
   ```
   
## Project Structure

- `/client`: React frontend
- `/server`: Node.js backend
- `/shared`: Shared code between client and server

## Test Implementation

The project includes comprehensive test coverage:

- Unit tests for models and controllers
- Integration tests for API endpoints
- Authentication tests
- Document generation and processing tests

Run tests with:
```
npm test
```

## Development Status

- [x] Basic application structure
- [x] AI integration (Claude and OpenAI)
- [x] Document generation
- [x] Document processing and formatting
- [x] Database integration
- [x] Authentication system
- [x] Test suite
- [x] Error handling improvements
- [x] Production deployment
- [x] CI/CD pipeline
- [x] Token usage tracking
- [x] Subscription management system
- [x] Usage dashboards
