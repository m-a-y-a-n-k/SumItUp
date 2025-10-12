import mongoose from "mongoose";
import config from "./config";

// Connect to MongoDB
mongoose.connect(config.mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions);

// Get the default connection
const db = mongoose.connection;

// Event handlers for MongoDB connection
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err: Error) => {
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

export default db;
