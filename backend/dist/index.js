"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import session from "express-session";
// import passport from "./src/middleware/passport";
// Extensions
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const errorHandler_1 = __importDefault(require("./src/middleware/errorHandler"));
// Routers
const apiDoc_1 = __importDefault(require("./src/documentation/apiDoc"));
const ad_1 = __importDefault(require("./src/routes/ad"));
const auth_1 = __importDefault(require("./src/routes/auth"));
const summary_1 = __importDefault(require("./src/routes/summary"));
const pdf_1 = __importDefault(require("./src/routes/pdf"));
const search_1 = __importDefault(require("./src/routes/search"));
const token_1 = __importDefault(require("./src/routes/token"));
const file_1 = __importDefault(require("./src/routes/file"));
const content_1 = __importDefault(require("./src/routes/content"));
const user_1 = __importDefault(require("./src/routes/user"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./db"); // Import the db connection
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("combined"));
app.use(express_1.default.json());
app.use(errorHandler_1.default);
// Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Session configuration
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());
// Routes
app.use("/api/docs", apiDoc_1.default);
app.use("/api/ad", ad_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/summary", summary_1.default);
app.use("/api/pdf", pdf_1.default);
app.use("/api/search", search_1.default);
app.use("/api/token", token_1.default);
app.use("/api/files", file_1.default);
app.use("/api/content", content_1.default);
app.use("/api/user", user_1.default);
// Server Initialization
const PORT = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map