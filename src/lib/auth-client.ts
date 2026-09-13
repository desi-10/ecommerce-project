import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const { signIn, signUp, signOut, useSession, requestPasswordReset, resetPassword } = createAuthClient({
  plugins: [adminClient()],
  baseURL: typeof window !== "undefined" ? window.location.origin : process.env.BETTER_AUTH_BASE_URL,
});
