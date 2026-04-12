const { PrismaClient } = require("../prisma/generated/client");
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Cleaning up database...");
        
        // Delete categories with 'test' in slug
        const cats = await prisma.category.deleteMany({
            where: {
                OR: [
                    { slug: { contains: "test", mode: "insensitive" } },
                    { name: { contains: "test", mode: "insensitive" } }
                ]
            }
        });
        console.log(`Deleted ${cats.count} categories.`);

        // Delete products with 'Testing' or 'test' in name
        const prods = await prisma.product.deleteMany({
            where: {
                OR: [
                    { name: { contains: "Testing", mode: "insensitive" } },
                    { name: { contains: "test", mode: "insensitive" } }
                ]
            }
        });
        console.log(`Deleted ${prods.count} products.`);

        console.log("Cleanup complete.");
    } catch (e) {
        console.error("Cleanup failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
