const PDFService = require("../../services/pdf/generate");

async function generatePDF(req, res) {
  try {
    const { summary } = req.body;
    if (!summary || summary.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Summary cannot be empty",
      });
    }
    const pdfPath = await PDFService.createPDFFile(summary);
    res.status(200).json({ success: true, pdfPath });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to generate PDF",
    });
  }
}

module.exports = generatePDF;
