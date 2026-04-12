import { z } from "zod";
import { toInt } from "../products/products.utils";

export const createReviewSchema = z.object({
  rating: z.preprocess(toInt, z.number().int().min(1).max(5)),
  comment: z.string().trim().max(1000).optional(),
});

export const replyReviewSchema = z.object({
  reply: z.string().trim().min(1, "Reply cannot be empty").max(1000),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ReplyReviewInput = z.infer<typeof replyReviewSchema>;
