const mongoose = require("mongoose");

const userPreferencesSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  
  // Summary preferences
  defaultSummaryLength: { 
    type: String, 
    enum: ['short', 'medium', 'long'], 
    default: 'medium' 
  },
  
  summaryStyle: { 
    type: String, 
    enum: ['bullet-points', 'paragraph', 'keywords', 'abstract'], 
    default: 'paragraph' 
  },
  
  // Language preferences
  preferredLanguage: { 
    type: String, 
    default: 'en' 
  },
  
  // Processing preferences
  processingQuality: { 
    type: String, 
    enum: ['fast', 'balanced', 'high'], 
    default: 'balanced' 
  },
  
  autoSaveContent: { 
    type: Boolean, 
    default: true 
  },
  
  // Privacy preferences
  defaultPrivacy: { 
    type: String, 
    enum: ['private', 'public'], 
    default: 'private' 
  },
  
  // Notification preferences
  emailNotifications: { 
    type: Boolean, 
    default: true 
  },
  
  processingNotifications: { 
    type: Boolean, 
    default: true 
  },
  
  weeklyDigest: { 
    type: Boolean, 
    default: false 
  },
  
  // Display preferences
  theme: { 
    type: String, 
    enum: ['light', 'dark', 'auto'], 
    default: 'auto' 
  },
  
  itemsPerPage: { 
    type: Number, 
    min: 5, 
    max: 50, 
    default: 10 
  },
  
  // Content type preferences (for recommendations)
  favoriteContentTypes: [{ 
    type: String, 
    enum: ['audio', 'image', 'video', 'gif', 'url', 'pdf', 'book', 'text'] 
  }],
  
  // Tags for personalization
  interests: [{ type: String }],
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
userPreferencesSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static methods
userPreferencesSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

userPreferencesSchema.statics.createDefault = function(userId) {
  return this.create({ userId });
};

// Instance methods
userPreferencesSchema.methods.updatePreferences = function(updates) {
  Object.keys(updates).forEach(key => {
    if (this.schema.paths[key] && updates[key] !== undefined) {
      this[key] = updates[key];
    }
  });
  return this.save();
};

module.exports = mongoose.model("UserPreferences", userPreferencesSchema);
