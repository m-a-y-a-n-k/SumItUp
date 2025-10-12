import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/User";

export interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

// Login method
const login = async (req: LoginRequest, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: "JWT secret not configured" });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Error logging in" });
  }
};

export default login;
