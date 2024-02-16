import express from "express";
import adController from "../controllers/adController";

const router = express.Router();
router.get("/display", adController.displayAds);

export default router;
