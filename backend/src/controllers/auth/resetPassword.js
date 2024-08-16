const User = require("../../models/User");

// Reset Password method
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Validate password strength
    if (
      !newPassword ||
      !/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(newPassword)
    ) {
      return res.status(400).json({
        error: "Password must be alphanumeric and at least 8 characters long",
      });
    }
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error resetting password" });
  }
};

module.exports = resetPassword;
