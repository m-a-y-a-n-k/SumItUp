const PDFDocument = require("pdfkit");
const fs = require("fs");

class PDFService {
  // Generate a PDF document from a summary
  static async createPDFFile(summary) {
    return new Promise((resolve, reject) => {
      try {
        if (!summary || summary.trim() === "") {
          return reject(new Error("Summary is empty"));
        }
        const pdfDoc = new PDFDocument();
        const pdfPath = `./pdfs/summary_${Date.now()}.pdf`; // Path to save the generated PDF

        // Add content to the PDF
        pdfDoc.pipe(fs.createWriteStream(pdfPath));
        pdfDoc.fontSize(12);
        pdfDoc.text(summary);

        // Finalize the PDF
        pdfDoc.end();

        resolve(pdfPath);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = PDFService;
