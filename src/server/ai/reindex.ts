import prisma from "../../lib/db";
import { generateEmbedding } from "./embedding";
import { getPineconeIndex } from "../../lib/pinecone";
import { config } from "dotenv";

config();

async function main() {
  console.log("Starting product re-indexing with Pinecone...");

  const products = await prisma.product.findMany({
    select: { id: true, name: true, description: true },
  });

  console.log(`Found ${products.length} products to index.`);

  const index = getPineconeIndex();
  const batchSize = 50;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    console.log(`Processing batch ${i / batchSize + 1}...`);

    const vectors = await Promise.all(
      batch.map(async (product: any) => {
        const embeddingText = `${product.name} ${product.description || ""}`;
        const embedding = await generateEmbedding(embeddingText);
        return {
          id: product.id,
          values: embedding,
          metadata: { name: product.name, description: product.description || "" },
        };
      })
    );

    await index.upsert({ records: vectors.filter((v: any) => v.values.length > 0) });
  }

  console.log("Re-indexing complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
