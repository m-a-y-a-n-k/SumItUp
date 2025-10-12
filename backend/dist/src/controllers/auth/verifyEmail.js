"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../models/User"));
// Verify Email method
const verifyEmail = async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ error: "Verification token is required" });
    }
    try {
        const user = await User_1.default.findOne({ verificationToken: { $eq: token } });
        if (!user) {
            return res.status(400).json({ error: "Invalid verification token" });
        }
        user.verified = true;
        user.verificationToken = undefined;
        await user.save();
        return res.status(200).json({ message: "Email verified successfully" });
    }
    catch (error) {
        console.error("Email verification error:", error);
        return res.status(500).json({ error: "Error verifying email" });
    }
};
exports.default = verifyEmail;
//# sourceMappingURL=verifyEmail.js.map