const express = require("express");
const adController = require("../controllers/ad");

const router = express.Router();

// Route to check ad eligibility for a user
router.get("/check-eligibility/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const eligible = await adController.checkAdEligibility(userId);
    res.json({ eligible });
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

module.exports = router;

module.exports = router;
