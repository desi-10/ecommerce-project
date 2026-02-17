import BlueNav from "@/components/bluenav";
import CategoryMonth from "@/components/categoryofthemonth";
import DealOfDay from "@/components/deal";
import FeatureRow from "@/components/feature";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Hero from "@/components/hero";
import MobileBottomNav from "@/components/mobilebottomnav";
import ProductSection from "@/components/product";
import PromoBanners from "@/components/promo";
import TopMiniBar from "@/components/topminibar";
import Wrapper from "@/components/wrapper";


export default function Page() {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">


      <main className="pb-20 md:pb-0">
        <Hero />
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
