"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebookCallback = exports.githubCallback = exports.googleCallback = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/User"));
// Google Callback method
const googleCallback = async (req, res) => {
    const user = req.user;
    if (!user || !user.email) {
        return res.status(400).json({ error: "Invalid user data from Google" });
    }
    try {
        // Check if the user already exists in the database
        let existingUser = await User_1.default.findByEmail(user.email);
        if (!existingUser) {
            // Create a new user if not found
            existingUser = new User_1.default({
                username: user.name || "Google User",
                email: user.email,
                verified: true, // OAuth users are pre-verified
            });
            await existingUser.save();
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ error: "JWT secret not configured" });
        }
        // Generate a JWT token
        const jwtToken = jsonwebtoken_1.default.sign({ id: existingUser._id, email: existingUser.email }, jwtSecret, { expiresIn: "1h" });
        return res.status(200).json({ token: jwtToken });
    }
    catch (error) {
        console.error("Google callback error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.googleCallback = googleCallback;
// GitHub Callback method
const githubCallback = async (req, res) => {
    const user = req.user;
    if (!user || !user.email) {
        return res.status(400).json({ error: "Invalid user data from GitHub" });
    }
    try {
        let existingUser = await User_1.default.findByEmail(user.email);
        if (!existingUser) {
            existingUser = new User_1.default({
                username: user.name || "GitHub User",
                email: user.email,
                verified: true, // OAuth users are pre-verified
            });
            await existingUser.save();
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ error: "JWT secret not configured" });
        }
        const jwtToken = jsonwebtoken_1.default.sign({ id: existingUser._id, email: existingUser.email }, jwtSecret, { expiresIn: "1h" });
        return res.status(200).json({ token: jwtToken });
    }
    catch (error) {
        console.error("GitHub callback error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.githubCallback = githubCallback;
// Facebook Callback method
const facebookCallback = async (req, res) => {
    const user = req.user;
    if (!user || !user.email) {
        return res.status(400).json({ error: "Invalid user data from Facebook" });
    }
    try {
        let existingUser = await User_1.default.findByEmail(user.email);
        if (!existingUser) {
            existingUser = new User_1.default({
                username: user.name || "Facebook User",
                email: user.email,
                verified: true, // OAuth users are pre-verified
            });
            await existingUser.save();
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ error: "JWT secret not configured" });
        }
        const jwtToken = jsonwebtoken_1.default.sign({ id: existingUser._id, email: existingUser.email }, jwtSecret, { expiresIn: "1h" });
        return res.status(200).json({ token: jwtToken });
    }
    catch (error) {
        console.error("Facebook callback error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.facebookCallback = facebookCallback;
//# sourceMappingURL=sso.js.map