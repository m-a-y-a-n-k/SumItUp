import mongoose, { Document, Schema, Model } from "mongoose";
import { ContentType } from "./Content";

export type SummaryLength = 'short' | 'medium' | 'long';
export type SummaryStyle = 'bullet-points' | 'paragraph' | 'keywords' | 'abstract';
export type ProcessingQuality = 'fast' | 'balanced' | 'high';
export type Privacy = 'private' | 'public';
export type Theme = 'light' | 'dark' | 'auto';

export interface IUserPreferences extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Summary preferences
  defaultSummaryLength: SummaryLength;
  summaryStyle: SummaryStyle;
  
  // Language preferences
  preferredLanguage: string;
  
  // Processing preferences
  processingQuality: ProcessingQuality;
  autoSaveContent: boolean;
  
  // Privacy preferences
  defaultPrivacy: Privacy;
  
  // Notification preferences
  emailNotifications: boolean;
  processingNotifications: boolean;
  weeklyDigest: boolean;
  
  // Display preferences
  theme: Theme;
  itemsPerPage: number;
  
  // Content type preferences (for recommendations)
  favoriteContentTypes: ContentType[];
  
  // Tags for personalization
  interests: string[];
  
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  updatePreferences(updates: Partial<IUserPreferences>): Promise<IUserPreferences>;
}

export interface IUserPreferencesModel extends Model<IUserPreferences> {
  findByUserId(userId: mongoose.Types.ObjectId): Promise<IUserPreferences | null>;
  createDefault(userId: mongoose.Types.ObjectId): Promise<IUserPreferences>;
}

const userPreferencesSchema = new Schema<IUserPreferences>({
  userId: { 
    type: Schema.Types.ObjectId, 
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
userPreferencesSchema.pre<IUserPreferences>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static methods
userPreferencesSchema.statics.findByUserId = function(userId: mongoose.Types.ObjectId): Promise<IUserPreferences | null> {
  return this.findOne({ userId });
};

userPreferencesSchema.statics.createDefault = function(userId: mongoose.Types.ObjectId): Promise<IUserPreferences> {
  return this.create({ userId });
};

// Instance methods
userPreferencesSchema.methods.updatePreferences = function(updates: Partial<IUserPreferences>): Promise<IUserPreferences> {
  Object.keys(updates).forEach(key => {
    if (this.schema.paths[key] && updates[key as keyof IUserPreferences] !== undefined) {
      (this as any)[key] = updates[key as keyof IUserPreferences];
    }
  });
  return this.save();
};

export default mongoose.model<IUserPreferences, IUserPreferencesModel>("UserPreferences", userPreferencesSchema);
