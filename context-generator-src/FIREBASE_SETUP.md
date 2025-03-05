# Setting Up Firebase for ContextForge

## Fix for "auth/configuration-not-found" Error

If you're seeing the error `Firebase: Error (auth/configuration-not-found)` when trying to sign up or log in, follow these steps:

1. Make sure you have a valid `firebase.js` file:
   - Copy `client/src/config/firebase.js.example` to `client/src/config/firebase.js`
   - Replace all placeholder values with your actual Firebase project values

2. Verify your Firebase configuration:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Click on the web app (or create one if it doesn't exist)
   - In Project Settings, scroll down to "Your apps" section
   - Look for your Web app and click "Config"
   - Copy the entire configuration object and replace the values in `firebase.js`

3. Enable Email/Password authentication:
   - In Firebase Console, navigate to Authentication
   - Click "Sign-in method"
   - Enable "Email/Password" provider

4. Set up Firebase server-side (if using server authentication):
   - Create a service account key in Firebase project settings
   - Save it in `server/.env` or as environment variables
   
## Firebase Configuration Fields

Your `firebase.js` file should include these fields:

```javascript
const firebaseConfig = {
  apiKey: "...", // Required for authentication
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..." // Optional, only if using Analytics
};
```

## Troubleshooting

- Make sure all values in `firebaseConfig` are correct. The most common issue is copying partial information.
- Check browser console for detailed Firebase error messages.
- Ensure your Firebase project has the Authentication service enabled.
- If you've recently created the Firebase project, there might be a propagation delay (wait a few minutes).
- Verify your app is using the firebase.js file with real values, not the example file.

## Security Note

Never commit your actual Firebase config with API keys to public repositories. The `firebase.js` file is in `.gitignore` for this reason. Always use the example file for public sharing.