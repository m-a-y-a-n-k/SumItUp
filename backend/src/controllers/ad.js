const User = require("../models/User");

const adController = {
  async checkAdEligibility(userId) {
    try {
      // Find the user by userId
      const user = await User.findById(userId);

      // Check if the user exists and is eligible for ads
      if (user && user.adEligible) {
        return true; // User is eligible for ads
      } else {
        return false; // User is not eligible for ads
      }
    } catch (error) {
      throw error; // Throw error if something goes wrong
    }
  },
};

module.exports = adController;
