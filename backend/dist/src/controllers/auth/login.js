"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/User"));
// Login method
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const user = await User_1.default.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ error: "JWT secret not configured" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, jwtSecret, {
            expiresIn: "1h",
        });
        return res.status(200).json({ token });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Error logging in" });
    }
};
exports.default = login;
//# sourceMappingURL=login.js.map