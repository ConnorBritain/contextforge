# Deployment Guide for ContextForge

This guide outlines the steps necessary to deploy and run the ContextForge application, including frontend, backend API, and Cloud Functions for AI generation.

## Prerequisites

*   **Node.js:** Version 18 or later (check `.nvmrc` or `engines` in `package.json`).
*   **npm:** Node Package Manager (usually included with Node.js).
*   **Firebase Account:** A Google account with access to Firebase.
*   **Firebase CLI:** Install or update the Firebase Command Line Interface: `npm install -g firebase-tools`.
*   **Firebase Project:** A Firebase project created via the [Firebase Console](https://console.firebase.google.com/).
*   **AI Provider API Keys:** API keys for OpenAI and/or Anthropic, depending on which service(s) you intend to use.
*   **Git:** For cloning the repository.

## Deployment Steps

### 1. Clone Repository

```bash
# Replace with your repository URL if different
git clone https://github.com/connorbritain/contextforge.git
cd contextforge
```

### 2. Install Dependencies

Install dependencies for the root project (server) and the client application, then for the Cloud Functions.

```bash
# Installs root (server) deps and automatically runs client install
npm install 

# Install Cloud Functions dependencies
cd functions
npm install
cd ..
```

### 3. Firebase Project Setup

Perform these steps in the [Firebase Console](https://console.firebase.google.com/) for your project:

*   **Authentication:**
    *   Navigate to **Build > Authentication**.
    *   Click **Get started**.
    *   Enable the desired Sign-in providers (e.g., **Email/Password**, Google, etc.).
*   **Firestore Database:**
    *   Navigate to **Build > Firestore Database**.
    *   Click **Create database**.
    *   Choose **Start in production mode** (recommended) or test mode.
    *   Select a Firestore location (cannot be changed later).
    *   Click **Enable**.
*   **Register Web App:**
    *   Go to **Project settings** (gear icon) > **General**.
    *   Scroll down to **Your apps**.
    *   Click the **Web** icon (`</>`) to register a new web app.
    *   Give it a nickname (e.g., "ContextForge Web Client").
    *   Click **Register app**.
    *   **Important:** Copy the `firebaseConfig` object provided. You will need this for the client configuration.
*   **Generate Service Account Key:**
    *   Go to **Project settings** > **Service accounts**.
    *   Ensure **Node.js** is selected.
    *   Click **Generate new private key**.
    *   Confirm by clicking **Generate key**.
    *   A JSON file will download. **Save this file securely** and note its absolute path. You will need this for server and function configuration.

### 4. Application Configuration

Configure the environment variables and client settings:

*   **Client Firebase Config:**
    *   Copy `context-generator-src/client/src/config/firebase.js.example` to `context-generator-src/client/src/config/firebase.js`.
    *   Paste the `firebaseConfig` object (obtained in Step 3) into this new file, replacing the placeholder values.
*   **Server Environment (`.env`):**
    *   Copy `context-generator-src/config/.env.example` to `context-generator-src/config/.env`.
    *   Edit `.env` and set the following:
        *   `FIREBASE_PROJECT_ID`: Your Firebase project ID.
        *   `GOOGLE_APPLICATION_CREDENTIALS`: The **absolute path** to the service account key JSON file you downloaded in Step 3.
        *   (Optional) Adjust `PORT`, `ALLOWED_ORIGINS` if needed for your deployment environment.
*   **Cloud Functions Environment:**
    *   Run these commands from the **root** project directory, replacing `YOUR_KEY` with your actual API keys:
      ```bash
      firebase login # Ensure you are logged into the correct Firebase account
      firebase use YOUR_FIREBASE_PROJECT_ID # Set the active project

      # Set API Keys (only include keys for services you will use)
      firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY"
      firebase functions:config:set anthropic.key="YOUR_ANTHROPIC_API_KEY"

      # Optional: Set default AI service for functions (if applicable)
      # firebase functions:config:set ai.service="openai"

      # Verify the config (optional)
      # firebase functions:config:get
      ```
    *   **Note:** If you update function configurations later, you need to redeploy the functions for the changes to take effect.

### 5. Deploy Firebase Resources

Deploy Firestore security rules and the Cloud Function from the root project directory:

```bash
# Deploy Firestore rules defined in firestore.rules
firebase deploy --only firestore:rules

# Deploy Cloud Functions defined in the functions/ directory
firebase deploy --only functions
```

*   Wait for the deployment to complete successfully.

### 6. Build and Deploy Frontend/Server (Example: Using Firebase Hosting)

This step depends heavily on your chosen hosting provider. Here's an example using Firebase Hosting for the frontend and potentially Cloud Run or another service for the backend API (though the backend API is now minimal).

*   **Build the React Client:**
    ```bash
    cd context-generator-src/client
    npm run build
    cd ../.. 
    ```
*   **Firebase Hosting Setup (if not done):**
    ```bash
    # Run from root directory
    firebase init hosting 
    ```
    *   Select your Firebase project.
    *   Specify the **public directory**: `context-generator-src/client/build`
    *   Configure as a single-page app: **Yes**
    *   Set up automatic builds and deploys with GitHub: **No** (can be set up later)
*   **Deploy to Firebase Hosting:**
    ```bash
    firebase deploy --only hosting
    ```
*   **Deploy Backend API (if needed):** The Express server is now mainly for user login/registration and saving/listing/deleting drafts. It doesn't handle generation. You could deploy this to:
    *   **Cloud Run:** Containerize it (using the existing Dockerfile) and deploy.
    *   **App Engine:** Adapt it for App Engine deployment.
    *   **Other Node.js hosting:** Heroku, Render, etc.
    *   **Crucial:** Ensure the deployed backend API has the correct `GOOGLE_APPLICATION_CREDENTIALS` path accessible and the `.env` file configured.

### 7. Access Application

*   If using Firebase Hosting, access the application via your Firebase Hosting URL (`YOUR_PROJECT_ID.web.app` or custom domain).
*   Ensure the frontend can reach the deployed backend API (check CORS configuration `ALLOWED_ORIGINS` in the backend `.env` file).

## Post-Deployment Considerations

*   **Monitoring:** Monitor Cloud Function logs and performance in the Firebase Console or Google Cloud Console.
*   **Costs:** Be mindful of Firebase usage (Firestore reads/writes, Function invocations, Hosting bandwidth) and AI provider costs (token usage). Set up budget alerts if necessary.
*   **Security:** Regularly review Firestore security rules and Cloud Function access controls.
*   **Updates:** To update the application, make code changes, rebuild/redeploy the relevant parts (hosting, functions, backend API).
