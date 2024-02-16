import { natural, stopWords } from "natural";

// Define custom stop words specific to your use case
const customStopWords = ["...", "etc.", "etc"];

// Initialize a tokenizer
const tokenizer = new natural.WordTokenizer();

// Initialize a TfIdf instance for term frequency-inverse document frequency
const tfidf = new natural.TfIdf();

// Add custom stop words to the default list
stopWords.push(...customStopWords);

const generateSummaryFromText = (text) => {
  // Tokenize the text
  const tokens = tokenizer.tokenize(text);

  // Calculate term frequency-inverse document frequency (TfIdf) scores
  tfidf.addDocument(tokens);

  // Sort tokens by TfIdf score in descending order
  const sortedTokens = tfidf.listTerms(0).sort((a, b) => b.tfidf - a.tfidf);

  // Extract top-ranked tokens (e.g., top 5) as key phrases for the summary
  const keyPhrases = sortedTokens.slice(0, 5).map((token) => token.term);

  // Concatenate key phrases to generate the summary
  const summary = keyPhrases.join(" ");

  return summary;
};

export default generateSummaryFromText;
