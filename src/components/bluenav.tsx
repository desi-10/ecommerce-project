import { Flame, Smartphone, Tablet, Laptop, Speaker, Gamepad2, Watch } from "lucide-react";
import Wrapper from "./wrapper";

const links = [
    { label: "HOT DEAL", icon: Flame },
    { label: "SMARTPHONE", icon: Smartphone },
    { label: "TABLETS", icon: Tablet },
    { label: "LAPTOP", icon: Laptop },
    { label: "SOUNDS", icon: Speaker },
    { label: "TECHNOLOGY TOYS", icon: Gamepad2 },
    { label: "ACCESSORIES", icon: Watch },
];

export default function BlueNav() {
    return (
        <div className="hidden md:block bg-blue-600 text-white">
            <Wrapper>
                <div className="flex items-center justify-center gap-6 py-4  font-semibold">
                    {links.map((l) => (
                        <button key={l.label} className="flex items-center gap-2 hover:opacity-90">
                            <l.icon className="h-4 w-4" />
                            {l.label}
                        </button>
                    ))}
                </div>
            </Wrapper>
        </div>
    );
}
