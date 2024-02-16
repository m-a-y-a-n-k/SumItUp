import express from "express";
import tokenController from "../controllers/tokenController.mjs"; // Import the controller with .mjs extension

const router = express.Router();

router.post("/earn", tokenController.earnTokens);
router.post("/spend", tokenController.spendTokens);

export default router;
