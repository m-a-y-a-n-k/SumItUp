const express = require("express");
const searchController = require("../controllers/search");

const router = express.Router();

router.get("/books", searchController.fuzzySearch);

module.exports = router;
