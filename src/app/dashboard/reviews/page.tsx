"use client";

import { useState } from "react";
import { useGetReviews, useReplyToReview } from "@/client/reviews";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function ReviewsDashboardPage() {
  const { data: response, isLoading } = useGetReviews({ page: 1, limit: 100 });
  const reviews = response?.data?.reviews || [];

  const replyMutation = useReplyToReview();
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [replyText, setReplyText] = useState("");

  const handleOpenReply = (review: any) => {
    setSelectedReview(review);
    setReplyText(review.reply || "");
  };

  const handleClose = () => {
    setSelectedReview(null);
    setReplyText("");
  };

  const handleSubmitReply = () => {
    if (!selectedReview) return;
    replyMutation.mutate(
      { reviewId: selectedReview.id, reply: replyText },
      { onSuccess: handleClose }
    );
  };

  if (isLoading) {
    return <div className="p-6">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Product Reviews
        </h1>
      </div>

      <Card className="rounded-xl border-gray-100 shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 border-b border-gray-100">
              <TableRow>
                <TableHead className="py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </TableHead>
                <TableHead className="py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Customer
                </TableHead>
                <TableHead className="py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Rating
                </TableHead>
                <TableHead className="py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Comment
                </TableHead>
                <TableHead className="py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-sm text-gray-500">
                    No reviews found.
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review: any) => (
                  <TableRow key={review.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-sm text-gray-900">
                      {review.product.name}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {review.user?.name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < review.rating ? "opacity-100" : "opacity-30"}>★</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-[200px] truncate">
                      {review.comment || <em className="text-gray-400">No comment</em>}
                    </TableCell>
                    <TableCell>
                      {review.reply ? (
                        <Badge variant="secondary" className="bg-green-50 text-green-700">Replied</Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() => handleOpenReply(review)}
                      >
                        {review.reply ? "Edit Reply" : "Reply"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!selectedReview} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-900 mb-1">{selectedReview?.user?.name}</p>
              <div className="flex text-amber-500 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < (selectedReview?.rating || 0) ? "opacity-100" : "opacity-30"}>★</span>
                ))}
              </div>
              <p>{selectedReview?.comment}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Official Reply</label>
              <Textarea
                placeholder="Type your response here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
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
    </div>
  );
}
