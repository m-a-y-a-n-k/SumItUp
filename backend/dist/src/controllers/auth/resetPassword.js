"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../models/User"));
// Reset Password method
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password are required" });
    }
    try {
        // Validate password strength
        if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(newPassword)) {
            return res.status(400).json({
                error: "Password must be alphanumeric and at least 8 characters long",
            });
        }
        const user = await User_1.default.findOne({
            resetToken: { $eq: token },
            resetTokenExpiry: { $gt: new Date() },
        });
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }
        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        return res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ error: "Error resetting password" });
    }
};
exports.default = resetPassword;
//# sourceMappingURL=resetPassword.js.map