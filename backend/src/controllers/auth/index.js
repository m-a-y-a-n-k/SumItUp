const forgotPassword = require("./forgotPassword");
const login = require("./login");
const logout = require("./logout");
const resetPassword = require("./resetPassword");
const sendVerificationEmail = require("./sendVerificationEmail");
const signup = require("./signup");
const { googleCallback, githubCallback, facebookCallback } = require("./sso");
const verifyEmail = require("./verifyEmail");

const authController = {
  login,
  signup,
  logout,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  googleCallback,
  githubCallback,
  facebookCallback,
};

module.exports = authController;
