const { Image } = require("image-js");
const ImageClassifier = require("image-classifier");

async function convertImageToText(imageData) {
  try {
    // Load the image
    const image = await Image.load(imageData);

    // Initialize the image classifier
    const classifier = new ImageClassifier();

    // Load the model
    await classifier.load();

    // Classify the image
    const predictions = await classifier.predict(image);

    // Generate a summary based on predictions
    const summary = predictions
      .map((prediction) => prediction.className)
      .join(", ");

    return summary;
  } catch (error) {
    throw new Error("Failed to process image");
  }
}

module.exports = convertImageToText;
