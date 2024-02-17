const express = require("express");
const summaryController = require("../controllers/summary");

const router = express.Router();

router.get("/generate/audio", summaryController.generateAudioSummary);
router.get("/generate/image", summaryController.generateImageSummary);
router.get("/generate/video", summaryController.generateVideoSummary);
router.get("/generate/gif", summaryController.generateGifSummary);
router.get("/generate/url", summaryController.generateUrlSummary);
router.get("/generate/book", summaryController.generateBookSummary);

module.exports = router;
