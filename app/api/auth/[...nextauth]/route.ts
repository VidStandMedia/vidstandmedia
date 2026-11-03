
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";
import { encryptToken } from "@/lib/token-encryption";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/youtube.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, account }: any) {
      if (account) {
        token.accessToken = account.access_token;
      }

      // Save the Google account and encrypted refresh token
      // when the user signs in with Google.
      if (
        account?.provider === "google" &&
        account.providerAccountId &&
        user?.email
      ) {
        const dbUser = await prisma.user.upsert({
          where: {
            email: user.email,
          },
          update: {
            name: user.name ?? undefined,
            image: user.image ?? undefined,
          },
          create: {
            email: user.email,
            name: user.name ?? null,
            image: user.image ?? null,
          },
        });

        const encryptedRefreshToken =
          account.refresh_token
            ? encryptToken(account.refresh_token)
            : undefined;

        await prisma.googleAccount.upsert({
          where: {
            userId: dbUser.id,
          },

          update: {
            providerAccountId: account.providerAccountId,
            scope: account.scope ?? undefined,

            // Preserve the existing encrypted token if Google
            // does not return a new refresh token.
            ...(encryptedRefreshToken
              ? {
                  refreshTokenEncrypted:
                    encryptedRefreshToken,
                }
              : {}),
          },

          create: {
            userId: dbUser.id,
            providerAccountId:
              account.providerAccountId,
            refreshTokenEncrypted:
              encryptedRefreshToken ?? null,
            scope: account.scope ?? null,
          },
        });
      }

      return token;
    },

    async session({ session, token }: any) {
      session.accessToken = token.accessToken;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
