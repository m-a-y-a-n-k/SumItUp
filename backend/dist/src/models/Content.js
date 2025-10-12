"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const contentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
contentSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
// Index for efficient queries
contentSchema.index({ userId: 1, createdAt: -1 });
contentSchema.index({ userId: 1, isFavorite: 1 });
contentSchema.index({ userId: 1, contentType: 1 });
contentSchema.index({ tags: 1 });
// Static methods
contentSchema.statics.findByUserId = function (userId, options = {}) {
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
        .limit(parseInt(limit.toString()))
        .skip(parseInt(offset.toString()));
};
contentSchema.statics.searchByTags = function (userId, tags) {
    return this.find({
        userId,
        tags: { $in: tags }
    }).sort({ createdAt: -1 });
};
// Instance methods
contentSchema.methods.toggleFavorite = function () {
    this.isFavorite = !this.isFavorite;
    return this.save();
};
contentSchema.methods.addTags = function (newTags) {
    const uniqueTags = [...new Set([...this.tags, ...newTags])];
    this.tags = uniqueTags;
    return this.save();
};
contentSchema.methods.removeTags = function (tagsToRemove) {
    this.tags = this.tags.filter(tag => !tagsToRemove.includes(tag));
    return this.save();
};
exports.default = mongoose_1.default.model("Content", contentSchema);
//# sourceMappingURL=Content.js.map