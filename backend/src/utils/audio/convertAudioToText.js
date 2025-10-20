const convertMP3toWAV = require("./convertMP3toWAV");
const fs = require("fs");
const path = require("path");
const ROOT_DIR = "src/utils/audio/audios/";

const wavOutputPath = "src/utils/audio/audios/output.wav";

// Try to load DeepSpeech, but gracefully handle if it's not available
let DeepSpeech;
let deepSpeechAvailable = false;

try {
  DeepSpeech = require("deepspeech");
  deepSpeechAvailable = true;
} catch (error) {
  console.warn("DeepSpeech module not available. Audio transcription will return mock data.");
  console.warn("To fix this, you may need to reinstall deepspeech or use an alternative.");
}

async function convertAudioToText(audioFileName, audioFormat) {
  // If DeepSpeech is not available, return a mock response
  if (!deepSpeechAvailable) {
    console.log("DeepSpeech not available - returning mock transcription");
    return "This is a mock transcription. DeepSpeech module is not properly installed.";
  }

  let audioData = Buffer.from("");

  // Load the DeepSpeech model without specifying model and scorer paths
  const model = new DeepSpeech.Model();

  // Load the language model scorer without specifying scorer path
  model.enableExternalScorer();

  const audioFilePath = path.resolve(ROOT_DIR, audioFileName);

  if (audioFormat === "mp3") {
    await convertMP3toWAV(audioFilePath, wavOutputPath);
    audioData = fs.readFileSync(wavOutputPath);
  } else {
    audioData = fs.readFileSync(audioFilePath);
  }

  // Perform inference
  const inferenceResult = model.stt(audioData);

  return inferenceResult;
}

module.exports = convertAudioToText;
