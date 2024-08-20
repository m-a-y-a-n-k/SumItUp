const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
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
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate a reset token and set expiry date
userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetToken = resetToken;
  this.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
  return resetToken;
};

// Validate reset token
userSchema.methods.validateResetToken = function (token) {
  const isTokenValid =
    this.resetToken === token && this.resetTokenExpiry > Date.now();
  return isTokenValid;
};

// Generate Email verification token
userSchema.methods.generateVerificationToken = function () {
  return crypto.randomBytes(32).toString("hex");
};

// Static method to find by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: { $eq: email } });
};

module.exports = mongoose.model("User", userSchema);
