import { Request, Response } from "express";
import User from "../../models/User";

export interface ResetPasswordRequest extends Request {
  body: {
    token: string;
    newPassword: string;
  };
}

// Reset Password method
const resetPassword = async (req: ResetPasswordRequest, res: Response): Promise<Response> => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required" });
  }

  try {
    // Validate password strength
    if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(newPassword)) {
      return res.status(400).json({
        error: "Password must be alphanumeric and at least 8 characters long",
      });
    }

    const user = await User.findOne({
      resetToken: { $eq: token },
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ error: "Error resetting password" });
  }
};

export default resetPassword;
