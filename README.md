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
- Comprehensive error handling
- Production-ready security measures

## Technology Stack

- **Frontend**: React with Context API
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **AI Integration**: Anthropic Claude and OpenAI
- **Authentication**: JWT-based auth
- **Subscription**: Tiered plans with usage limits
- **Containerization**: Docker for deployment
- **Security**: Helmet, rate limiting, XSS protection
- **Monitoring**: Health checks, logging, error tracking

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

## Testing the Application

### Using Docker (Recommended)

We provide platform-specific scripts to set up and test the application with Docker:

1. Navigate to the project directory:
   ```
   cd context-generator-src
   ```

2. Run the appropriate setup script for your platform:

   **Auto-detect OS and run the appropriate script:**
   ```
   ./scripts/setup.sh
   ```

   **Windows:**
   ```
   Right-click scripts/setup-docker-test-windows.bat and select "Run as administrator"
   ```

   **macOS:**
   ```
   ./scripts/setup-docker-test-mac.sh
   ```

   **Linux:**
   ```
   ./scripts/setup-docker-test.sh
   ```

3. Follow the prompts to:
   - Install any missing prerequisites (Node.js, Docker, etc.)
   - Configure your environment variables
   - Build and start Docker containers
   - Run token tracking and subscription tests

### Manual Testing

To test specific components:

1. Start the application in development mode:
   ```
   npm run dev
   ```
2. Run unit tests:
   ```
   npm test
   ```
3. Test API endpoints:
   ```
   cd server
   npm test
   ```

## Deployment

### Docker Deployment (Recommended)

1. Configure environment variables for production:
   ```
   cp .env.production .env
   ```
2. Edit the .env file with your actual production credentials
3. Build and start containers:
   ```
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](./context-generator-src/DEPLOYMENT.md).

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

- `/client`: React frontend application
- `/server`: Node.js backend API
- `/shared`: Shared code and types
- `/scripts`: Deployment and testing scripts

## Security Features

- HTTPS enforcement in production
- Rate limiting to prevent abuse
- JWT authentication with secure settings
- Input validation and sanitization
- Protection against XSS and NoSQL injection
- Secure HTTP headers with Helmet

## Development Status

- [x] Basic application structure
- [x] AI integration (Claude and OpenAI)
- [x] Document generation and processing
- [x] Database integration and authentication
- [x] Error handling and deployment configuration
- [x] CI/CD pipeline
- [x] Token usage tracking
- [x] Subscription management system
- [x] Usage dashboards
- [x] Production security measures
- [x] Health monitoring endpoints
- [x] Token usage testing scripts
