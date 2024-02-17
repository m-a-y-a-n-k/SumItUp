const express = require("express");
const pdfController = require("../controllers/pdf");

const router = express.Router();

router.get("/generate", pdfController.generatePDF);

module.exports = router;
