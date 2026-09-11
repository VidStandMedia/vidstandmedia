import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.count();
    const campaigns = await prisma.campaign.count();
    const payments = await prisma.campaignPayment.count();

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

    return NextResponse.json({
      success: true,
      database: "connected",

      counts: {
        users,
        campaigns,
        payments,
      },

      campaign,
    });
  } catch (error) {
    console.error("Database test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Database connection failed.",
      },
      { status: 500 }
    );
  }
}
