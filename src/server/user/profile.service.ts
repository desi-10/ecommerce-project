import prisma from "@/lib/db";
import { ApiError } from "@/lib/api-error";
import { apiResponse } from "@/lib/api-response";
import { StatusCodes } from "http-status-codes";
import { ProfileUpdateInput, ProfileUpdateSchema } from "./profile.validators";

export const getProfileService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new ApiError("User not found", StatusCodes.NOT_FOUND);
  }

  return apiResponse("Profile fetched successfully", {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    profile: user.profile,
  });
};

export const updateProfileService = async (userId: string, rawData: unknown) => {
  const data: ProfileUpdateInput = ProfileUpdateSchema.parse(rawData);

  const result = await prisma.$transaction(async (tx) => {
    // 1. Update User basic info if provided
    const userUpdate: any = {};
    if (data.name) userUpdate.name = data.name;
    if (data.image !== undefined) userUpdate.image = data.image;

    if (Object.keys(userUpdate).length > 0) {
      await tx.user.update({
        where: { id: userId },
        data: userUpdate,
      });
    }

    // 2. Upsert Profile details
    const profileData = {
      phone: data.phone,
      country: data.country,
      city: data.city,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      postalCode: data.postalCode,
    };

    // Remove undefined values
    const cleanProfileData = Object.fromEntries(
      Object.entries(profileData).filter(([_, v]) => v !== undefined)
    );

    await tx.profile.upsert({
      where: { userId },
      create: {
        userId,
        ...cleanProfileData,
      },
      update: cleanProfileData,
    });

    return tx.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
  });

  return apiResponse("Profile updated successfully", result);
};
