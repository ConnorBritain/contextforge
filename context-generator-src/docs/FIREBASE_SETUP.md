# Firebase Setup Guide for ContextForge

This guide will help you set up Firebase for authentication and storage in the ContextForge application.

## Understanding the Dual Database Architecture

ContextForge uses a hybrid database approach:

- **MongoDB**: Primary database for server-side document storage and data management
- **Firebase**: Handles authentication and provides optional client-side storage

This architecture allows you to:
1. Use Firebase's robust authentication system (including social logins)
2. Leverage MongoDB's powerful querying capabilities for document storage
3. Have flexibility in development with fallback mock services

For development environments, you can use mock services without setting up either database.
For production deployments, we recommend configuring both MongoDB and Firebase.

## Prerequisites

- A Firebase account (free tier is sufficient to start)
- Access to the Firebase console (https://console.firebase.google.com/)
- Node.js and npm installed on your machine

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics if desired (optional)
4. Click "Create project"

## Step 2: Configure Firebase Authentication

1. In the Firebase console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Enable the sign-in methods you want to use (Email/Password, Google, etc.)
4. Save your changes

## Step 3: Set up Firestore (if needed)

1. In the Firebase console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose either "Production mode" or "Test mode" (choose Test mode for development)
4. Select a location for your database
5. Click "Enable"

## Step 4: Configure Firebase Storage (if needed)

1. In the Firebase console, go to "Storage" in the left sidebar
2. Click "Get started"
3. Review and accept the default security rules or modify them
4. Click "Next" and "Done"

## Step 5: Get Firebase Configuration

### For Client (Web App)

1. In the Firebase console, click the gear icon (⚙️) next to "Project Overview" and select "Project settings"
2. Scroll down to "Your apps" section
3. If you haven't added a web app yet, click the web icon (</>) to add one
4. Register your app with a nickname (e.g., "ContextForge Web")
5. Copy the Firebase configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### For Server (Admin SDK)

1. In the Firebase console, go to "Project settings"
2. Go to the "Service accounts" tab
3. Click "Generate new private key"
4. Save the JSON file securely - it contains sensitive credentials
5. Never commit this file to your repository

## Step 6: Configure Environment Variables

Add the Firebase configuration to your environment variables:

### Client Configuration (.env)

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### Server Configuration (.env)

```
# Copy the content of your service account JSON file and format it as a single line
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

## Step 7: Install Firebase Dependencies

The `npm run install-all` script should automatically install these dependencies, but if needed, you can install them manually:

### For Client

```bash
cd client
npm install firebase --save
```

### For Server

```bash
npm install firebase-admin --save
```

## Troubleshooting

- **Authentication Issues**: Ensure that the correct authentication methods are enabled in the Firebase console
- **Permission Denied**: Check Firestore and Storage security rules
- **Module Not Found**: Make sure Firebase dependencies are properly installed
- **Configuration Errors**: Verify that environment variables are correctly set

For more detailed information, refer to the [Firebase documentation](https://firebase.google.com/docs).