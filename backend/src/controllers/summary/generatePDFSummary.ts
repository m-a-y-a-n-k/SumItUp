import { AuthenticatedRequest } from "@/types";
import { Response } from "express";
import fs from "fs";
import path from "path";
const pdf = require("pdf-parse");
import textUtils from "../../utils/text";

const ROOT_DIR = path.resolve(__dirname, "../../../uploads");

export async function generatePDFSummary(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { pdfData } = req.body;

    if (!pdfData || !pdfData.pdfUrl) {
      res.status(400).json({ error: "PDF filename is required" });
      return;
    }

    const filename = pdfData.pdfUrl;
    const filepath = path.join(ROOT_DIR, filename);

    if (!fs.existsSync(filepath)) {
      res.status(404).json({ error: "PDF file not found" });
      return;
    }

    const dataBuffer = fs.readFileSync(filepath);

    // Parse PDF
    let textContent = "";
    try {
      const data = await pdf(dataBuffer);
      textContent = data.text;
      // console.log("PDF parsed text length:", textContent.length); 
    } catch (pdfError) {
      console.error("PDF parsing critical failure:", pdfError);
      res.status(500).json({ error: "Failed to parse PDF document structure." });
      return;
    }

    // Prepare text
    const cleanText = textContent.replace(/\s+/g, " ").trim();

    if (cleanText.length < 50) {
      // If authentic parsing yields little text, it is likely an image scan.
      // We must fail clearly so the user knows to provide a text-selectable PDF.
      res.status(400).json({
        error: "PDF contains insufficient text. Ensure it is not a scanned image.",
        details: `Extracted only ${cleanText.length} characters.`
      });
      return;
    }

    // Generate summary from REAL text
    const summary = textUtils.generateSummaryFromText(cleanText);

    res.status(200).json({
      summary: summary || "Summary generation yielded no result.",
    });
  } catch (error) {
    console.error("Error generating PDF summary:", error);
    res.status(500).json({ error: "Internal Server Error during PDF processing" });
  }
}
