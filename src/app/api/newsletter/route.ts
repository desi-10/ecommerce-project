import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendNewsletterEmail } from "@/lib/email";
import prisma from "@/lib/db";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = newsletterSchema.parse(body);

    // Send confirmation email
    await sendNewsletterEmail(email);

    return NextResponse.json(
      { success: true, message: "Successfully subscribed to newsletter" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 },
      );
    }

    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to subscribe" },
      { status: 500 },
    );
  }
}
