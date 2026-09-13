import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useUpdateCustomerRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: "customer" | "vendor" | "admin" }) => {
      const { data } = await axios.patch(`/api/customers/${id}`, { role });
      return data;
    },
    onSuccess: async (_res, vars) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["customers", "list"] }),
        qc.invalidateQueries({ queryKey: ["customers", "detail", vars.id] }),
      ]);
    },
  });
}

export function useGetCustomers() {
  return useQuery({
    queryKey: ["customers", "list"],
    queryFn: async () => {
      const { data } = await axios.get("/api/customers");
      return data;
    },
  });
}

export function useGetCustomer(id: string) {
  return useQuery({
    queryKey: ["customers", "detail", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/customers/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
