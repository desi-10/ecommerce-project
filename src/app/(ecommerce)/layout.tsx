import TopMiniBar from "@/components/topminibar";
import Header from "@/components/header";
import MobileBottomNav from "@/components/mobilebottomnav";
import Footer from "@/components/footer";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function EcommercerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* <TopMiniBar /> */}
      <div className="print:hidden">
        <Header />
      </div>
      {/* <BlueNav /> */}
      <TooltipProvider>{children}</TooltipProvider>
      <div className="print:hidden">
        <Footer />
        <MobileBottomNav />
      </div>
    </div>
  );
}
