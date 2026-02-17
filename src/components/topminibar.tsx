import Wrapper from "./wrapper";

export default function TopMiniBar() {
    return (
        <div className="hidden md:block bg-white border-b">
            <Wrapper>

                <div className="py-2 text-xs text-muted-foreground flex items-center justify-between">
                    <div>
                        Shopping center <span className="font-medium text-foreground">for all orders over $100</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="hover:text-foreground">Store Location</button>
                        <button className="hover:text-foreground">Track Your Order</button>
                        <div className="flex items-center gap-2">
                            <span>USD</span>
                            <span className="text-muted-foreground">|</span>
                            <span>English</span>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </div>
    );
}
