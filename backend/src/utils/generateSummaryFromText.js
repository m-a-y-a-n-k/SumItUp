const natural = require("natural");
const stopwords = require("stopwords").english;

// Define custom stop words specific to your use case
const customStopWords = ["...", "etc.", "etc"];

// Initialize a tokenizer
const tokenizer = new natural.WordTokenizer();

// Add custom stop words to the default list
const allStopWords = new Set([...stopwords, ...customStopWords]);

const generateSummaryFromText = (text) => {
  // Tokenize the text
  const tokens = tokenizer.tokenize(text);

  // Remove stop words
  const filteredTokens = tokens.filter(
    (token) => !allStopWords.has(token.toLowerCase())
  );

  // Calculate term frequency-inverse document frequency (TfIdf) scores
  const tfidf = {};

  filteredTokens.forEach((token) => {
    tfidf[token] = (tfidf[token] || 0) + 1;
  });

  // Sort tokens by TfIdf score in descending order
  const sortedTokens = Object.entries(tfidf)
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => term);

  // Extract top-ranked tokens (e.g., top 5) as key phrases for the summary
  const keyPhrases = sortedTokens.slice(0, 5);

  // Concatenate key phrases to generate the summary
  const summary = keyPhrases.join(" ");

  return summary;
};

module.exports = generateSummaryFromText;
