import { Router } from "express";
import {
  dashboard,
  getReadingHistory,
  getWishlist,
  readingProgress,
  removeWishlistBook,
  saveWishlistBook,
  trackReadingHistory
} from "../controllers/library-controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", requireAuth, dashboard);
router.get("/progress", requireAuth, readingProgress);
router.get("/wishlist", requireAuth, getWishlist);
router.post("/wishlist", requireAuth, saveWishlistBook);
router.delete("/wishlist/:id", requireAuth, removeWishlistBook);
router.get("/history", requireAuth, getReadingHistory);
router.post("/history", requireAuth, trackReadingHistory);

export default router;
