# Configuration Directory

This directory contains environment configuration files for different deployment environments:

- `.env` - Development environment variables
- `.env.example` - Example environment variables (template for new setups)
- `.env.production` - Production environment variables

## Usage

When setting up the application, copy `.env.example` to `.env` and update the values as needed:

```bash
cp .env.example .env
```

For production deployment, use the production environment file:

```bash
cp .env.production .env
```

## Environment Variables

The configuration files contain environment variables for:

- Server settings (port, environment)
- Database connection
- Authentication (JWT)
- AI provider settings (Anthropic, OpenAI)
- Firebase configuration
- Client/server URLs

## Important Notes

- Never commit `.env` files with real credentials to version control
- Sensitive information like API keys should be kept secure
- For local development, the `.env` file in this directory is used
- For Docker deployment, see the Docker environment file in the `docker` directory