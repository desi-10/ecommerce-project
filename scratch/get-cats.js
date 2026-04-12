const { PrismaClient } = require("./prisma/generated/client");
const prisma = new PrismaClient();

async function main() {
    try {
        const c = await prisma.category.findMany();
        console.log(JSON.stringify(c, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
