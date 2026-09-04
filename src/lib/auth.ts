import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    nextCookies(),
    admin({
      defaultRole: "regular",
    }),
  ],
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:3003",
  ],
  baseURL: process.env.BETTER_AUTH_BASE_URL,
});
