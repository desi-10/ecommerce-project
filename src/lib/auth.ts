import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { nextCookies } from "better-auth/next-js";
import { sendPasswordResetEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // Forgot-password flow: better-auth generates the token/URL, we just
    // deliver it. Without this callback, requestPasswordReset() on the
    // client still succeeds silently but no email is ever sent — the UI
    // had a "Forgot password?" link pointing at a page that didn't exist
    // and wouldn't have worked anyway.
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ email: user.email, name: user.name, url });
    },
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
