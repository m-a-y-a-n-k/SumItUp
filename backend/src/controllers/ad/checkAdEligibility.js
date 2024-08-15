const User = require("../../models/User");

async function checkAdEligibility(req, res) {
  try {
    const { userId } = req.user; // Extract userId from authenticated user

    // Find the user by userId
    const user = await User.findById(userId);

    // Check eligibility and respond
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const eligible = user.adEligible;
    res.status(200).json({ eligible });
  } catch (error) {
    console.error("Error checking ad eligibility:", error);
    res.status(500).json({ error: "Failed to check ad eligibility" });
  }
}

module.exports = checkAdEligibility;
