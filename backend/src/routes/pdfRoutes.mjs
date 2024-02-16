// pdfRouter.mjs
import express from "express";
import pdfController from "../controllers/pdfController.mjs"; // Import the controller with .mjs extension

const router = express.Router();

router.get("/generate", pdfController.generatePDF);

export default router;
