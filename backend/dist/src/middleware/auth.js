"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).send({ error: "Authentication required" });
    }
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
        return res.status(401).send({ error: "Authentication required" });
    }
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).send({ error: "JWT secret not configured" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = decoded;
        next();
    }
    catch (e) {
        return res.status(401).send({ error: "Invalid auth token" });
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.js.map