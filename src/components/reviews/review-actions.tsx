"use client";

import { useState } from "react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Reply, Eye } from "lucide-react";
import { Review } from "@/types/reviews";
import { toast } from "sonner";
import { useReplyToReview } from "@/client/reviews";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ReviewActions({ 
    review, 
    onRefresh 
}: { 
    review: Review; 
    onRefresh: () => void 
}) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState(review.reply || "");
    
    const replyMutation = useReplyToReview();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;
        
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/reviews/${review.id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete review");
            
            toast.success("Review deleted successfully");
            onRefresh();
        } catch (error) {
            toast.error("Error deleting review");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSubmitReply = () => {
        replyMutation.mutate(
          { reviewId: review.id, reply: replyText },
          { 
            onSuccess: () => {
                toast.success("Reply submitted successfully");
                setReplyOpen(false);
                onRefresh();
            },
            onError: () => {
                toast.error("Failed to submit reply");
            }
          }
        );
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
                    <DropdownMenuItem onClick={() => setReplyOpen(true)}>
                        <Reply className="h-4 w-4 mr-2" />
                        {review.reply ? "Edit Reply" : "Reply to Review"}
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                        onClick={handleDelete}
                        className="text-red-600 focus:text-red-600"
                        disabled={isDeleting}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Review
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{review.reply ? "Edit Reply" : "Reply to Review"}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold text-gray-900 mb-1">{review.user?.name || "Anonymous"}</p>
                            <div className="flex text-amber-500 mb-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={i < (review.rating || 0) ? "opacity-100" : "opacity-30"}>★</span>
                                ))}
                            </div>
                            <p className="italic">"{review.comment}"</p>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Your Official Reply</label>
                            <Textarea
                                placeholder="Type your response here..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="min-h-[120px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReplyOpen(false)}>Cancel</Button>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={handleSubmitReply}
                            disabled={!replyText.trim() || replyMutation.isPending}
                        >
                            {replyMutation.isPending ? "Submitting..." : "Submit Reply"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
