const express = require("express");
const searchController = require("../controllers/search");

const router = express.Router();

// Fuzzy search endpoint
router.get("/fuzzy", searchController.fuzzySearch);

// Book search endpoint  
router.get("/books", searchController.searchBooks);

module.exports = router;
