import prisma from "../src/lib/db";

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users in DB:", JSON.stringify(users, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
