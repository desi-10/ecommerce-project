"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// import { useToast } from "@/hooks/use-toast";
import type { Category } from "@/types/categories";

interface DeleteCategoryDialogProps {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteCategoryDialog({
  category,
  open,
  onOpenChange,
  onSuccess,
}: DeleteCategoryDialogProps) {
  const [loading, setLoading] = useState(false);
  // const { toast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete category");
      }

      // toast({
      //   title: "Success",
      //   description: "Category deleted successfully",
      // });

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: error.message || "Failed to delete category",
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{category.name}</span>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
