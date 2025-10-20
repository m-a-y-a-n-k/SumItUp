import express from "express";
import summaryController from "../controllers/summary";

const router = express.Router();

router.post("/generate/audio", summaryController.generateAudioSummary as any);
router.post("/generate/image", summaryController.generateImageSummary as any);
router.post("/generate/video", summaryController.generateVideoSummary as any);
router.post("/generate/gif", summaryController.generateGifSummary as any);
router.post("/generate/url", summaryController.generateUrlSummary as any);
router.post("/generate/book", summaryController.generateBookSummary as any);
router.post("/generate/pdf", summaryController.generatePDFSummary as any);

export default router;

