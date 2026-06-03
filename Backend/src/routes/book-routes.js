import { Router } from "express";
import { getBookById, getBookReadingPayload, getGenreBooks, getTrendingBooks, searchBooks } from "../controllers/book-controller.js";

const router = Router();

router.get("/search", searchBooks);
router.get("/trending", getTrendingBooks);
router.get("/genres/:genre", getGenreBooks);
router.get("/:id/read", getBookReadingPayload);
router.get("/:id", getBookById);

export default router;
