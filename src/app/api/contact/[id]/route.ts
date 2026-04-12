import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdminServerSession } from "@/lib/auth-guards";

export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    await requireAdminServerSession();
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("CONTACT PATCH ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    await requireAdminServerSession();
    const { id } = await params;

    await prisma.inquiry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error("CONTACT DELETE ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
};
