import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      subscriptionStatus: "NONE" | "ACTIVE" | "PAST_DUE" | "CANCELED";
      hasApiKey: boolean;
    } & DefaultSession["user"];
  }
}
