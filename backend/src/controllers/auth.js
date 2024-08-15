const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { jwtSecret } = require("../../config.js");

const authController = {
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      // Check if user exists based on email
      const user = await User.findOne({ email });

      // Handle SSO login
      if (!user) {
        // Logic to handle SSO login
        // Redirect or return response based on SSO login flow
        return res.status(401).json({ error: "User not found" });
      }

      // Handle email/password login
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: "1h",
      });

      // Return JWT token in response
      return res.status(200).json({ token });
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async signup(req, res) {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ error: "Username, Email and password are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: "Password must be alphanumeric and at least 8 characters long",
      });
    }

    // Check if user with the same email already exists
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }
    } catch (error) {
      console.error("Error checking existing user:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Create a new user
    const newUser = new User({ username, email, password });

    try {
      await newUser.save();
      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = authController;
