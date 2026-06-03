import { Router } from "express";
import aiRoutes from "./ai-routes.js";
import bookRoutes from "./book-routes.js";
import libraryRoutes from "./library-routes.js";

const router = Router();

router.use("/books", bookRoutes);
router.use("/ai", aiRoutes);
router.use("/library", libraryRoutes);

export default router;
