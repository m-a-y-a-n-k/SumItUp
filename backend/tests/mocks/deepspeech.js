// Mock DeepSpeech module for testing
class MockDeepSpeechModel {
  constructor() {
    this.modelLoaded = true;
  }

  enableExternalScorer() {
    // Mock method
    return true;
  }

  stt(audioBuffer) {
    // Mock speech-to-text conversion
    if (!audioBuffer || audioBuffer.length === 0) {
      return "";
    }
    return "This is mock transcribed text from audio.";
  }
}

module.exports = {
  Model: MockDeepSpeechModel
};
