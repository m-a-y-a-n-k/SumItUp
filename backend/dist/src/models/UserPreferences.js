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
const userPreferencesSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
userPreferencesSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
// Static methods
userPreferencesSchema.statics.findByUserId = function (userId) {
    return this.findOne({ userId });
};
userPreferencesSchema.statics.createDefault = function (userId) {
    return this.create({ userId });
};
// Instance methods
userPreferencesSchema.methods.updatePreferences = function (updates) {
    Object.keys(updates).forEach(key => {
        if (this.schema.paths[key] && updates[key] !== undefined) {
            this[key] = updates[key];
        }
    });
    return this.save();
};
exports.default = mongoose_1.default.model("UserPreferences", userPreferencesSchema);
//# sourceMappingURL=UserPreferences.js.map