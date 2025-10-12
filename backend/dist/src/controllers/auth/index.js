"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const forgotPassword_1 = __importDefault(require("./forgotPassword"));
const login_1 = __importDefault(require("./login"));
const logout_1 = __importDefault(require("./logout"));
const resetPassword_1 = __importDefault(require("./resetPassword"));
const sendVerificationEmail_1 = __importDefault(require("./sendVerificationEmail"));
const signup_1 = __importDefault(require("./signup"));
const sso_1 = require("./sso");
const verifyEmail_1 = __importDefault(require("./verifyEmail"));
const authController = {
    login: login_1.default,
    signup: signup_1.default,
    logout: logout_1.default,
    forgotPassword: forgotPassword_1.default,
    resetPassword: resetPassword_1.default,
    sendVerificationEmail: sendVerificationEmail_1.default,
    verifyEmail: verifyEmail_1.default,
    googleCallback: sso_1.googleCallback,
    githubCallback: sso_1.githubCallback,
    facebookCallback: sso_1.facebookCallback,
};
exports.default = authController;
//# sourceMappingURL=index.js.map