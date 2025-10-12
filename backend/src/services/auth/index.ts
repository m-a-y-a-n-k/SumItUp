import nodemailer, { Transporter } from "nodemailer";
import { EmailOptions } from "../../types";

class AuthService {
  private transporter: Transporter;

  constructor() {
    // Configure your SMTP transporter
    this.transporter = nodemailer.createTransport({
      service: "Gmail", // or another email service provider
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email password or app-specific password
      },
    });
  }

  // Method to send a password reset email
  async sendResetEmail(email: string, resetToken: string): Promise<void> {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions: EmailOptions = {
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
    } catch (error) {
      console.error("Error sending reset email:", error);
      throw new Error("Error sending reset email: " + (error as Error).message);
    }
  }

  // Method to send a verification email
  async sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    const mailOptions: EmailOptions = {
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
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Error sending verification email: " + (error as Error).message);
    }
  }

  // Method to send a generic email
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        ...options
      });
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Error sending email: " + (error as Error).message);
    }
  }
}

const authService = new AuthService();

export default authService;
