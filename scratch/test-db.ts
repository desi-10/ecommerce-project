
import prisma from "../src/lib/db";

async function test() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true
      }
    });
    console.log("Success! Products found:", products.length);
    if (products.length > 0) {
      console.log("First product images:", products[0].images);
    }
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
