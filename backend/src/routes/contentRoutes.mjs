import express from "express";
import contentController from "../controllers/contentController.mjs"; // Import the controller with .mjs extension

const router = express.Router();

router.post("/audio", contentController.uploadAudio);
router.post("/image", contentController.uploadImage);
router.post("/video", contentController.uploadVideo);
router.post("/gif", contentController.uploadGif);

export default router;
