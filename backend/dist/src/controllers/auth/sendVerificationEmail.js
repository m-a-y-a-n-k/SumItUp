"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../models/User"));
const auth_1 = __importDefault(require("../../services/auth"));
// Send Verification Email method
const sendVerificationEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    try {
        const user = await User_1.default.findByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.verified) {
            return res.status(400).json({ error: "Email is already verified" });
        }
        const verificationToken = user.generateVerificationToken();
        user.verificationToken = verificationToken;
        await user.save();
        await auth_1.default.sendVerificationEmail(email, verificationToken);
        return res.status(200).json({ message: "Verification email sent" });
    }
    catch (error) {
        console.error("Send verification email error:", error);
        return res.status(500).json({ error: "Error sending verification email" });
    }
};
exports.default = sendVerificationEmail;
//# sourceMappingURL=sendVerificationEmail.js.map