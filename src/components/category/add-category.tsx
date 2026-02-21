// components/categories/create-category-dialog.tsx
"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { useCreateCategory } from "@/hooks/use-category";
import { ImageUpload } from "@/components/image-upload";

const createCategorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
    image: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

type CreateCategoryForm = z.infer<typeof createCategorySchema>;

export function CreateCategoryDialog() {
    const [open, setOpen] = React.useState(false);
    const { mutateAsync, isPending } = useCreateCategory();

    const form = useForm<CreateCategoryForm>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: { name: "", description: "", image: "", status: "ACTIVE" },
        mode: "onTouched",
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = form;

    const status = watch("status");

    const onSubmit = async (values: CreateCategoryForm) => {
        await mutateAsync(values);
        form.reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create category</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                    <DialogTitle>Create category</DialogTitle>
                    <DialogDescription>
                        Add a new category to organize products.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" autoComplete="off">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="e.g. Electronics" {...register("name")} />
                        {errors.name ? <p className="text-sm text-red-600">{errors.name.message}</p> : null}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <Textarea id="description" rows={4} {...register("description")} />
                        {errors.description ? (
                            <p className="text-sm text-red-600">{errors.description.message}</p>
                        ) : null}
                    </div>

                    <div className="grid gap-2">
                        <Label>Category Image</Label>
                        <ImageUpload
                            onUpload={(url) => setValue("image", url)}
                            defaultValue={watch("image")}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Status</Label>
                        <Select
                            value={status}
                            onValueChange={(v) =>
                                setValue("status", v as "ACTIVE" | "INACTIVE", {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status ? <p className="text-sm text-red-600">{errors.status.message}</p> : null}
                    </div>

                    <DialogFooter className="mt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
