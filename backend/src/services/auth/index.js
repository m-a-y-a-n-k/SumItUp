const nodemailer = require("nodemailer");

class AuthService {
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
  async sendResetEmail(email, resetToken) {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `
        <p>You requested a password reset</p>
        <p>Click <a href="${resetLink}">here</a> to reset your password</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error("Error sending reset email: " + error.message);
    }
  }

  // Method to send a verification email
  async sendVerificationEmail(email, verificationToken) {
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `
        <p>Please verify your email address</p>
        <p>Click <a href="${verificationLink}">here</a> to verify your email</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error("Error sending verification email: " + error.message);
    }
  }
}

const authService = new AuthService();

module.exports = authService;
