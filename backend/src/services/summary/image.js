const imageProcessingUtil = require("../../utils/image");
const textUtil = require("../../utils/text");

async function generateSummaryFromImage(imageData) {
  try {
    // Process the image data and generate a summary
    const imageDescription = await imageProcessingUtil.convertImageToText(
      imageData
    );
    const summary = textUtil.generateSummaryFromText(imageDescription);
    return summary;
  } catch (error) {
    throw new Error("Failed to generate summary from image");
  }
}

module.exports = {
  generateSummaryFromImage,
};
