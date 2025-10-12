"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../models/User"));
const auth_1 = __importDefault(require("../../services/auth"));
// Forgot Password method
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    try {
        const user = await User_1.default.findByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const resetToken = user.generateResetToken();
        await user.save();
        await auth_1.default.sendResetEmail(email, resetToken);
        return res.status(200).json({ message: "Password reset link sent" });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({ error: "Error sending reset link" });
    }
};
exports.default = forgotPassword;
//# sourceMappingURL=forgotPassword.js.map