import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/stats");
      return data.data;
    },
  });
}
