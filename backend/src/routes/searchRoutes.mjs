import express from "express";
import searchController from "../controllers/searchController.mjs"; // Import the controller with .mjs extension

const router = express.Router();

router.get("/books", searchController.fuzzySearch);

export default router;
