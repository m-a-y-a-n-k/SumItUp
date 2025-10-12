"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../models/User"));
// Signup method
const signup = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res
            .status(400)
            .json({ error: "Username, Email, and password are required" });
    }
    // Validate email
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }
    // Validate password strength
    if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
        return res.status(400).json({
            error: "Password must be alphanumeric and at least 8 characters long",
        });
    }
    try {
        const existingUser = await User_1.default.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }
        const user = new User_1.default({ username, email, password });
        await user.save();
        return res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Error creating user" });
    }
};
exports.default = signup;
//# sourceMappingURL=signup.js.map