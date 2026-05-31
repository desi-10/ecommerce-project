import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdminServerSession } from "@/lib/auth-guards";
import { handleApiError } from "@/lib/api-handler";

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await requireAdminServerSession();
    const { id } = await params;

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
};
