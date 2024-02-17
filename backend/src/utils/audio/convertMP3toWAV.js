const fs = require("fs");
const { spawn } = require("child_process");

function convertMP3toWAV(mp3FilePath, wavFilePath) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      mp3FilePath,
      "-acodec",
      "pcm_s16le",
      "-ar",
      "44100",
      wavFilePath,
    ]);

    ffmpeg.on("error", (err) => {
      reject(err);
    });

    ffmpeg.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });
  });
}

module.exports = convertMP3toWAV;
