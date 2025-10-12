import { Request, Response } from "express";
import User from "../../models/User";
import authService from "../../services/auth";

export interface SendVerificationEmailRequest extends Request {
  body: {
    email: string;
  };
}

// Send Verification Email method
const sendVerificationEmail = async (req: SendVerificationEmailRequest, res: Response): Promise<Response> => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    const verificationToken = user.generateVerificationToken();
    user.verificationToken = verificationToken;
    await user.save();

    await authService.sendVerificationEmail(email, verificationToken);

    return res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Send verification email error:", error);
    return res.status(500).json({ error: "Error sending verification email" });
  }
};

export default sendVerificationEmail;
