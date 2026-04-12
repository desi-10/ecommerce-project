import 'dotenv/config';
import { getProductsService } from "../src/server/products/products.service";

async function main() {
  try {
    const res = await getProductsService({
      page: 1,
      limit: 12,
      category: 'groceries',
      minPrice: 0,
      maxPrice: 2000,
      sort: 'newest'
    });
    console.log(JSON.stringify(res, null, 2));
  } catch(e: any) {
    console.error("SERVICE CRASH:", e.message);
  }
}

main().catch(console.error);
