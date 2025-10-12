import { Request, Response } from "express";
import User from "../../models/User";
import authService from "../../services/auth";

export interface ForgotPasswordRequest extends Request {
  body: {
    email: string;
  };
}

// Forgot Password method
const forgotPassword = async (req: ForgotPasswordRequest, res: Response): Promise<Response> => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = user.generateResetToken();
    await user.save();

    await authService.sendResetEmail(email, resetToken);

    return res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ error: "Error sending reset link" });
  }
};

export default forgotPassword;
