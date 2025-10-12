import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/User";

export interface SSOUser {
  name: string;
  email: string;
  id?: string;
}

export interface SSORequest extends Request {
  user: SSOUser;
}

// Google Callback method
export const googleCallback = async (req: SSORequest, res: Response): Promise<Response> => {
  const user = req.user;

  if (!user || !user.email) {
    return res.status(400).json({ error: "Invalid user data from Google" });
  }

  try {
    // Check if the user already exists in the database
    let existingUser = await User.findByEmail(user.email);

    if (!existingUser) {
      // Create a new user if not found
      existingUser = new User({
        username: user.name || "Google User",
        email: user.email,
        verified: true, // OAuth users are pre-verified
      });
      await existingUser.save();
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: "JWT secret not configured" });
    }

    // Generate a JWT token
    const jwtToken = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      jwtSecret,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token: jwtToken });
  } catch (error) {
    console.error("Google callback error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// GitHub Callback method
export const githubCallback = async (req: SSORequest, res: Response): Promise<Response> => {
  const user = req.user;

  if (!user || !user.email) {
    return res.status(400).json({ error: "Invalid user data from GitHub" });
  }

  try {
    let existingUser = await User.findByEmail(user.email);

    if (!existingUser) {
      existingUser = new User({
        username: user.name || "GitHub User",
        email: user.email,
        verified: true, // OAuth users are pre-verified
      });
      await existingUser.save();
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: "JWT secret not configured" });
    }

    const jwtToken = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      jwtSecret,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token: jwtToken });
  } catch (error) {
    console.error("GitHub callback error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Facebook Callback method
export const facebookCallback = async (req: SSORequest, res: Response): Promise<Response> => {
  const user = req.user;

  if (!user || !user.email) {
    return res.status(400).json({ error: "Invalid user data from Facebook" });
  }

  try {
    let existingUser = await User.findByEmail(user.email);

    if (!existingUser) {
      existingUser = new User({
        username: user.name || "Facebook User",
        email: user.email,
        verified: true, // OAuth users are pre-verified
      });
      await existingUser.save();
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: "JWT secret not configured" });
    }

    const jwtToken = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      jwtSecret,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token: jwtToken });
  } catch (error) {
    console.error("Facebook callback error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
