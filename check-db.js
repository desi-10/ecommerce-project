const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true } });
  console.log('Products in DB:', products.length, products);
}

main().catch(console.error).finally(() => prisma.$disconnect());
