import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  ProductStatus,
  CategoryStatus,
  DiscountType,
} from "./generated/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env file");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Gadgets, devices, and computing",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, shoes, and accessories",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Home & Garden",
    slug: "home-and-garden",
    description: "Furniture, decor, and tools",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Beauty",
    slug: "beauty",
    description: "Skincare, makeup, and personal care",
    image: "https://images.unsplash.com/photo-1596462502278-27bfaf41039a?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Groceries",
    slug: "groceries",
    description: "Food, drinks, and household essentials",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
  },
];

const PRODUCTS = [
  // Electronics
  {
    category: "electronics",
    name: "MacBook Pro M3",
    description:
      "The latest MacBook Pro with the powerful M3 chip, stunning Retina display, and all-day battery life.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1024",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=1024",
      "https://images.unsplash.com/photo-1517336712461-481ec0a24a73?auto=format&fit=crop&q=80&w=1024",
    ],
    variants: [
      { name: "14-inch Space Gray (512GB)", price: 19999.0, stock: 15 },
      { name: "14-inch Silver (1TB)", price: 22999.0, stock: 10 },
      { name: "16-inch Space Gray (1TB)", price: 25999.0, stock: 8 },
    ],
  },
  {
    category: "electronics",
    name: "iPhone 15 Pro",
    description:
      "Titanium design, A17 Pro chip, customizable Action button, and a more versatile Pro camera system.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1024",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1024",
      "https://images.unsplash.com/photo-1695048065476-673966085a67?auto=format&fit=crop&q=80&w=1024",
    ],
    variants: [
      { name: "Natural Titanium 128GB", price: 12999.0, stock: 25 },
      { name: "Blue Titanium 256GB", price: 14499.0, stock: 20 },
    ],
  },
  {
    category: "electronics",
    name: "Sony WH-1000XM5",
    description:
      "Industry-leading noise cancelling, exceptional sound quality, and crystal-clear hands-free calling.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Black", price: 3499.0, stock: 50 },
      { name: "Silver", price: 3499.0, stock: 45 },
    ],
  },
  {
    category: "electronics",
    name: "Samsung Galaxy Watch 6",
    description:
      "Track your fitness, monitor your health, and stay connected with the most advanced Galaxy Watch yet.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Graphite 44mm", price: 2999.0, stock: 30 },
      { name: "Silver 40mm", price: 2799.0, stock: 35 },
    ],
  },
  {
    category: "electronics",
    name: "Fujifilm X100V",
    description:
      "The ultimate premium compact camera, combining classic design with modern digital technology.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Black Edition", price: 15999.0, stock: 5 },
      { name: "Silver Edition", price: 15999.0, stock: 3 },
    ],
  },
  {
    category: "electronics",
    name: "iPad Air 6",
    description:
      "Powerful, versatile, and in five gorgeous colors. iPad Air is more capable than ever.",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Wi-Fi 64GB Blue", price: 5999.0, stock: 20 },
      { name: "Wi-Fi + Cellular 256GB Gray", price: 7999.0, stock: 12 },
    ],
  },
  {
    category: "electronics",
    name: "Dell XPS 13 Plus",
    description:
      "Twice as powerful as before. The most powerful 13-inch XPS laptop is designed for your lifestyle.",
    image:
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Platinum, i7, 16GB RAM", price: 16999.0, stock: 10 },
      { name: "Graphite, i5, 8GB RAM", price: 13999.0, stock: 15 },
    ],
  },
  {
    category: "electronics",
    name: "Kindle Paperwhite",
    description:
      "With a 6.8\u201D display and thinner borders, adjustable warm light, up to 10 weeks of battery life.",
    image:
      "https://images.unsplash.com/photo-1594980596247-87b52a7306cf?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Black 16GB", price: 1499.0, stock: 100 },
      { name: "Agave Green 16GB", price: 1499.0, stock: 80 },
    ],
  },

  // Fashion
  {
    category: "fashion",
    name: "Classic Denim Jacket",
    description:
      "A timeless staple for any wardrobe. Made from premium organic cotton denim that gets better with age.",
    image:
      "https://images.unsplash.com/photo-1551028712-03b6c8aa5d9a?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Light Wash S", price: 899.0, stock: 30 },
      { name: "Light Wash M", price: 899.0, stock: 45 },
      { name: "Light Wash L", price: 899.0, stock: 25 },
    ],
  },
  {
    category: "fashion",
    name: "White Leather Sneakers",
    description:
      "Minimalist sneakers crafted from supple Nappa leather with a comfortable rubber sole.",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Size 42", price: 1200.0, stock: 20 },
      { name: "Size 43", price: 1200.0, stock: 15 },
      { name: "Size 44", price: 1200.0, stock: 10 },
    ],
  },
  {
    category: "fashion",
    name: "Cotton Oxford Shirt",
    description:
      "A classic button-down shirt made from breathable cotton oxford fabric. Perfect for both casual and formal wear.",
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c717658?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "White - Slim Fit", price: 450.0, stock: 60 },
      { name: "Blue - Regular Fit", price: 450.0, stock: 50 },
    ],
  },
  {
    category: "fashion",
    name: "Leather Chelsea Boots",
    description:
      "Elegant and durable Chelsea boots made from high-quality Italian leather with an elasticated side panel.",
    image:
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Cognac Brown", price: 1800.0, stock: 12 },
      { name: "Midnight Black", price: 1800.0, stock: 18 },
    ],
  },
  {
    category: "fashion",
    name: "Wool Blend Overcoat",
    description:
      "Stay warm in style with this sophisticated wool blend coat. Features a tailored fit and notch lapels.",
    image:
      "https://images.unsplash.com/photo-1539533377285-b827ac502447?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Camel S", price: 2500.0, stock: 5 },
      { name: "Camel M", price: 2500.0, stock: 8 },
      { name: "Charcoal L", price: 2500.0, stock: 4 },
    ],
  },
  {
    category: "fashion",
    name: "Summer Linen Trousers",
    description:
      "Lightweight and breathable linen trousers, ideal for hot summer days and beach weddings.",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Beige 32/32", price: 650.0, stock: 25 },
      { name: "Navy 34/32", price: 650.0, stock: 20 },
    ],
  },
  {
    category: "fashion",
    name: "Gold Pendant Necklace",
    description:
      "A delicate 18k gold-plated necklace with a simple circular pendant. Perfect for layering.",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1024",
    variants: [{ name: "18-inch Gold", price: 350.0, stock: 40 }],
  },
  {
    category: "fashion",
    name: "Polarized Wayfarer Sunglasses",
    description:
      "Classic styling meets modern eye protection. High-quality polarized lenses reduce glare.",
    image:
      "https://images.unsplash.com/photo-1511499767390-90342f16b197?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Matte Black", price: 799.0, stock: 30 },
      { name: "Tortoise Shell", price: 799.0, stock: 25 },
    ],
  },

  // Home & Garden
  {
    category: "home-and-garden",
    name: "Minimalist Table Lamp",
    description:
      "A clean and modern table lamp that adds a touch of elegance to any bedside table or desk.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "White Sand", price: 320.0, stock: 40 },
      { name: "Charcoal Grey", price: 320.0, stock: 35 },
    ],
  },
  {
    category: "home-and-garden",
    name: "Nespresso Vertuo Pop",
    description:
      "The most compact Vertuo machine, bringing barista-quality coffee to your home at the touch of a button.",
    image:
      "https://images.unsplash.com/photo-1520970014086-2208ec0f54d7?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Liquorice Black", price: 1499.0, stock: 15 },
      { name: "Pacific Blue", price: 1499.0, stock: 10 },
      { name: "Aqua Mint", price: 1499.0, stock: 12 },
    ],
  },
  {
    category: "home-and-garden",
    name: "Indoor Monstera Plant",
    description:
      "Add a touch of the tropics to your home with this easy-to-care-for and beautiful Monstera Deliciosa.",
    image:
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Medium with Ceramic Pot", price: 280.0, stock: 20 },
      { name: "Large with Ceramic Pot", price: 450.0, stock: 15 },
    ],
  },
  {
    category: "home-and-garden",
    name: "Velvet Accent Chair",
    description:
      "A luxurious and comfortable accent chair upholstered in soft velvet with elegant gold-tone legs.",
    image:
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Navy Blue", price: 2999.0, stock: 6 },
      { name: "Emerald Green", price: 2999.0, stock: 4 },
    ],
  },
  {
    category: "home-and-garden",
    name: "Cotton Percale Bedding Set",
    description:
      "Crisp and cool cotton percale bedding for the ultimate hotel-like sleep experience at home.",
    image:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Queen - White", price: 850.0, stock: 30 },
      { name: "King - Soft Blue", price: 950.0, stock: 20 },
    ],
  },
  {
    category: "home-and-garden",
    name: "Cast Iron Dutch Oven",
    description:
      "The essential kitchen tool for slow cooking, braising, and baking. Exceptional heat retention.",
    image:
      "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Matte Red 5L", price: 1200.0, stock: 15 },
      { name: "Midnight Black 5L", price: 1200.0, stock: 20 },
    ],
  },
  {
    category: "home-and-garden",
    name: "Aromatic Soy Candle Set",
    description:
      "Hand-poured soy wax candles with essential oils. Set includes Lavender, Eucalyptus, and Rose.",
    image:
      "https://images.unsplash.com/photo-1603006905393-d14be0174e9a?auto=format&fit=crop&q=80&w=1024",
    variants: [{ name: "Set of 3", price: 240.0, stock: 50 }],
  },
  {
    category: "home-and-garden",
    name: "Bamboo Bath Mat",
    description:
      "Natural and sustainable bamboo bath mat. Water-resistant and adds a spa-like feel to your bathroom.",
    image:
      "https://images.unsplash.com/photo-1620626011761-9963d7521476?auto=format&fit=crop&q=80&w=1024",
    variants: [{ name: "Natural Wood", price: 180.0, stock: 40 }],
  },

  // Beauty
  {
    category: "beauty",
    name: "Hyaluronic Acid Serum",
    description:
      "Deeply hydrates and plumps the skin. Suitable for all skin types, including sensitive skin.",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "30ml Bottle", price: 250.0, stock: 120 },
      { name: "60ml Value Size", price: 420.0, stock: 60 },
    ],
  },
  {
    category: "beauty",
    name: "Silk Pillowcase",
    description:
      "100% Mulberry silk pillowcase to prevent hair breakage and skin aging. The ultimate beauty sleep accessory.",
    image:
      "https://images.unsplash.com/photo-1574345244510-48286a1fc837?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Champagne Pink", price: 350.0, stock: 30 },
      { name: "Silver Grey", price: 350.0, stock: 25 },
      { name: "Jet Black", price: 350.0, stock: 20 },
    ],
  },
  {
    category: "beauty",
    name: "Dyson Airwrap Multi-styler",
    description:
      "Curl, shape, smooth, and hide flyaways. Without extreme heat. Dry and style simultaneously.",
    image:
      "https://images.unsplash.com/photo-1522338140262-f46f5912018a?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Nickel/Copper", price: 5999.0, stock: 5 },
      { name: "Prussian Blue/Rich Copper", price: 6299.0, stock: 3 },
    ],
  },
  {
    category: "beauty",
    name: "Matte Lipstick Quad",
    description:
      "A set of four long-wearing matte lipsticks in essential nude and red shades.",
    image:
      "https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=1024",
    variants: [{ name: "Nude & Red Collection", price: 480.0, stock: 40 }],
  },
  {
    category: "beauty",
    name: "Mineral Sunscreen SPF 50",
    description:
      "Broad-spectrum protection for face and body. Non-greasy and leaves no white cast.",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Face Formula 50ml", price: 180.0, stock: 100 },
      { name: "Body Formula 200ml", price: 320.0, stock: 50 },
    ],
  },
  {
    category: "beauty",
    name: "Luxury Perfume - Oud Wood",
    description:
      "A rare and exotic fragrance featuring smoky oud, sandalwood, and eastern spices.",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "50ml EDP", price: 2800.0, stock: 8 },
      { name: "100ml EDP", price: 4500.0, stock: 5 },
    ],
  },
  {
    category: "beauty",
    name: "Vitamin C Brightening Mask",
    description:
      "Instantly brightens and revitalizes dull skin. Packed with antioxidants for a healthy glow.",
    image:
      "https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&q=80&w=1024",
    variants: [{ name: "Box of 10 Masks", price: 299.0, stock: 75 }],
  },
  {
    category: "beauty",
    name: "Organic Beard Oil",
    description:
      "Soothes, conditions, and softens the beard while hydrating the skin underneath.",
    image:
      "https://images.unsplash.com/photo-1626015565503-467a84594692?auto=format&fit=crop&get=80&w=1024",
    variants: [{ name: "Cedarwood & Lime 30ml", price: 150.0, stock: 60 }],
  },

  // Groceries
  {
    category: "groceries",
    name: "Premium Roast Coffee Beans",
    description:
      "100% Arabica beans, medium roast with notes of chocolate and caramel.",
    image:
      "https://images.unsplash.com/photo-1559056191-75502dbf025e?auto=format&fit=crop&q=80&w=1024",
    variants: [
      { name: "Whole Bean 500g", price: 85.0, stock: 200 },
      { name: "Ground 500g", price: 85.0, stock: 150 },
    ],
  },
  {
    category: "groceries",
    name: "Extra Virgin Olive Oil",
    description:
      "First cold-pressed olive oil from carefully selected Mediterranean olives.",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1024",
    variants: [{ name: "750ml Glass Bottle", price: 120.0, stock: 100 }],
  },
  {
    category: "groceries",
    name: "Organic Matcha Powder",
    description:
      "Ceremonial grade matcha from Uji, Japan. Vibrant green color and rich, umami taste.",
    image:
      "https://images.unsplash.com/photo-1582736443415-acc097f480ad?auto=format&fit=crop&q=80&w=1024",
    variants: [{ name: "30g Tin", price: 240.0, stock: 45 }],
  },
  {
    category: "groceries",
    name: "Manuka Honey MGO 400+",
    description:
      "Authentic New Zealand Manuka honey with guaranteed high methylglyoxal content.",
    image:
      "https://images.unsplash.com/photo-1558230554-460d3c01a2ba?auto=format&fit=crop&q=80&w=1024",
    variants: [{ name: "250g Jar", price: 380.0, stock: 30 }],
  },
  {
    category: "groceries",
    name: "Artisan Chocolate Bar Set",
    description:
      "A selection of three bean-to-bar dark chocolates featuring Sea Salt, Raspberry, and Sea Buckthorn.",
    image:
      "https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?auto=format&fit=crop&q=80&w=1024",
    variants: [{ name: "Collection of 3 Bars", price: 145.0, stock: 80 }],
  },
  {
    category: "groceries",
    name: "Himalayan Pink Salt",
    description:
      "Pure and unrefined salt crystals from the foothills of the Himalayas. Fine grain.",
    image:
      "https://images.unsplash.com/photo-1518110901926-7006241e2a14?auto=format&fit=crop&q=80&w=1024",
    variants: [{ name: "500g Pouch", price: 45.0, stock: 120 }],
  },
  {
    category: "groceries",
    name: "Aged Balsamic Vinegar",
    description:
      "Modena balsamic vinegar aged in wooden barrels for 12 years. Thick and syrupy.",
    image:
      "https://images.unsplash.com/photo-1620980210212-083f982956f4?auto=format&fit=crop&q=80&w=1024",
    variants: [{ name: "250ml Bottle", price: 220.0, stock: 40 }],
  },
  {
    category: "groceries",
    name: "Quinoa & Grain Bowl Kit",
    description:
      "A healthy and delicious mix of organic quinoa, farro, and lentils with a lemon-herb dressing.",
    image:
      "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=1024",
    variants: [{ name: "Family Pack (4 Portions)", price: 110.0, stock: 60 }],
  },
];

