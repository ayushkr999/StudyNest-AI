import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Retry with backoff when quota is exceeded
const callWithRetry = async (fn, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const is429 = err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("RESOURCE_EXHAUSTED");

      if (is429 && attempt < maxRetries) {
        // Parse retry delay from error response, default to 30s
        const retryMatch = err?.message?.match(/"retryDelay":"(\d+)s"/);
        const waitSeconds = retryMatch ? parseInt(retryMatch[1]) : 15 * attempt;
        console.warn(`⚠️ Quota exceeded. Retrying in ${waitSeconds}s (attempt ${attempt}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
        continue;
      }

      throw err;
    }
  }
};

function buildPrompt(action, content) {
  switch (action) {
    case "summarize":
      return `Summarize the following notes in a clear, concise way:\n\n${content}`;
    case "flashcards":
      return `Generate Q&A flashcards from the following notes. Format them as:
Q: ...
A: ...
Q: ...
A: ...\n\n${content}`;
    case "questions":
      return `Generate 5 exam-style questions with answers from the following notes:\n\n${content}`;
    default:
      throw new Error("Invalid AI action");
  }
}

const GeminiUtil = {
  generateAIResult: async (action, content) => {
    if (!content || content.trim() === "") {
      throw new Error("Note content is empty");
    }

    const prompt = buildPrompt(action, content);

    try {
      const response = await callWithRetry(() =>
        ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        })
      );
      return response.text.trim();
    } catch (err) {
      console.error("❌ GeminiUtil Error:", err?.message || err);
      if (err?.status === 429 || err?.message?.includes("RESOURCE_EXHAUSTED")) {
        throw new Error("AI quota exceeded. Please wait a minute and try again.");
      }
      throw new Error("Failed to generate AI response");
    }
  },
};

export default GeminiUtil;
