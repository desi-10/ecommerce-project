import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
