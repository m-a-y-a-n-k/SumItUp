const dotenv = require("dotenv"); // Import dotenv for environment variables
dotenv.config(); // Load environment variables from .env file

module.exports = {
  // MongoDB configuration
  mongodbURI: process.env.MONGODB_URI,

  // JWT secret key
  jwtSecret: process.env.JWT_SECRET,
};
