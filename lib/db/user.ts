import "server-only";

import { prisma } from "@/lib/prisma";

type AuthSession = {
  user?: {
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
};

export async function getOrCreateUser(
  session: AuthSession | null
) {
  const email = session?.user?.email;

  if (!email) {
    throw new Error(
      "Authenticated user does not have an email address."
    );
  }

  const name = session.user?.name ?? null;
  const image = session.user?.image ?? null;

  return prisma.user.upsert({
    where: {
      email,
    },

    create: {
      email,
      name,
      image,
    },

    update: {
      name,
      image,
    },
  });
}