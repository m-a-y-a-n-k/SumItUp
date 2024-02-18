const imageService = require("../../services/summary/image");

async function generateImageSummary(req, res) {
  try {
    const imageData = req.body.imageData; // Assuming image data is sent in the request body
    const summary = await imageService.generateSummaryFromImage(imageData);
    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = generateImageSummary;
