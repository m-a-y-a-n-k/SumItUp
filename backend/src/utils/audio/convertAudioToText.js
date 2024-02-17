const DeepSpeech = require("deepspeech");
const convertMP3toWAV = require("./convertMP3toWAV");
const fs = require("fs");

const wavOutputPath = "src/utils/audio/audios/output.wav";

async function convertAudioToText(audioFilePath, audioFormat) {
  let audioData = Buffer.from("");

  // Load the DeepSpeech model without specifying model and scorer paths
  const model = new DeepSpeech.Model();

  // Load the language model scorer without specifying scorer path
  model.enableExternalScorer();

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
