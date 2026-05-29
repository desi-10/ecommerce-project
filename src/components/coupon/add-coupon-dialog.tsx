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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

  const form = useForm<CreateCouponValues>({
    resolver: zodResolver(createCouponSchema),
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
        form.reset();
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to create coupon");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        <div className="bg-blue-600 p-8 text-white relative">
            <Ticket className="absolute right-8 top-8 h-12 w-12 text-white/20 -rotate-12" />
            <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight">Create Coupon</DialogTitle>
                <DialogDescription className="text-blue-100 font-medium">
                    Set up a new promotional code for your customers
                </DialogDescription>
            </DialogHeader>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6 bg-white">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-gray-500">Coupon Code</FormLabel>
                    <FormControl>
                      <Input placeholder="E.G. SAVE20" {...field} className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-mono font-bold text-blue-600 uppercase" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-gray-500">Discount Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border-gray-100 bg-gray-50">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white rounded-xl shadow-xl border-gray-100">
                        <SelectItem value="PERCENT">Percentage (%)</SelectItem>
                        <SelectItem value="AMOUNT">Fixed Amount (GHS)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-gray-500">Value</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="h-12 rounded-xl border-gray-100 bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minOrderValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-gray-500">Min. Spend (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ''} className="h-12 rounded-xl border-gray-100 bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxUses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-gray-500">Max Uses (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Unlimited" {...field} value={field.value || ''} className="h-12 rounded-xl border-gray-100 bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startsAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-gray-500">Start Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} className="h-12 rounded-xl border-gray-100 bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endsAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-gray-500">End Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} className="h-12 rounded-xl border-gray-100 bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                className="rounded-xl h-12 font-bold text-gray-400 hover:text-gray-900"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 rounded-xl shadow-lg shadow-blue-100 transition-all font-bold min-w-[140px]"
              >
                {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    "Create Coupon"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
