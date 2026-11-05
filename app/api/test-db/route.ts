
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { prisma } from "@/lib/prisma";
import { ADMIN_EMAIL } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    // Verify administrator authentication
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (
      !token?.email ||
      token.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    // Retrieve database counts
    const users = await prisma.user.count();
    const campaigns = await prisma.campaign.count();
    const payments = await prisma.campaignPayment.count();

    // Retrieve latest campaign
    const campaign = await prisma.campaign.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        channel: true,
        googleAds: true,
        business: true,
        video: true,
        audience: true,
        agreement: true,
        payment: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        database: "connected",
        counts: {
          users,
          campaigns,
          payments,
        },
        campaign,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Database test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
