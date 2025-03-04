const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('./default');

// Use mockDataService for development or User model for production
let User;
if (process.env.NODE_ENV === 'production' || process.env.MONGODB_REQUIRED === 'true') {
  User = require('../models/User');
} else {
  // Use the mock data service for development without MongoDB
  User = require('../services/mockDataService');
}

/**
 * Configure Passport strategies
 */
module.exports = function() {
  // Serialize user ID to the session
  passport.serializeUser((user, done) => {
    done(null, user.id || user._id);
  });

  // Deserialize user from the session ID
  passport.deserializeUser(async (id, done) => {
    try {
      let user;
      
      if (process.env.NODE_ENV === 'production' || process.env.MONGODB_REQUIRED === 'true') {
        user = await User.findById(id);
      } else {
        user = await User.getUserById(id);
      }
      
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // Configure Google Strategy
  passport.use(new GoogleStrategy({
    clientID: config.auth.google.clientID,
    clientSecret: config.auth.google.clientSecret,
    callbackURL: `${config.serverUrl}${config.auth.google.callbackURL}`,
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists with this Google ID
      let user;
      
      if (process.env.NODE_ENV === 'production' || process.env.MONGODB_REQUIRED === 'true') {
        user = await User.findOne({ 'googleId': profile.id });
        
        if (!user) {
          // If no user found with this Google ID, check if the email exists
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
          if (email) {
            user = await User.findOne({ email });
          }
          
          if (!user) {
            // Create a new user
            user = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: email,
              // Generate a random password for Google auth users
              password: Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10)
            });
            await user.save();
          } else {
            // Add Google ID to existing user
            user.googleId = profile.id;
            await user.save();
          }
        }
      } else {
        // Mock data service implementation
        user = await User.findUserByGoogleId(profile.id);
        
        if (!user) {
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
          
          // Try to find by email
          if (email) {
            user = await User.findUserByEmail(email);
          }
          
          if (!user) {
            // Create new user in mock service
            user = await User.createUser({
              googleId: profile.id,
              name: profile.displayName,
              email: email,
              role: 'user'
            });
          } else {
            // Add Google ID to existing user
            user = await User.updateUser(user.id, { googleId: profile.id });
          }
        }
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
};