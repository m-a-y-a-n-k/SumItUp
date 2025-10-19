import { generateImageSummary } from "./generateImageSummary";
import { generateAudioSummary } from "./generateAudioSummary";
import { generateVideoSummary } from "./generateVideoSummary";
import { generateGifSummary } from "./generateGifSummary";
import { generateUrlSummary } from "./generateUrlSummary";
import { generateBookSummary } from "./generateBookSummary";
import { generatePDFSummary } from "./generatePDFSummary";

const summaryController = {
  generateAudioSummary,
  generateImageSummary,
  generateVideoSummary,
  generateGifSummary,
  generateUrlSummary,
  generateBookSummary,
  generatePDFSummary,
}

export default summaryController;
