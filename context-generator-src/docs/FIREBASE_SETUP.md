```diff
--- a/context-generator-src/docs/FIREBASE_SETUP.md
+++ b/context-generator-src/docs/FIREBASE_SETUP.md
@@ -1,20 +1,17 @@
 # Firebase Setup Guide for ContextForge
 
-This guide will help you set up Firebase for authentication and storage in the ContextForge application.
+This guide will help you set up Firebase for authentication and data storage (using Firestore) in the ContextForge application.
 
-## Understanding the Dual Database Architecture
+## Understanding the Firebase Architecture
 
-ContextForge uses a hybrid database approach:
+ContextForge uses Firebase exclusively for its backend needs:
 
-- **MongoDB**: Primary database for server-side document storage and data management
-- **Firebase**: Handles authentication and provides optional client-side storage
+- **Firebase Authentication**: Handles user sign-up, login (including social providers like Google), and session management.
+- **Firestore**: Serves as the primary NoSQL database for storing user profiles, generated documents, and application data.
 
 This architecture allows you to:
-1. Use Firebase's robust authentication system (including social logins)
-2. Leverage MongoDB's powerful querying capabilities for document storage
-3. Have flexibility in development with fallback mock services
+1. Leverage Firebase's robust and integrated authentication system.
+2. Utilize Firestore's real-time capabilities, scalability, and strong integration with Firebase Auth for security rules.
+3. Simplify the backend stack by relying on a single BaaS provider.
+4. Have flexibility in development using the Firebase Emulator Suite and optional fallback mock services.
 
-For development environments, you can use mock services without setting up either database.
-For production deployments, we recommend configuring both MongoDB and Firebase.
+For development environments, you can use the Firebase Emulator Suite or mock services. For production deployments, a configured Firebase project is required.
 
 ## Prerequisites

```