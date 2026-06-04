import { apiResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import prisma from "@/lib/db";
import { StatusCodes } from "http-status-codes";
import { CreateReviewInput, ReplyReviewInput } from "./reviews.schema";

const reviewSelect = {
  id: true,
  rating: true,
  comment: true,
  createdAt: true,
  reply: true,
  replyAt: true,
  user: {
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
    },
  },
  product: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
};

export const createReviewService = async (
  productId: string,
  userId: string,
  data: CreateReviewInput
) => {
  const existingReview = await prisma.review.findFirst({
    where: { productId, userId },
  });

  if (existingReview) {
    throw new ApiError(
      "You have already reviewed this product.",
      StatusCodes.CONFLICT
    );
  }

  const review = await prisma.review.create({
    data: {
      productId,
      userId,
      rating: data.rating,
      comment: data.comment || null,
    },
    select: reviewSelect,
  });

  return apiResponse("Review submitted successfully", review);
};

export const getReviewsService = async (page: number = 1, limit: number = 20) => {
  const [total, reviews] = await Promise.all([
    prisma.review.count(),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: reviewSelect,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return apiResponse("Reviews fetched successfully", {
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
};

export const replyToReviewService = async (
  reviewId: string,
  data: ReplyReviewInput
) => {
  const existing = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existing) {
    throw new ApiError("Review not found", StatusCodes.NOT_FOUND);
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: {
      reply: data.reply,
      replyAt: new Date(),
    },
    select: reviewSelect,
  });

  return apiResponse("Reply submitted successfully", updatedReview);
};
