import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.count();
    const campaigns = await prisma.campaign.count();
    const payments = await prisma.campaignPayment.count();

    return NextResponse.json({
      success: true,
      database: "connected",
      counts: {
        users,
        campaigns,
        payments,
      },
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
