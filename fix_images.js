const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const result1 = await prisma.$executeRawUPDATE "product" SET image = '/martfury/product.png' WHERE image LIKE '%unsplash.com%';;
  const result2 = await prisma.$executeRawUPDATE "ProductImage" SET url = '/martfury/product.png' WHERE url LIKE '%unsplash.com%';;
  console.log('Fixed product images:', result1, 'Fixed variants:', result2);
}
main().catch(console.error).finally(() => prisma.$disconnect());
