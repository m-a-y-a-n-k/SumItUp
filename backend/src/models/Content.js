const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  originalContent: { 
    type: String, 
    required: true 
  },
  summary: { 
    type: String, 
    required: true 
  },
  contentType: { 
    type: String, 
    enum: ['audio', 'image', 'video', 'gif', 'url', 'pdf', 'book', 'text'],
    required: true 
  },
  metadata: {
    processingTime: { type: Number }, // in milliseconds
    confidence: { type: Number, min: 0, max: 1 },
    wordCount: { type: Number },
    language: { type: String, default: 'en' },
    fileSize: { type: Number }, // in bytes
    originalFileName: { type: String }
  },
  tags: [{ type: String }],
  isFavorite: { 
    type: Boolean, 
    default: false 
  },
  isPublic: { 
    type: Boolean, 
    default: false 
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

// Update the updatedAt field before saving
contentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
contentSchema.index({ userId: 1, createdAt: -1 });
contentSchema.index({ userId: 1, isFavorite: 1 });
contentSchema.index({ userId: 1, contentType: 1 });
contentSchema.index({ tags: 1 });

// Static methods
contentSchema.statics.findByUserId = function(userId, options = {}) {
  const { limit = 10, offset = 0, contentType, isFavorite } = options;
  
  const query = { userId };
  
  if (contentType) {
    query.contentType = contentType;
  }
  
  if (isFavorite !== undefined) {
    query.isFavorite = isFavorite;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(offset));
};

contentSchema.statics.searchByTags = function(userId, tags) {
  return this.find({
    userId,
    tags: { $in: tags }
  }).sort({ createdAt: -1 });
};

// Instance methods
contentSchema.methods.toggleFavorite = function() {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

contentSchema.methods.addTags = function(newTags) {
  const uniqueTags = [...new Set([...this.tags, ...newTags])];
  this.tags = uniqueTags;
  return this.save();
};

contentSchema.methods.removeTags = function(tagsToRemove) {
  this.tags = this.tags.filter(tag => !tagsToRemove.includes(tag));
  return this.save();
};

module.exports = mongoose.model("Content", contentSchema);
