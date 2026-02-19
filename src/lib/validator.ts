import z from "zod";
import { ApiError } from "./api-error";
import { statusCodes } from "better-auth";

// ✅ generic validator: pass (schema, body/query) and get typed data back
export function validateOrThrow<T extends z.ZodTypeAny>(
  schema: T,
  input: unknown,
) {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    throw new ApiError("Validation error", statusCodes.UNPROCESSABLE_ENTITY);
  }

  return parsed.data as z.infer<T>;
}
