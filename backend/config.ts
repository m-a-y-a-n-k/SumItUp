import dotenv from "dotenv"; // Import dotenv for environment variables
dotenv.config(); // Load environment variables from .env file

interface Config {
  mongodbURI: string;
  jwtSecret: string;
}

const config: Config = {
  // MongoDB configuration
  mongodbURI: process.env.MONGODB_URI || "",

  // JWT secret key
  jwtSecret: process.env.JWT_SECRET || "",
};

export default config;
