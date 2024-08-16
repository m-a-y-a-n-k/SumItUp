const User = require("../../models/User");

// Google Callback method
const googleCallback = async (req, res) => {
  // const { token } = req.user;
  const user = req.user;

  try {
    // Check if the user already exists in the database
    let existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      // Create a new user if not found
      existingUser = new User({
        username: user.name,
        email: user.email,
        // You might need to handle OAuth tokens and link them here
      });
      await existingUser.save();
    }

    // Generate a JWT token
    const jwtToken = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token: jwtToken });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// GitHub Callback method
const githubCallback = async (req, res) => {
  // const { token } = req.user;
  const user = req.user;

  try {
    let existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      existingUser = new User({
        username: user.name,
        email: user.email,
      });
      await existingUser.save();
    }

    const jwtToken = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token: jwtToken });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Facebook Callback method
const facebookCallback = async (req, res) => {
  // const { token } = req.user;
  const user = req.user;

  try {
    let existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      existingUser = new User({
        username: user.name,
        email: user.email,
      });
      await existingUser.save();
    }

    const jwtToken = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token: jwtToken });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  googleCallback,
  githubCallback,
  facebookCallback,
};
