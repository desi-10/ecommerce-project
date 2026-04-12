import prisma from "../src/lib/db";

async function main() {
  const products = await prisma.product.findMany({
    include: {
      images: true,
    },
  });
  console.log("Products in DB:", JSON.stringify(products, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
