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
- Responsive design for desktop and mobile

## Technology Stack

- **Frontend**: React with Context API
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **AI Integration**: Anthropic Claude and OpenAI
- **Authentication**: JWT-based auth

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
- [ ] Error handling improvements
- [ ] Production deployment
- [ ] CI/CD pipeline
