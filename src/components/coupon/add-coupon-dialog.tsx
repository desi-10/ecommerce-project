"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCreateCoupon } from "@/hooks/use-coupon";
import { toast } from "sonner";
import { Ticket, Loader2 } from "lucide-react";

const createCouponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").max(30).toUpperCase(),
  type: z.enum(["PERCENT", "AMOUNT"]),
  value: z.coerce.number().positive("Value must be positive"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  minOrderValue: z.coerce.number().min(0).optional(),
  maxUses: z.coerce.number().int().min(1).optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

type CreateCouponValues = z.infer<typeof createCouponSchema>;

interface AddCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCouponDialog({ open, onOpenChange }: AddCouponDialogProps) {
  const { mutate: createCoupon, isPending } = useCreateCoupon();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateCouponValues>({
    resolver: zodResolver(createCouponSchema) as any,
    defaultValues: {
      code: "",
      type: "PERCENT",
      value: 0,
      status: "ACTIVE",
    },
  });

  const onSubmit = (values: CreateCouponValues) => {
    createCoupon(values, {
      onSuccess: () => {
        toast.success("Coupon created successfully");
        reset();
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to create coupon");
      },
    });
  };

  const selectedType = watch("type");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border border-gray-200 shadow-sm rounded-md">
        <div className="bg-blue-600 p-8 text-white relative">
            <Ticket className="absolute right-8 top-8 h-12 w-12 text-white/20 -rotate-12" />
            <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight">Create Coupon</DialogTitle>
                <DialogDescription className="text-blue-100 font-medium">
                    Set up a new promotional code for your customers
                </DialogDescription>
            </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Coupon Code</Label>
              <Input 
                placeholder="E.G. SAVE20" 
                {...register("code")} 
                className="h-10 rounded-md border-gray-200 bg-gray-50 focus:bg-white transition-all font-mono font-bold text-blue-600 uppercase" 
              />
              {errors.code && <p className="text-xs text-red-500 font-semibold">{errors.code.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Discount Type</Label>
              <Select onValueChange={(val: any) => setValue("type", val)} value={selectedType}>
                <SelectTrigger className="h-10 rounded-md border-gray-200 bg-gray-50">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-md shadow-sm border-gray-200">
                  <SelectItem value="PERCENT">Percentage (%)</SelectItem>
                  <SelectItem value="AMOUNT">Fixed Amount (GHS)</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-red-500 font-semibold">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Value</Label>
              <Input type="number" step="0.01" {...register("value")} className="h-10 rounded-md border-gray-200 bg-gray-50" />
              {errors.value && <p className="text-xs text-red-500 font-semibold">{errors.value.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Min. Spend (Optional)</Label>
              <Input type="number" step="0.01" placeholder="0.00" {...register("minOrderValue")} className="h-10 rounded-md border-gray-200 bg-gray-50" />
              {errors.minOrderValue && <p className="text-xs text-red-500 font-semibold">{errors.minOrderValue.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Max Uses (Optional)</Label>
              <Input type="number" placeholder="Unlimited" {...register("maxUses")} className="h-10 rounded-md border-gray-200 bg-gray-50" />
              {errors.maxUses && <p className="text-xs text-red-500 font-semibold">{errors.maxUses.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Start Date</Label>
              <Input type="datetime-local" {...register("startsAt")} className="h-10 rounded-md border-gray-200 bg-gray-50" />
              {errors.startsAt && <p className="text-xs text-red-500 font-semibold">{errors.startsAt.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">End Date</Label>
              <Input type="datetime-local" {...register("endsAt")} className="h-10 rounded-md border-gray-200 bg-gray-50" />
              {errors.endsAt && <p className="text-xs text-red-500 font-semibold">{errors.endsAt.message}</p>}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="rounded-md h-10 font-bold text-gray-400 hover:text-gray-900"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-blue-600 text-white hover:bg-blue-700 h-10 px-8 rounded-md shadow-sm transition-all font-bold min-w-[140px]"
            >
              {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                  "Create Coupon"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
