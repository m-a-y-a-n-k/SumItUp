const { Image } = require("image-recognition");

async function convertImageToText(imageData) {
  try {
    // Load the image
    const image = await Image.load(imageData);

    // Detect objects in the image
    const objects = await image.detectObjects();

    // Generate description based on detected objects
    let description = "";

    if (objects.length > 0) {
      // Construct a description based on detected objects
      description = objects
        .map(
          (obj) =>
            `Image contains ${obj.className} with confidence ${Math.round(
              obj.probability * 100
            )}%`
        )
        .join(", ");
    } else {
      // If no objects are detected, return a generic description
      description = "Could not infer any description from image";
    }

    return description;
  } catch (error) {
    throw new Error("Failed to process image");
  }
}

module.exports = convertImageToText;
