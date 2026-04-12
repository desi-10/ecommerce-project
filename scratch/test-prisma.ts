import 'dotenv/config';
import prisma from "../src/lib/db";

async function main() {
  try {
    const products = await prisma.product.findMany({
      where: {
        categories: {
          some: {
            category: {
              slug: { in: ['groceries'] }
            }
          }
        },
        variants: {
            some: {
                AND: [
                    { price: { gte: 0 } },
                    { price: { lte: 2000 } }
                ]
            }
        }
      }
    });
    console.log("Success:", products.length);
  } catch (err: any) {
    console.error("PRISMA ERROR:", err.message);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
