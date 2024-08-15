const User = require("../../models/User");

async function signup(req, res) {
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
}

module.exports = signup;
