import { Request, Response } from "express";
import User from "../../models/User";

export interface VerifyEmailRequest extends Request {
  query: {
    token: string;
  };
}

// Verify Email method
const verifyEmail = async (req: VerifyEmailRequest, res: Response): Promise<Response> => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Verification token is required" });
  }

  try {
    const user = await User.findOne({ verificationToken: { $eq: token } });
    if (!user) {
      return res.status(400).json({ error: "Invalid verification token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({ error: "Error verifying email" });
  }
};

export default verifyEmail;
