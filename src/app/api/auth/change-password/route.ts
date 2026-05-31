import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
// @ts-ignore
import * as bcrypt from "bcrypt";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return Response.json(
      { error: "Current and new password are required" },
      { status: 400 }
    );
  }

  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, providerId: "credential" },
  });

  if (!account || !account.password) {
    return Response.json(
      { error: "User password not found" },
      { status: 404 }
    );
  }

  // Verify current password
  const passwordMatch = await bcrypt.compare(currentPassword, account.password);
  if (!passwordMatch) {
    return Response.json(
      { error: "Current password is incorrect" },
      { status: 400 }
    );
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.account.update({
    where: { id: account.id },
    data: { password: hashedPassword },
  });

  return Response.json({ success: true, message: "Password updated successfully" });
}
