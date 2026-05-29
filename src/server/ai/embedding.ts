import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing for embeddings");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const result = await model.embedContent(text);
    return result.embedding.values.slice(0, 768);
  } catch (error) {
    console.error("Embedding generation failed:", error);
    return [];
  }
}
