# ContextForge

A platform for generating professional context documents (e.g., marketing profiles, style guides) based on user input via a guided wizard. It leverages AI (OpenAI/Anthropic) for content generation and Firebase for persistence and backend processing.

## Core Features

*   **Multi-Step Wizard:** Guides users through providing detailed information relevant to various document types.
*   **AI-Powered Generation:** Uses LLMs (configurable: OpenAI/Anthropic) to generate structured documents based on wizard input.
*   **Firebase Integration:**
    *   **Authentication:** Uses Firebase Authentication for user management.
    *   **Firestore:** Persists wizard drafts in the `wizardResponses` collection.
    *   **Cloud Functions:** Automatically triggers document generation via a Firestore `onCreate` trigger when a new draft is saved. The generated content is saved back to the corresponding Firestore document.
*   **Real-time Updates:** (Leveraging Cloud Functions + Firestore listeners) Users can see the status and final generated document update in real-time.
*   **Chunking for Large Inputs:** Automatically splits large wizard inputs into smaller chunks to fit within AI model context limits.

## Project Structure

*   `context-generator-src/client/`: React frontend application (Create React App).
*   `context-generator-src/server/`: Node.js/Express backend server (handles user auth, saving initial drafts, potentially other API tasks).
*   `context-generator-src/shared/`: Code shared between client and server (constants, types).
*   `context-generator-src/config/`: Configuration files for the server.
*   `context-generator-src/scripts/`: Helper scripts for setup, Docker, etc.
*   `context-generator-src/docs/`: Detailed documentation guides.
*   `functions/`: Firebase Cloud Functions code (handles the core AI generation process triggered by Firestore).
*   `firestore.rules`: Security rules for Firestore database access.

## Getting Started

1.  **Clone Repository:** `git clone <repository-url>`
2.  **Install Root Dependencies:** `cd contextforge && npm install` (Installs server deps and runs client install via `postinstall` script)
3.  **Install Function Dependencies:** `cd functions && npm install && cd ..`
4.  **Firebase Setup:**
    *   Create a Firebase project (or use an existing one).
    *   Enable **Authentication** (Email/Password provider at minimum).
    *   Enable **Firestore Database**.
    *   Follow the detailed [Firebase Setup Guide](./docs/FIREBASE_SETUP.md) to configure client-side SDKs and obtain a service account key for the backend/functions.
5.  **Environment Configuration:**
    *   **Client:** Copy `context-generator-src/client/src/config/firebase.js.example` to `firebase.js` and add your Firebase project's web app configuration details.
    *   **Server:** Create `context-generator-src/config/.env` based on `.env.example`. Fill in your `FIREBASE_PROJECT_ID` and the *absolute path* to your downloaded Firebase Admin SDK service account key (`GOOGLE_APPLICATION_CREDENTIALS`).
    *   **Cloud Functions:** Set required environment configuration using the Firebase CLI (run from the root directory):
        ```bash
        # Replace YOUR_KEY with actual keys
        firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY"
        firebase functions:config:set anthropic.key="YOUR_ANTHROPIC_API_KEY"
        # Optional: Set preferred AI service
        # firebase functions:config:set ai.service="openai" 
        # Deploy config changes if needed: firebase deploy --only functions
        ```
6.  **Deploy Firestore Rules & Cloud Function:**
    *   `firebase deploy --only firestore:rules`
    *   `firebase deploy --only functions`
7.  **Start Development Server:** `cd context-generator-src && npm run dev` (Starts client & server concurrently)

## Development Workflow

1.  Make changes to client, server, or functions code.
2.  The development server (`npm run dev`) uses `nodemon` for automatic server restarts. The client uses React's hot-reloading.
3.  If you change Cloud Functions code, redeploy them: `firebase deploy --only functions`.
4.  If you change Firestore rules, redeploy them: `firebase deploy --only firestore:rules`.

## Key Technologies

*   React (Frontend)
*   Node.js / Express (Backend API - primarily for auth, initial draft save)
*   Firebase (Auth, Firestore, Cloud Functions)
*   OpenAI / Anthropic (AI Generation)
*   Tiktoken (Token counting & chunking)
*   React Hot Toast (Notifications)

## Contributing

Contributions are welcome. Please follow existing code patterns and ensure necessary environment setup is documented. Consider adding tests for new functionality.
