const User = require("../models/User");

const tokenController = {
  async earnTokens(req, res) {
    try {
      const { userId } = req.user; // Assuming req.user is populated by auth middleware
      const { adId } = req.body;

      // Validate adId (you could add more logic here, e.g., check if the ad was actually watched)
      if (!adId) {
        return res.status(400).send({ error: "Ad ID is required" });
      }

      // Find the user in the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      if (!user.adEligible) {
        return res
          .status(400)
          .send({ error: "User is not eligible for earning ads based token" });
      }

      // Update the user's token balance
      const tokensEarned = 50; // Example value, adjust as needed
      user.tokens += tokensEarned;
      await user.save();

      // Send back the updated token balance
      res
        .status(200)
        .send({ message: "Tokens earned successfully", tokens: user.tokens });
    } catch (error) {
      console.error("Error earning tokens:", error);
      res.status(500).send({ error: "An error occurred while earning tokens" });
    }
  },

  async spendTokens(req, res) {
    try {
      const { userId } = req.user; // Assuming req.user is populated by auth middleware
      const { tokens } = req.body;

      // Validate token amount
      if (!tokens || tokens <= 0) {
        return res
          .status(400)
          .send({ error: "A positive number of tokens is required" });
      }

      // Find the user in the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      if (!user.adEligible) {
        return res.status(400).send({
          error: "User has already spent tokens and opted out of ads",
        });
      }

      // Check if the user has enough tokens
      if (user.tokens < tokens) {
        return res.status(400).send({ error: "Insufficient tokens" });
      }

      // Deduct the tokens from the user's balance
      user.tokens -= tokens;
      user.adEligible = false;
      await user.save();

      // Send back the updated token balance
      res
        .status(200)
        .send({ message: "Tokens spent successfully", tokens: user.tokens });
    } catch (error) {
      console.error("Error spending tokens:", error);
      res
        .status(500)
        .send({ error: "An error occurred while spending tokens" });
    }
  },
};

module.exports = tokenController;
