"use client";

import { useState } from "react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, CheckCircle, Eye } from "lucide-react";
import { Inquiry } from "@/types/contacts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export function InquiryActions({ 
    inquiry, 
    onRefresh 
}: { 
    inquiry: Inquiry; 
    onRefresh: () => void 
}) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const router = useRouter();

    const handleUpdateStatus = async (newStatus: string) => {
        try {
            const res = await fetch(`/api/contact/${inquiry.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update status");
            
            toast.success(`Inquiry marked as ${newStatus.toLowerCase()}`);
            onRefresh();
        } catch (error) {
            toast.error("Error updating inquiry status");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this inquiry?")) return;
        
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/contact/${inquiry.id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete inquiry");
            
            toast.success("Inquiry deleted successfully");
            onRefresh();
        } catch (error) {
            toast.error("Error deleting inquiry");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setViewOpen(true)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Message
                    </DropdownMenuItem>
                    
                    {inquiry.status !== "RESOLVED" && (
                        <DropdownMenuItem onClick={() => handleUpdateStatus("RESOLVED")}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Resolved
                        </DropdownMenuItem>
                    )}
                    
                    {inquiry.status === "UNREAD" && (
                        <DropdownMenuItem onClick={() => handleUpdateStatus("READ")}>
                            <Eye className="h-4 w-4 mr-2" />
                            Mark as Read
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem 
                        onClick={handleDelete}
                        className="text-red-600 focus:text-red-600"
                        disabled={isDeleting}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Inquiry Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4 text-sm font-medium">
                            <span className="text-muted-foreground">From:</span>
                            <span className="col-span-3 text-gray-900">{inquiry.name} ({inquiry.email})</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 text-sm font-medium">
                            <span className="text-muted-foreground">Subject:</span>
                            <span className="col-span-3 text-gray-900">{inquiry.subject}</span>
                        </div>
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-muted-foreground">Message:</span>
                            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap min-h-[100px]">
                                {inquiry.message}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setViewOpen(false)}>Close</Button>
                        {inquiry.status !== "RESOLVED" && (
                            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
                                handleUpdateStatus("RESOLVED");
                                setViewOpen(false);
                            }}>
                                Resolve Inquiry
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
