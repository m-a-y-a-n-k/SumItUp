const User = require("../../models/User");
const authService = require("../../services/auth");

// Forgot Password method
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = user.generateResetToken();
    await user.save();

    await authService.sendResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    res.status(500).json({ error: "Error sending reset link" });
  }
};

module.exports = forgotPassword;
