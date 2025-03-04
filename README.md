# ContextForge

<div align="center">
  <img src="context-generator-src/client/public/images/logo.png" alt="ContextForge Logo" width="200"/>
  <p><em>Professional document creation, powered by AI</em></p>
</div>

## Overview

ContextForge is a full-stack application that helps you generate professional context documents using AI. Quickly create well-structured, customized documents for various business and personal needs:

1. Target Market Audience Profiles
2. Business Dimensional Profiles 
3. AI Style Guides
4. Personal Bio Documents

## ✨ Features

- 🤖 **AI-Powered Documents**: Generate professional documents using Anthropic Claude or OpenAI
- 🧙‍♂️ **Intuitive Wizard**: Step-by-step form guides for easy document creation
- 👁️ **Live Preview**: See your document take shape as you input information
- 📤 **Multiple Export Options**: Save as Markdown, HTML, or plain text
- 🔐 **User Management**: Secure authentication and document storage
- 📊 **Usage Tracking**: Monitor AI token usage with visual dashboards
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🛡️ **Enterprise-Ready**: Comprehensive security and error handling

## 🛠️ Technology Stack

<table>
  <tr>
    <td align="center"><strong>Frontend</strong></td>
    <td>React 18+, Context API, JSX, Responsive CSS</td>
  </tr>
  <tr>
    <td align="center"><strong>Backend</strong></td>
    <td>Node.js, Express, MVC architecture</td>
  </tr>
  <tr>
    <td align="center"><strong>Database</strong></td>
    <td>MongoDB with Mongoose ODM</td>
  </tr>
  <tr>
    <td align="center"><strong>AI</strong></td>
    <td>Anthropic Claude and OpenAI with prompt engineering</td>
  </tr>
  <tr>
    <td align="center"><strong>Auth</strong></td>
    <td>JWT-based authentication with secure cookie storage</td>
  </tr>
  <tr>
    <td align="center"><strong>DevOps</strong></td>
    <td>Docker, Environment-specific configurations</td>
  </tr>
  <tr>
    <td align="center"><strong>Security</strong></td>
    <td>Helmet, Rate limiting, Input validation, XSS protection</td>
  </tr>
</table>

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Docker (optional, for containerized setup)
- MongoDB (local or cloud instance)
- API keys for Anthropic Claude or OpenAI

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/contextforge.git
   cd contextforge
   ```

2. **Install dependencies**
   ```bash
   cd context-generator-src
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy and modify the sample environment file
   cp .env.example .env
   # Edit .env with your MongoDB URI and API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs

## 🧪 Testing

### Docker Setup (Recommended)

We provide platform-specific scripts to simplify testing with Docker:

```bash
# Navigate to the project directory
cd context-generator-src

# Auto-detect OS and run appropriate script
./scripts/setup.sh
```

<details>
<summary>Platform-specific commands</summary>

**Windows:**
```
Right-click scripts/setup-docker-test-windows.bat and select "Run as administrator"
```

**macOS:**
```bash
./scripts/setup-docker-test-mac.sh
```

**Linux:**
```bash
./scripts/setup-docker-test.sh
```
</details>

The setup script will:
- Check and install prerequisites
- Configure environment variables
- Build and start Docker containers
- Run automated tests

### Running Tests Manually

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- -t "auth controller"

# Test API endpoints
cd server && npm test

# Test token usage tracking
npm run test:tokens
```

## 🚢 Deployment

### Docker Deployment (Recommended)

```bash
# Configure production environment
cp .env.production .env
# Edit .env with production credentials

# Build and start containers in detached mode
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

<details>
<summary>Manual Deployment Steps</summary>

1. Build the React client:
   ```bash
   cd context-generator-src/client
   npm run build
   ```

2. Set up production environment variables:
   ```bash
   cd ..
   export NODE_ENV=production
   # Set other environment variables as needed
   ```

3. Start the server:
   ```bash
   npm start
   ```
</details>

📚 For detailed deployment instructions including CI/CD setup and scaling options, see [DEPLOYMENT.md](./context-generator-src/DEPLOYMENT.md).

### Docker on Windows

If you're deploying on Windows, see our [Docker Windows Guide](./context-generator-src/DOCKER_WINDOWS_GUIDE.md) for platform-specific instructions.
   
## 📁 Project Structure

```
context-generator-src/
├── client/               # React frontend
│   ├── public/           # Static assets
│   └── src/
│       ├── components/   # UI components
│       ├── context/      # React Context providers
│       ├── pages/        # Page components
│       ├── services/     # API client services
│       ├── styles/       # CSS stylesheets
│       └── utils/        # Helper functions
├── server/               # Express backend
│   ├── src/
│   │   ├── config/       # Environment configurations
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # MongoDB schemas
│   │   ├── prompts/      # AI prompt templates
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helper functions
│   └── tests/            # Backend tests
├── shared/               # Code shared between client and server
│   ├── constants/        # Shared constants
│   ├── types/            # TypeScript types
│   └── utils/            # Shared utilities
└── scripts/              # Deployment and setup scripts
```

## 🔒 Security

ContextForge implements industry-standard security practices:

- **Data Protection**: HTTPS enforcement, secure cookies, encryption
- **Authentication**: JWT with secure settings and proper expiration
- **Request Safety**: Input validation, sanitization, XSS protection
- **API Security**: Rate limiting, CORS configuration
- **Infrastructure**: Secure Helmet HTTP headers, NoSQL injection protection
- **Monitoring**: Comprehensive logging and error tracking

## 📊 Project Status

<table>
  <tr>
    <th>Feature</th>
    <th>Status</th>
    <th>Details</th>
  </tr>
  <tr>
    <td>Core Application</td>
    <td>✅ Complete</td>
    <td>Basic structure, routing, state management</td>
  </tr>
  <tr>
    <td>AI Integration</td>
    <td>✅ Complete</td>
    <td>Claude and OpenAI with fallback mechanisms</td>
  </tr>
  <tr>
    <td>Document Types</td>
    <td>✅ Complete</td>
    <td>4 document types fully implemented</td>
  </tr>
  <tr>
    <td>User Authentication</td>
    <td>✅ Complete</td>
    <td>JWT-based auth with secure storage</td>
  </tr>
  <tr>
    <td>Usage Tracking</td>
    <td>✅ Complete</td>
    <td>Token counting and subscription limits</td>
  </tr>
  <tr>
    <td>Dashboards</td>
    <td>✅ Complete</td>
    <td>Usage metrics and document management</td>
  </tr>
  <tr>
    <td>Security Measures</td>
    <td>✅ Complete</td>
    <td>HTTPS, rate limiting, input validation</td>
  </tr>
  <tr>
    <td>Deployment</td>
    <td>✅ Complete</td>
    <td>Docker configuration, environment setup</td>
  </tr>
  <tr>
    <td>Testing</td>
    <td>✅ Complete</td>
    <td>Unit, integration, and token usage tests</td>
  </tr>
</table>

## 🤝 Contributing

Contributions are welcome! Please check out our [contribution guidelines](./CONTRIBUTING.md) before getting started.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📧 Contact

For questions or support, please [open an issue](https://github.com/yourusername/contextforge/issues) on our GitHub repository.
