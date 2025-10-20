import express from "express";
import pdfController from "../controllers/pdf";

const router = express.Router();

router.get("/generate", pdfController.generatePDF as any);

export default router;

