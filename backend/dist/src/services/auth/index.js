"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class AuthService {
    constructor() {
        // Configure your SMTP transporter
        this.transporter = nodemailer_1.default.createTransport({
            service: "Gmail", // or another email service provider
            auth: {
                user: process.env.EMAIL_USER, // your email address
                pass: process.env.EMAIL_PASS, // your email password or app-specific password
            },
        });
    }
    // Method to send a password reset email
    async sendResetEmail(email, resetToken) {
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        const mailOptions = {
            to: email,
            subject: "Password Reset",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your SumItUp account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetLink}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                ...mailOptions
            });
        }
        catch (error) {
            console.error("Error sending reset email:", error);
            throw new Error("Error sending reset email: " + error.message);
        }
    }
    // Method to send a verification email
    async sendVerificationEmail(email, verificationToken) {
        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
        const mailOptions = {
            to: email,
            subject: "Email Verification - SumItUp",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to SumItUp!</h2>
          <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
          <p>Click the button below to verify your email:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">Verify Email</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationLink}</p>
          <p>If you didn't create an account with SumItUp, please ignore this email.</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                ...mailOptions
            });
        }
        catch (error) {
            console.error("Error sending verification email:", error);
            throw new Error("Error sending verification email: " + error.message);
        }
    }
    // Method to send a generic email
    async sendEmail(options) {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                ...options
            });
        }
        catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Error sending email: " + error.message);
        }
    }
}
const authService = new AuthService();
exports.default = authService;
//# sourceMappingURL=index.js.map