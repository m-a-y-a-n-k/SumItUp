const cacheModule = require("../../cache");
const cache = cacheModule.default || cacheModule; // Import the central cache
const UserModule = require("../../models/User");
const User = UserModule.default || UserModule;

async function checkAdEligibility(req, res) {
  try {
    const { id } = req.user; // Extract id from authenticated user

    // Check the cache first
    let cachedData = cache.get(`adEligibility:${id}`);
    if (!cachedData) {
      // If not cached, fetch from the database
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Cache the eligibility status
      cachedData = user.adEligible;
      cache.set(`adEligibility:${id}`, cachedData);
    }

    // Respond with the cached or retrieved eligibility status
    res.status(200).json({ eligible: cachedData });
  } catch (error) {
    console.error("Error checking ad eligibility:", error);
    res.status(500).json({ error: "Failed to check ad eligibility" });
  }
}

module.exports = checkAdEligibility;
