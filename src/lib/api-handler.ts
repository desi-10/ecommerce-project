import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api-error";

export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode },
    );
  }

  if (error instanceof Response) {
    return error;
  }

  console.error("API Error caught:", error);
  return NextResponse.json(
    { message: "Internal server error", error: error instanceof Error ? error.message : "Unknown" },
    { status: 500 },
  );
};
