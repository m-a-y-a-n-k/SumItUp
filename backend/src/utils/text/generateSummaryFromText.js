const natural = require("natural");
const stopwords = require("stopwords").english;

const tokenizer = new natural.WordTokenizer();
const sentenceTokenizer = new natural.SentenceTokenizer();

// Helper to calculate similarity between two sentences
function sentenceSimilarity(sent1, sent2) {
  const tokens1 = tokenizer.tokenize(sent1).map(t => t.toLowerCase());
  const tokens2 = tokenizer.tokenize(sent2).map(t => t.toLowerCase());

  const allTokens = new Set([...tokens1, ...tokens2]);
  const tokenList = Array.from(allTokens).filter(t => !stopwords.includes(t));

  if (tokenList.length === 0) return 0;

  const vec1 = tokenList.map(t => tokens1.includes(t) ? 1 : 0);
  const vec2 = tokenList.map(t => tokens2.includes(t) ? 1 : 0);

  // Cosine similarity
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < tokenList.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  if (mag1 === 0 || mag2 === 0) return 0;
  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

const generateSummaryFromText = (text) => {
  if (!text) return "";

  // 1. Split into sentences
  const sentences = sentenceTokenizer.tokenize(text);
  if (sentences.length <= 3) return text; // Too short to summarize

  // 2. Build similarity matrix
  const scores = new Array(sentences.length).fill(0);

  for (let i = 0; i < sentences.length; i++) {
    for (let j = 0; j < sentences.length; j++) {
      if (i === j) continue;
      const sim = sentenceSimilarity(sentences[i], sentences[j]);
      scores[i] += sim;
    }

    // Boost scores for key sentences
    const sentLower = sentences[i].toLowerCase();
    if (sentLower.includes("in conclusion") || sentLower.includes("summar")) scores[i] *= 1.2;
    if (sentLower.includes("important") || sentLower.includes("significant")) scores[i] *= 1.1;
  }

  // 3. Sort sentences by score
  const indexedScores = scores.map((score, index) => ({ score, index }));
  indexedScores.sort((a, b) => b.score - a.score);

  // 4. Pick top N sentences (e.g., top 30% or max 5 sentences)
  const count = Math.max(3, Math.min(5, Math.floor(sentences.length * 0.3)));
  const topIndices = indexedScores.slice(0, count).map(item => item.index);

  // 5. Reorder by original position
  topIndices.sort((a, b) => a - b);

  return topIndices.map(i => sentences[i]).join(" ");
};

module.exports = generateSummaryFromText;
