import { Request, Response } from "express";
import User from "../../models/User";

export interface SignupRequest extends Request {
  body: {
    username: string;
    email: string;
    password: string;
  };
}

// Signup method
const signup = async (req: SignupRequest, res: Response): Promise<Response> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, Email, and password are required" });
  }

  // Validate email
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Validate password strength
  if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
    return res.status(400).json({
      error: "Password must be alphanumeric and at least 8 characters long",
    });
  }

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Error creating user" });
  }
};

export default signup;
