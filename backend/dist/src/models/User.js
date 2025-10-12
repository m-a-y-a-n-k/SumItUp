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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    tokens: { type: Number, default: 0 },
    adEligible: { type: Boolean, default: true },
    resetToken: { type: String }, // For password reset functionality
    resetTokenExpiry: { type: Date }, // Expiry of the reset token
    verificationToken: { type: String }, // For email verification
    verified: { type: Boolean, default: false }, // is email verified
});
// Hash the password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt_1.default.genSalt(10);
    this.password = await bcrypt_1.default.hash(this.password, salt);
    next();
});
// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt_1.default.compare(candidatePassword, this.password);
};
// Generate a reset token and set expiry date
userSchema.methods.generateResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    this.resetToken = resetToken;
    this.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
    return resetToken;
};
// Validate reset token
userSchema.methods.validateResetToken = function (token) {
    const isTokenValid = this.resetToken === token && this.resetTokenExpiry && this.resetTokenExpiry > new Date();
    return !!isTokenValid;
};
// Generate Email verification token
userSchema.methods.generateVerificationToken = function () {
    return crypto_1.default.randomBytes(32).toString("hex");
};
// Static method to find by email
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email: { $eq: email } });
};
exports.default = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=User.js.map