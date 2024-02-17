const express = require("express");
const tokenController = require("../controllers/token");

const router = express.Router();

router.post("/earn", tokenController.earnTokens);
router.post("/spend", tokenController.spendTokens);

module.exports = router;
