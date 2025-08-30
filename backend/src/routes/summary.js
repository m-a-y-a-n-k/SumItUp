const express = require("express");
const summaryController = require("../controllers/summary");

const router = express.Router();

router.post("/generate/audio", summaryController.generateAudioSummary);
router.post("/generate/image", summaryController.generateImageSummary);
router.post("/generate/video", summaryController.generateVideoSummary);
router.post("/generate/gif", summaryController.generateGifSummary);
router.post("/generate/url", summaryController.generateUrlSummary);
router.post("/generate/book", summaryController.generateBookSummary);
router.post("/generate/pdf", summaryController.generatePDFSummary);

module.exports = router;
