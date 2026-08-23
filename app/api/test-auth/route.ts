import { NextResponse } from "next/server";

import { getAuthSession } from "@/lib/auth";
import { getOrCreateUser } from "@/lib/db/user";

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          authenticated: false,
          error: "No authenticated user found.",
        },
        { status: 401 }
      );
    }

    const user = await getOrCreateUser(session);

    return NextResponse.json({
      authenticated: true,

      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Database user test failed:", error);

    return NextResponse.json(
      {
        authenticated: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create or retrieve database user.",
      },
      { status: 500 }
    );
  }
}