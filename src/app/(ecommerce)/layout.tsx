
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

            <TopMiniBar />
            <Header />
            {/* <BlueNav /> */}
            <TooltipProvider>{children}</TooltipProvider>
            <Footer />
            <MobileBottomNav />
        </div>
    );
}
