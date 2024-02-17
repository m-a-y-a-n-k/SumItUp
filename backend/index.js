const express = require("express");

const errorHandler = require("./src/middleware/errorHandler");

const apiDocRouter = require("./src/documentation/apiDoc");
const adRouter = require("./src/routes/ad");
const authRouter = require("./src/routes/auth");
const summaryRouter = require("./src/routes/summary");
const pdfRouter = require("./src/routes/pdf");
const searchRouter = require("./src/routes/search");
const tokenRouter = require("./src/routes/token");

require("./db"); // Import the db connection

const app = express();

// Middleware
app.use(express.json());
app.use(errorHandler);

// Routes
app.use("/api/docs", apiDocRouter); // Mount the routers
app.use("/api/ad", adRouter);
app.use("/api/auth", authRouter);
app.use("/api/summary", summaryRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/search", searchRouter);
app.use("/api/token", tokenRouter);

// Server Initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
