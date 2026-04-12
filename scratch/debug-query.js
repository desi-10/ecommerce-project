const { PrismaClient } = require("../prisma/generated/client");
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Testing product query...");
        const productSelect = {
            id: true,
            name: true,
            description: true,
            image: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            brand: true,
            categories: {
                select: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            },
            vendor: {
                select: {
                    name: true,
                },
            },
            reviews: {
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    createdAt: true,
                },
            },
            images: {
                select: {
                    id: true,
                    url: true,
                    publicId: true,
                    alt: true,
                    position: true,
                },
                orderBy: { position: "asc" },
            },
            variants: {
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                    salePrice: true,
                    options: true,
                    inventory: { select: { id: true, stock: true } },
                },
                orderBy: { createdAt: "asc" },
            },
        };

        const result = await prisma.product.findMany({
            take: 1,
            select: productSelect,
        });
        console.log("Success:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Query failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
