const NodeCache = require("node-cache");

// Initialize the cache with a TTL of 15 minutes (900 seconds)
const cache = new NodeCache({ stdTTL: 60 * 15 });

module.exports = cache;
