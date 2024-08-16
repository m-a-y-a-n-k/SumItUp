const crypto = require("crypto");
const User = require("../../models/User");
const authService = require("../../services/auth");

// Send Verification Email method
const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const verificationToken = user.generateVerificationToken();
    await authService.sendVerificationEmail(email, verificationToken);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    res.status(500).json({ error: "Error sending verification email" });
  }
};

module.exports = sendVerificationEmail;
