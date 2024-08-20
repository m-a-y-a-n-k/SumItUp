const User = require("../../models/User");

// Verify Email method
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: { $eq: token } });
    if (!user) {
      return res.status(400).json({ error: "Invalid verification token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error verifying email" });
  }
};

module.exports = verifyEmail;
