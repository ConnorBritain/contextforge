# Database Setup Guide for ContextForge

This guide explains how to set up and configure the dual database architecture used in ContextForge.

## Database Architecture Overview

ContextForge uses a hybrid database approach with:

- **MongoDB**: Primary database for persistent storage of documents and user data
- **Firebase**: Authentication and real-time client-side features

## MongoDB Setup

### Local Development Setup

1. **Install MongoDB Community Edition**
   - [Download and install MongoDB](https://www.mongodb.com/try/download/community)
   - Or use Docker: `docker run --name mongodb -p 27017:27017 -d mongo`

2. **Configure environment variables**
   Edit your `.env` file in the `config` directory:

   ```
   MONGODB_URI=mongodb://localhost:27017/context-generator
   MONGODB_REQUIRED=true
   ```

3. **Testing the connection**
   ```bash
   npm run dev
   ```
   Check the console for successful MongoDB connection messages.

### Production MongoDB Setup

1. **Create a MongoDB Atlas account**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free tier is available)
   - Follow Atlas setup wizard to create your cluster

2. **Configure network access**
   - Add your server IP to the IP whitelist
   - Or allow access from anywhere (less secure, not recommended for production)

3. **Create a database user**
   - Go to Security > Database Access
   - Create a user with read/write permissions

4. **Get your connection string**
   - Go to Clusters > Connect > Connect your application
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your values

5. **Update production environment**
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
   MONGODB_REQUIRED=true
   ```

## Firebase Setup

### Creating a Firebase Project

1. **Create a Firebase project**
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the prompts
   - Enable Google Analytics if desired

2. **Configure Authentication**
   - In Firebase console, go to Authentication > Sign-in method
   - Enable Email/Password and Google authentication methods

### Client-Side Firebase Setup (Web App)

1. **Register your web app**
   - In Firebase console, click the web icon (</>) on the project overview page
   - Give your app a nickname (e.g., "ContextForge Web")
   - Register the app and copy the configuration

2. **Add configuration to environment variables**
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

### Server-Side Firebase Setup (Admin SDK)

1. **Generate a private key**
   - In Firebase console, go to Project settings > Service accounts
   - Click "Generate new private key"
   - Download and secure the JSON file

2. **Add to server environment variables**
   ```
   # Format the entire service account JSON as a single line string
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id","private_key_id":"key-id","private_key":"-----BEGIN PRIVATE KEY-----\nkey-content\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk@your-project-id.iam.gserviceaccount.com","client_id":"client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40your-project.iam.gserviceaccount.com"}
   FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
   ```

## Development With Mock Services

For development without database setup:

1. **Configure environment for mock services**
   ```
   NODE_ENV=development
   MONGODB_REQUIRED=false
   USE_REAL_AI=false
   ```

2. **Run the application**
   ```bash
   npm run dev
   ```

   The application will use mock services to simulate both MongoDB and Firebase functionality.

## Switching Between Environments

### Development to Production

1. Update environment variables:
   ```
   NODE_ENV=production
   MONGODB_REQUIRED=true
   USE_REAL_AI=true
   ```

2. Ensure both MongoDB and Firebase are properly configured

### Testing Different Configurations

You can test different database configurations:

1. **MongoDB only (no Firebase)**
   ```
   MONGODB_REQUIRED=true
   # Leave Firebase variables empty or commented out
   ```

2. **Firebase only (no MongoDB)**
   ```
   MONGODB_REQUIRED=false
   # Set all Firebase variables
   ```

3. **Both databases (recommended for production)**
   ```
   MONGODB_REQUIRED=true
   # Set all Firebase variables
   ```

4. **No databases (development with mocks)**
   ```
   MONGODB_REQUIRED=false
   # Leave Firebase variables empty or commented out
   ```

## Troubleshooting

### MongoDB Connection Issues
- Verify the connection string is correct
- Check if MongoDB is running (`mongo` or `mongosh` command)
- Ensure network settings allow connections
- Check for MongoDB server logs

### Firebase Authentication Issues
- Verify API keys and configuration
- Check if authentication methods are enabled
- Inspect browser console for client-side errors
- Review Firebase Auth documentation for specific error codes

## References

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Mongoose Documentation](https://mongoosejs.com/docs/)