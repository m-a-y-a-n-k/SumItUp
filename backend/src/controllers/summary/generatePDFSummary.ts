import { AuthenticatedRequest } from "@/types";
import { Response } from "express";

export async function generatePDFSummary(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { pdfData } = req.body;

    if (!pdfData || (!pdfData.pdfUrl && !pdfData.pdfText)) {
      res.status(400).json({ error: "PDF URL or text content is required" });
      return;
    }

    let textContent = "";

    if (pdfData.pdfText) {
      // If text is already provided
      textContent = pdfData.pdfText;
    } else {
      // For now, return a placeholder for PDF URL processing
      // TODO: Implement PDF text extraction with pdf-parse or PDF.js
      textContent = `PDF content from ${pdfData.pdfUrl} would be extracted and processed here.`;
    }

    // Use existing text summarization utility
    const textUtils = require("../../utils/text");
    const summary = textUtils.generateSummaryFromText(textContent);

    res.status(200).json({
      summary: summary || "Unable to generate summary from PDF content",
      message: pdfData.pdfUrl
        ? "PDF URL processing is currently in development. Please provide extracted text for now."
        : undefined,
    });
  } catch (error) {
    console.error("Error generating PDF summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
