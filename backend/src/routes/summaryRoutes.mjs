import express from "express";
import summaryController from "../controllers/summaryController.mjs"; // Import the controller with .mjs extension

const router = express.Router();

router.get("/summary/audio", summaryController.generateAudioSummary);
router.get("/summary/image", summaryController.generateImageSummary);
router.get("/summary/video", summaryController.generateVideoSummary);
router.get("/summary/gif", summaryController.generateGifSummary);
router.get("/summary/url", summaryController.generateUrlSummary);

export default router;
