"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv")); // Import dotenv for environment variables
dotenv_1.default.config(); // Load environment variables from .env file
const config = {
    // MongoDB configuration
    mongodbURI: process.env.MONGODB_URI || "",
    // JWT secret key
    jwtSecret: process.env.JWT_SECRET || "",
};
exports.default = config;
//# sourceMappingURL=config.js.map