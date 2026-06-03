import { Router } from "express";
import { aiLibrarian, explainParagraph, ocrImage, summarizeBook, translateText } from "../controllers/ai-controller.js";
import { requireClerkAuth } from "../middleware/clerk-auth.js";

const router = Router();

router.use(requireClerkAuth);
router.post("/librarian", aiLibrarian);
router.post("/summary", summarizeBook);
router.post("/summarize", summarizeBook);
router.post("/explain", explainParagraph);
router.post("/translate", translateText);
router.post("/ocr", ocrImage);

export default router;