async function main() {
  console.log("Start seeding...");

  // 0. Cleanup
  console.log("Cleaning up database...");
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productDiscount.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 1. Create Categories
  console.log("Creating categories...");
  const categoryMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }

  // 2. Create Products
  console.log(`Creating ${PRODUCTS.length} products...`);
  for (const p of PRODUCTS) {
    const categoryId = categoryMap[p.category];
    if (!categoryId) continue;

    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        image: p.image,
        status: ProductStatus.ACTIVE,
        categories: {
          create: {
            categoryId: categoryId,
          },
        },
        images: {
          create: (p as any).images?.map((url: string, index: number) => ({
            url,
            publicId: `seed_${p.name.replace(/\s+/g, '_').toLowerCase()}_${index}`,
            position: index,
          })) || [],
        },
        variants: {
          create: p.variants.map((v) => ({
            name: v.name,
            sku: `${p.name.substring(0, 3).toUpperCase()}-${v.name.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 10000)}`,
            price: v.price,
            inventory: {
              create: {
                stock: v.stock,
              },
            },
          })),
        },
      },
    });
  }

  console.log("Seeding finished.");

  // 3. Create Admin User
  console.log("Creating Admin User...");
  // Use a pre-generated bcrypt hash for 'admin123' to avoid missing dependency imports
  const adminPasswordHash = "$2a$10$w6zByjYt4m5iW2x1WfO5tOh8sS5o4iXW5CqH9c7z4ZzT/5L5.RzIq"; // "admin123"

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@makola.com" },
    update: {
      role: "admin",
      name: "Store Admin"
    },
    create: {
      id: "admin-seed-id",
      email: "admin@makola.com",
      name: "Store Admin",
      role: "admin",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  await prisma.account.upsert({
    where: { id: "admin-acc-id" },
    update: {
      password: adminPasswordHash
    },
    create: {
      id: "admin-acc-id",
      accountId: "admin",
      providerId: "credential",
      userId: adminUser.id,
      password: adminPasswordHash,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
