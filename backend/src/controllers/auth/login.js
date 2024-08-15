const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { jwtSecret } = require("../../../config");

const login = async (req, res) => {
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
};

module.exports = login;
