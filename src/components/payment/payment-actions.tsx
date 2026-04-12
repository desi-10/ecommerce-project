"use client";

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ExternalLink, ReceiptText, User } from "lucide-react";
import { Payment } from "@/types/payments";
import Link from "next/link";

export function PaymentActions({ payment }: { payment: Payment }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Payment Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                    <Link href={`/dashboard/orders?q=${payment.orderId}`}>
                        <ReceiptText className="h-4 w-4 mr-2" />
                        View Related Order
                    </Link>
                </DropdownMenuItem>

                {payment.userId && (
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/users/${payment.userId}`}>
                            <User className="h-4 w-4 mr-2" />
                            View Customer
                        </Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                
                <DropdownMenuItem disabled>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View in Provider
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
