import "dotenv/config";
import prisma from "./src/lib/db";
import { generateEmbedding } from "./src/server/ai/embedding";
import { getPineconeIndex } from "./src/lib/pinecone";

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, description: true },
  });

  console.log(`Found ${products.length} products to backfill into Pinecone...`);
  const index = getPineconeIndex();

  for (const p of products) {
    console.log(`Embedding ${p.name}...`);
    const embedding = await generateEmbedding(`${p.name} ${p.description || ""}`);
    if (embedding && embedding.length > 0) {
      await index.upsert({
        records: [
          {
            id: p.id,
            values: embedding,
            metadata: { name: p.name, description: p.description || "" },
          },
        ]
      });
    }
  }
  console.log("Backfill complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
