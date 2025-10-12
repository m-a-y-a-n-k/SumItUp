"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
// Connect to MongoDB
mongoose_1.default.connect(config_1.default.mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// Get the default connection
const db = mongoose_1.default.connection;
// Event handlers for MongoDB connection
db.on("connected", () => {
    console.log("Connected to MongoDB");
});
db.on("error", (err) => {
    console.error(`MongoDB connection error: ${err}`);
});
db.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
});
// Gracefully close MongoDB connection on app termination
process.on("SIGINT", () => {
    db.close(() => {
        console.log("MongoDB connection closed");
        process.exit(0);
    });
});
exports.default = db;
//# sourceMappingURL=db.js.map