
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { prisma } from "@/lib/prisma";
import { ADMIN_EMAIL } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (
      !token?.email ||
      token.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,

        campaigns: {
          orderBy: {
            updatedAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            goal: true,
            budget: true,
            createdAt: true,
            updatedAt: true,

            channel: true,
            googleAds: true,
            business: true,
            video: true,
            audience: true,
            agreement: true,
            payment: true,
          },
        },
      },
    });

    const data = users.map((user) => {
      const campaign = user.campaigns[0] ?? null;
      const channel = campaign?.channel;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        createdAt: user.createdAt,

        youtube_channel_name:
          channel?.title ?? "Not connected",

        youtube_channel_id:
          channel?.youtubeChannelId ?? null,

        youtube_profile_image:
          channel?.thumbnail ?? user.image ?? null,

        campaign,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to retrieve creators and campaign information.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
