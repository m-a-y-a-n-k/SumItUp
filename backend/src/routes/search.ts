import express from "express";
import searchController from "../controllers/search";

const router = express.Router();

// Fuzzy search endpoint
router.get("/fuzzy", searchController.fuzzySearch as any);

// Book search endpoint  
router.get("/books", searchController.searchBooks as any);

export default router;

