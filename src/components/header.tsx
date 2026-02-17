"use client";

import { Search, ShoppingCart, Heart, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Wrapper from "./wrapper";
import Navbar from "./navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="bg-white lg:sticky top-0 z-10">
            <div className="border-b">
                <Wrapper>
                    <div className="py-6 flex items-center gap-4">
                        <button className="md:hidden" onClick={() => setOpen((v) => !v)}>
                            <Menu className="h-5 w-5" />
                        </button>

                        <div className="text-2xl font-extrabold tracking-tight">
                            mart<span className="text-blue-600">fury</span>
                        </div>

                        {/* Desktop search */}
                        <div className="hidden md:flex flex-1 items-center">
                            <div className="flex w-full">

                                {/* Category Select */}
                                <Select defaultValue="all">
                                    <SelectTrigger className="w-40 rounded-r-none border-r-0 text-xs min-h-11">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="electronics">Electronics</SelectItem>
                                        <SelectItem value="fashion">Fashion</SelectItem>
                                        <SelectItem value="computers">Computers</SelectItem>
                                        <SelectItem value="beauty">Health & Beauty</SelectItem>
                                        <SelectItem value="home">Home & Garden</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Search Input */}
                                <Input
                                    className="rounded-none border-l-0 border-r-0 h-11"
                                    placeholder="I'm shopping for..."
                                />

                                {/* Search Button */}
                                <Button className="rounded-l-none bg-primary h-11">
                                    {/* <Search className="h-4 w-4 mr-2" /> */}
                                    Search
                                </Button>
                            </div>
                        </div>

                        {/* Icons */}
                        <div className="ml-auto flex items-center gap-4">
                            <button className="hidden md:inline-flex">
                                <Heart className="h-5 w-5" />
                            </button>
                            <button className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                <span className="absolute -top-2 -right-2 text-[10px] bg-blue-600 text-white rounded-full h-4 w-4 grid place-items-center">
                                    0
                                </span>
                            </button>
                            <button className="hidden md:inline-flex items-center gap-2 text-sm">
                                <User className="h-5 w-5" />
                                <span className="leading-tight text-left">
                                    <span className="block text-xs text-muted-foreground">Login</span>
                                    <span className="block font-medium">Register</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </Wrapper>

            </div>
            <Navbar />

            {/* Mobile search like screenshot */}
            <div className="md:hidden px-4 pb-4">
                <div className="flex">
                    <Input className="rounded-r-none" placeholder="Search something..." />
                    <Button className="rounded-l-none bg-blue-600 hover:bg-blue-700 px-4">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Optional mobile drawer placeholder */}
            {open && (
                <div className="md:hidden px-4 pb-4 text-sm text-muted-foreground">
                    Menu (wire your links here)
                </div>
            )}
        </header>
    );
}
