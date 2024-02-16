import express from "express";
import authController from "../controllers/authController.mjs"; // Import the controller with .mjs extension

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);

export default router;
