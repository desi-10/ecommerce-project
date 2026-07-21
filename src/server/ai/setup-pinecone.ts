import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "dotenv";

config();

async function setup() {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is missing");
  }

  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const indexName = process.env.PINECONE_INDEX || "products";

  console.log(`Creating index: ${indexName}...`);

  try {
    await pc.createIndex({
      name: indexName,
      dimension: 768, // Correct for Gemini embedding-001
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
    console.log("Index created successfully!");
  } catch (error: unknown) {
    const err = error as { name?: string; message?: string };
    if (err.name === "PineconeBadRequestError" && err.message?.includes("already exists")) {
      console.log("Index already exists.");
    } else {
      throw error;
    }
  }
}

setup().catch(console.error);
