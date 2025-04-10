```diff
--- a/README.md
+++ b/README.md
@@ -250,34 +250,24 @@
 
 ### Database Strategy
 
-ContextForge uses a hybrid database approach:
+ContextForge uses Firebase for both authentication and data storage:
 
-#### MongoDB (Primary Database)
-- Stores document data, user profiles, and usage analytics
-- Handles persistent data storage on the server
-- Used for complex queries and data aggregation
-- Required in production mode
-
-#### Firebase (Authentication & Client-side)
+#### Firebase (Authentication & Firestore Database)
 - Handles user authentication including Google OAuth
-- Provides real-time capabilities for collaborative features
-- Offers client-side storage options
+- Uses **Firestore** as the primary database to store document data, user profiles, and usage analytics.
+- Handles persistent data storage directly within the Firebase ecosystem.
+- Provides real-time capabilities for potential future collaborative features.
 - Simplifies mobile/web authentication flow
 
 #### Advantages of this approach:
 - **Separation of concerns**: Authentication is handled by Firebase's battle-tested system.
-- **Flexibility**: Development can proceed without full database setup
-- **Transition path**: Allows gradual migration between database systems
-- **Performance**: Uses each database for its strengths
-- **Development simplicity**: Mock services can replace both in development
-
-#### Configuration:
-- Enable/disable MongoDB with `MONGODB_REQUIRED=true` in environment
-- Firebase is optional in development but recommended for auth in production
-- Mock services provide fallbacks when databases are unavailable
+- **Integrated Ecosystem**: Leverages Firebase's seamless integration between Auth, Firestore, and other services.
+- **Scalability**: Firestore offers automatic scaling.
+- **Real-time Updates**: Built-in support for real-time data synchronization.
+- **Development Simplicity**: Firebase Emulator Suite allows for local development, and mock services can provide fallbacks if needed.
 
 > 📘 **For detailed database setup instructions, see [FIREBASE_SETUP.md](./context-generator-src/docs/FIREBASE_SETUP.md)**
+> *Note: References to MongoDB setup are no longer applicable.*
 
 ## 🔒 Security
 
@@ -288,7 +278,7 @@
 - **Authentication**: Firebase Auth with JWT tokens for server-side validation
 - **Request Safety**: Input validation, sanitization, XSS protection
 - **API Security**: Rate limiting, CORS configuration
-- **Infrastructure**: Secure Helmet HTTP headers, NoSQL injection protection
+- **Infrastructure**: Secure Helmet HTTP headers, Firestore Security Rules for data access control.
 - **Monitoring**: Comprehensive logging and error tracking
 
 ## 📊 Project Status

```