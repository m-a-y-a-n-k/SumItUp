import mongoose, { Document, Schema, Model } from "mongoose";

export type ContentType = 'audio' | 'image' | 'video' | 'gif' | 'url' | 'pdf' | 'book' | 'text';

export interface IContentMetadata {
  processingTime?: number; // in milliseconds
  confidence?: number; // 0-1
  wordCount?: number;
  language?: string;
  fileSize?: number; // in bytes
  originalFileName?: string;
}

export interface IContent extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  originalContent: string;
  summary: string;
  contentType: ContentType;
  metadata: IContentMetadata;
  tags: string[];
  isFavorite: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  toggleFavorite(): Promise<IContent>;
  addTags(newTags: string[]): Promise<IContent>;
  removeTags(tagsToRemove: string[]): Promise<IContent>;
}

export interface IContentQueryOptions {
  limit?: number;
  offset?: number;
  contentType?: ContentType;
  isFavorite?: boolean;
}

export interface IContentModel extends Model<IContent> {
  findByUserId(userId: mongoose.Types.ObjectId, options?: IContentQueryOptions): Promise<IContent[]>;
  searchByTags(userId: mongoose.Types.ObjectId, tags: string[]): Promise<IContent[]>;
}

const contentSchema = new Schema<IContent>({
  userId: { 
    type: Schema.Types.ObjectId, 
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
contentSchema.pre<IContent>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient queries
contentSchema.index({ userId: 1, createdAt: -1 });
contentSchema.index({ userId: 1, isFavorite: 1 });
contentSchema.index({ userId: 1, contentType: 1 });
contentSchema.index({ tags: 1 });

// Static methods
contentSchema.statics.findByUserId = function(
  userId: mongoose.Types.ObjectId, 
  options: IContentQueryOptions = {}
): Promise<IContent[]> {
  const { limit = 10, offset = 0, contentType, isFavorite } = options;
  
  const query: any = { userId };
  
  if (contentType) {
    query.contentType = contentType;
  }
  
  if (isFavorite !== undefined) {
    query.isFavorite = isFavorite;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit.toString()))
    .skip(parseInt(offset.toString()));
};

contentSchema.statics.searchByTags = function(
  userId: mongoose.Types.ObjectId, 
  tags: string[]
): Promise<IContent[]> {
  return this.find({
    userId,
    tags: { $in: tags }
  }).sort({ createdAt: -1 });
};

// Instance methods
contentSchema.methods.toggleFavorite = function(): Promise<IContent> {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

contentSchema.methods.addTags = function(newTags: string[]): Promise<IContent> {
  const uniqueTags = [...new Set([...this.tags, ...newTags])];
  this.tags = uniqueTags;
  return this.save();
};

contentSchema.methods.removeTags = function(tagsToRemove: string[]): Promise<IContent> {
  this.tags = this.tags.filter(tag => !tagsToRemove.includes(tag));
  return this.save();
};

export default mongoose.model<IContent, IContentModel>("Content", contentSchema);
