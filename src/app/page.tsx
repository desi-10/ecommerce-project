import CategoryMonth from "@/components/categoryofthemonth";
import DealOfDay from "@/components/deal";
import FeatureRow from "@/components/feature";
import Hero from "@/components/hero";
import { HeroWithCategories } from "@/components/hero-a";
import { HeroBannerPlusPromos } from "@/components/hero-b";
import ProductSection from "@/components/product";
import PromoBanners from "@/components/promo";
import Wrapper from "@/components/wrapper";
import Image from "next/image";


export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100">

      <main className="pb-20 md:pb-0">
        {/* <Hero /> */}
        <HeroBannerPlusPromos />
        {/* <HeroWithCategories /> */}
        <FeatureRow />

        <Wrapper>
          <div className="pb-20">

            <CategoryMonth />
            <PromoBanners />
            <DealOfDay />

            <ProductSection
              title="Popular Smartphones & Tablets"
            />
            {/* <ProductSection
            title="Best Seller Laptops & Sounds"
            tabs={["Apple", "Laptop", "Asus", "Marshall", "Speaker"]}
          /> */}

            <section className="py-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* LEFT — Banner Image */}
                <div className="lg:col-span-1 h-full">
                  <div className="relative h-full w-full overflow-hidden rounded-xl">
                    <Image
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                      alt="Promo banner"
                      className="w-full h-full object-cover"
                      width={1000}
                      height={1000}
                    />

                    {/* Optional overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                      <div>
                        <h2 className="text-white text-2xl font-bold">
                          Summer Collection
                        </h2>
                        <p className="text-white/80 text-sm">
                          Up to 40% off selected items
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT — Product List */}
                <div className="lg:col-span-2 space-y-4 border bg-white divide-y">

                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 p-4"
                    >
                      <Image
                        src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
                        alt="Product"
                        className="w-20 h-20 object-cover rounded-md"
                        width={1000}
                        height={1000}
                      />

                      <div className="flex-1">
                        <h3 className="font-medium">Product Name</h3>
                        <p className="text-sm text-muted-foreground">
                          Short product description goes here.
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">$49.99</p>
                        <button className="mt-2 text-sm bg-black text-white px-3 py-1 rounded-md hover:bg-neutral-800">
                          Add
                        </button>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </section>



            <ProductSection
              title="Technology Toys Recommended For You"
            />
          </div>
        </Wrapper>
      </main>


    </div>
  );
}
