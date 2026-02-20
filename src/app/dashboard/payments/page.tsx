"use client";

import { paymentColumns } from "@/columns/payment";
import { DataTable } from "@/components/data-table";
import Wrapper from "@/components/wrapper";
import { useGetPayments } from "@/hooks/use-payment";




export default function PaymentsDashboardPage() {
  const { data: paymentsData } = useGetPayments()
  const payments = paymentsData?.data.payments || []

  return (
    <main>
      <Wrapper>
        <div className="flex justify-between items-center">
          <h1>Payments</h1>
        </div>
        <DataTable columns={paymentColumns} data={{ items: payments }} />
      </Wrapper>
    </main>
  );
}
