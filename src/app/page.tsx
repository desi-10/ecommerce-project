import CategoryMonth from "@/components/categoryofthemonth";
import DealOfDay from "@/components/deal";
import FeatureRow from "@/components/feature";
import Hero from "@/components/hero";
import { HeroWithCategories } from "@/components/hero-a";
import { HeroBannerPlusPromos } from "@/components/hero-b";
import ProductSection from "@/components/product";
import PromoBanners from "@/components/promo";
import Wrapper from "@/components/wrapper";


export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100">

      <main className="pb-20 md:pb-0">
        {/* <Hero /> */}
        {/* <HeroBannerPlusPromos /> */}
        <HeroWithCategories />
        <FeatureRow />

        <Wrapper>
          <DealOfDay />
          <PromoBanners />
          <CategoryMonth />

          <ProductSection
            title="Popular Smartphones & Tablets"
            tabs={["iPhone", "iPad", "Samsung"]}
          />
          <ProductSection
            title="Best Seller Laptops & Sounds"
            tabs={["Apple", "Laptop", "Asus", "Marshall", "Speaker"]}
          />
          <ProductSection
            title="Technology Toys Recommended For You"
            tabs={["Micro", "Drone/Flycam", "XBOX"]}
          />
          <ProductSection
            title="Good Price Accessories"
            tabs={["Headphones", "Charger", "Case USB", "Hard Drive", "TV Box"]}
          />
        </Wrapper>
      </main>


    </div>
  );
}
