import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfileUpdateInput } from "@/server/user/profile.validators";

export const useGetProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const res = await fetch("/api/me");
            if (!res.ok) throw new Error("Failed to fetch profile");
            return res.json();
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: ProfileUpdateInput) => {
            const res = await fetch("/api/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update profile");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};

export const useGetUserOrders = () => {
    return useQuery({
        queryKey: ["user-orders"],
        queryFn: async () => {
            const res = await fetch("/api/orders/mine");
            if (!res.ok) throw new Error("Failed to fetch orders");
            return res.json();
        },
    });
};

export const useGetUserOrderDetail = (orderId: string) => {
    return useQuery({
        queryKey: ["user-orders", orderId],
        queryFn: async () => {
            const res = await fetch(`/api/orders/mine/${orderId}`);
            if (!res.ok) throw new Error("Failed to fetch order details");
            return res.json();
        },
        enabled: !!orderId,
    });
};
