import { asyncHandler } from "../utils/async-handler.js";
import { createReadingInsight, extractTextFromImage, translateReadingText } from "../services/ai-service.js";

export const aiLibrarian = asyncHandler(async (req, res) => {
  const result = await createReadingInsight({
    task: req.body.task ?? "recommend",
    text: req.body.text,
    mood: req.body.mood
  });
  res.json(result);
});

export const summarizeBook = asyncHandler(async (req, res) => {
  const result = await createReadingInsight({ task: "summarize this book in a premium reading-app voice", text: req.body.text });
  res.json(result);
});

export const explainParagraph = asyncHandler(async (req, res) => {
  const result = await createReadingInsight({ task: "explain this paragraph clearly without breaking reading immersion", text: req.body.text });
  res.json(result);
});

export const translateText = asyncHandler(async (req, res) => {
  const result = await translateReadingText({ text: req.body.text, language: req.body.language });
  res.json(result);
});

export const ocrImage = asyncHandler(async (req, res) => {
  const result = await extractTextFromImage({
    imageBase64: req.body.imageBase64,
    mimeType: req.body.mimeType ?? "image/png"
  });
  res.json(result);
});
