const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/default');

/**
 * User Schema for authentication and user management
 */
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values (for users without Google auth)
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'professional', 'enterprise'],
      default: 'free'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: function() {
        // Default to one month from now
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
      }
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  usage: {
    tokenCount: {
      type: Number,
      default: 0
    },
    monthlyAllowance: {
      type: Number,
      default: 50000  // Default token limit for free tier
    },
    resetDate: {
      type: Date,
      default: function() {
        // Default to first day of next month
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        return date;
      }
    },
    documents: {
      generated: {
        type: Number,
        default: 0
      },
      limit: {
        type: Number,
        default: 5  // Default document limit for free tier
      }
    }
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  // Hash password with bcrypt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      // Replace plain text password with hashed password
      this.password = hash;
      next();
    });
  });
});

// Method to compare passwords for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      role: this.role,
      subscription: this.subscription.plan
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

// Method to check if user has reached token limit
UserSchema.methods.hasReachedTokenLimit = function() {
  return this.usage.tokenCount >= this.usage.monthlyAllowance;
};

// Method to check if user has reached document limit
UserSchema.methods.hasReachedDocumentLimit = function() {
  return this.usage.documents.generated >= this.usage.documents.limit;
};

// Method to update token usage
UserSchema.methods.updateTokenUsage = async function(tokenCount) {
  this.usage.tokenCount += tokenCount;
  this.lastActive = Date.now();
  await this.save();
  return this.usage.tokenCount;
};

// Method to increment document count
UserSchema.methods.incrementDocumentCount = async function() {
  this.usage.documents.generated += 1;
  await this.save();
  return this.usage.documents.generated;
};

// Method to reset usage if past reset date
UserSchema.methods.checkAndResetUsage = async function() {
  const now = new Date();
  
  if (now >= this.usage.resetDate) {
    // Create new reset date for first day of next month
    const nextMonth = new Date(now);
    nextMonth.setMonth(now.getMonth() + 1);
    nextMonth.setDate(1);
    nextMonth.setHours(0, 0, 0, 0);
    
    this.usage.tokenCount = 0;
    this.usage.documents.generated = 0;
    this.usage.resetDate = nextMonth;
    await this.save();
    return true;
  }
  
  return false;
};

module.exports = mongoose.model('User', UserSchema);