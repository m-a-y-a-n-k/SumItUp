const express = require("express");
// const session = require("express-session");
// const passport = require("./src/middleware/passport");

// Extensions
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./src/middleware/errorHandler");

// Routers
const apiDocRouter = require("./src/documentation/apiDoc");
const adRouter = require("./src/routes/ad");
const authRouter = require("./src/routes/auth");
const summaryRouter = require("./src/routes/summary");
const pdfRouter = require("./src/routes/pdf");
const searchRouter = require("./src/routes/search");
const tokenRouter = require("./src/routes/token");

require("dotenv").config();
require("./db"); // Import the db connection

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(errorHandler);

// Rate Limiting
const limiter = rateLimit({
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
app.use("/api/docs", apiDocRouter);
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
