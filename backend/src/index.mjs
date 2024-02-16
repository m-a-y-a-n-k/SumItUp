import express from "express";
import dotenv from "dotenv"; // Import dotenv for environment variables
import apiDocRouter from "./routes/apiDoc.mjs"; // Import routers with .mjs extension
import authRouter from "./routes/authRouter.mjs";
import contentRouter from "./routes/contentRouter.mjs";
import pdfRouter from "./routes/pdfRouter.mjs";
import searchRouter from "./routes/searchRouter.mjs";
import tokenRouter from "./routes/tokenRouter.mjs";
import db from "./dbConnection.mjs"; // Import the db connection

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api", apiDocRouter); // Mount the routers
app.use("/api/auth", authRouter);
app.use("/api/content", contentRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/search", searchRouter);
app.use("/api/token", tokenRouter);

// Server Initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
