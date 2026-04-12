import prisma from "@/lib/db";
import { format } from "date-fns";
import { requireAdminServerSession } from "@/lib/auth-guards";

export const dynamic = 'force-dynamic';

export default async function ContactsDashboardPage() {
    await requireAdminServerSession();

    const inquiries = await prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Customer Inquiries</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                    Review and respond to messages submitted through the public contact page.
                </p>
            </div>

            <div className="rounded-md border bg-white overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Sender</th>
                            <th className="px-6 py-4 font-medium">Subject</th>
                            <th className="px-6 py-4 font-medium">Message Snapshot</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {inquiries.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    No inquiries found. When customers use the contact page, their messages will appear here.
                                </td>
                            </tr>
                        ) : (
                            inquiries.map((inq) => (
                                <tr key={inq.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {format(new Date(inq.createdAt), "MMM d, yyyy")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{inq.name}</div>
                                        <div className="text-gray-500 text-xs">{inq.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                                        {inq.subject}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                                        {inq.message}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                            inq.status === 'UNREAD' ? 'bg-red-100 text-red-700' : 
                                            inq.status === 'READ' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                            {inq.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
