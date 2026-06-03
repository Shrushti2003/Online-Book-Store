import OpenAI from "openai";
import { env } from "../config/env.js";

let client;

function getOpenAiClient() {
  if (!env.openAiApiKey) return null;
  if (!client) client = new OpenAI({ apiKey: env.openAiApiKey });
  return client;
}

function aiUnavailableMessage() {
  return "Lumi AI is not configured on the backend. Add OPENAI_API_KEY or GEMINI_API_KEY to the backend environment and restart the API.";
}

function geminiText(data) {
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n").trim() ?? "";
}

function geminiModels() {
  return [env.geminiModel, "gemini-2.0-flash", "gemini-flash-latest"]
    .filter(Boolean)
    .map((model) => model.replace(/^models\//, ""))
    .filter((model, index, all) => all.indexOf(model) === index);
}

async function generateWithGemini(prompt, image) {
  if (!env.geminiApiKey) return null;
  const parts = [{ text: prompt }];
  if (image) {
    parts.push({
      inline_data: {
        mime_type: image.mimeType,
        data: image.imageBase64
      }
    });
  }

  let lastError = "";
  for (const model of geminiModels()) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.geminiApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts }] })
    });

    if (response.ok) {
      const data = await response.json();
      return geminiText(data) || "Lumi could not form a response yet.";
    }

    const detail = await response.text().catch(() => "");
    lastError = `Gemini ${model} failed with ${response.status}${detail ? `: ${detail.slice(0, 220)}` : ""}`;
    if (![404, 429, 503].includes(response.status)) break;
  }

  throw new Error(lastError || "Gemini request failed.");
}

export async function createReadingInsight({ task, text, mood }) {
  const openai = getOpenAiClient();
  if (!openai) {
    if (env.geminiApiKey) {
      const message = await generateWithGemini(`You are Lumi, a calm premium AI librarian. Task: ${task}. Mood: ${mood ?? "curious"}. Text: ${text ?? ""}`);
      return { message, provider: "gemini" };
    }

    return { message: aiUnavailableMessage(), provider: "none" };
  }

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You are Lumi, an intelligent, calm, emotionally aware AI librarian. Write concise, premium, human responses for readers. Avoid generic assistant phrasing."
      },
      {
        role: "user",
        content: `Task: ${task}\nMood: ${mood ?? "curious"}\nText: ${text ?? ""}`
      }
    ]
  });

  return { message: response.output_text, provider: "openai" };
}

export async function translateReadingText({ text, language = "Hindi" }) {
  const prompt = `Translate the following text into ${language}. Preserve paragraph breaks and names. Return only the translated text, with no introduction or explanation.\n\n${text ?? ""}`;
  if (!getOpenAiClient() && env.geminiApiKey) {
    const message = await generateWithGemini(prompt);
    return { message, text: message, provider: "gemini" };
  }
  return createReadingInsight({
    task: prompt,
    text
  });
}

export async function extractTextFromImage({ imageBase64, mimeType }) {
  if (!env.geminiApiKey) {
    return {
      message: aiUnavailableMessage(),
      text: ""
    };
  }

  try {
    const text = await generateWithGemini("Extract all readable text from this book/page image. Preserve paragraph breaks. Return only the extracted text.", { imageBase64, mimeType });
    if (!text || text === "Lumi could not form a response yet." || /no readable text/i.test(text)) return { message: "No readable text was found.", text: "" };
    return { message: text ? "Text extracted successfully." : "No readable text was found.", text };
  } catch {
    return { message: "OCR failed. Please try a clearer image.", text: "" };
  }
}
