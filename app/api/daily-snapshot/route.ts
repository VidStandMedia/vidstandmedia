
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decryptToken } from "@/lib/token-encryption";
import { refreshAccessToken } from "@/lib/google";

export async function GET(request: Request) {
  // 1. Protect the scheduled endpoint.
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET is not configured.");
    return NextResponse.json(
      { success: false, error: "Cron security is not configured." },
      { status: 500 }
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    // 2. Find users with encrypted Google refresh tokens.
    const users = await prisma.user.findMany({
      where: {
        googleAccount: {
          is: {
            refreshTokenEncrypted: {
              not: null,
            },
          },
        },
      },
      include: {
        googleAccount: true,
        campaigns: {
          orderBy: {
            updatedAt: "desc",
          },
          include: {
            channel: true,
          },
        },
      },
    });

    const dateString = new Date().toISOString().slice(0, 10);
    const snapshotDate = new Date(`${dateString}T00:00:00.000Z`);

    let processed = 0;
    let skipped = 0;
    const errors: { userId: string; message: string }[] = [];

    // 3. Process each connected creator.
    for (const user of users) {
      try {
        const encryptedRefreshToken =
          user.googleAccount?.refreshTokenEncrypted;

        if (!encryptedRefreshToken) {
          skipped++;
          continue;
        }

        // Find the creator's most recently updated saved channel.
        const savedChannel = user.campaigns.find(
          (campaign) => campaign.channel !== null
        )?.channel;

        if (!savedChannel?.youtubeChannelId) {
          skipped++;
          continue;
        }

        // 4. Decrypt the refresh token and refresh Google's access token.
        const refreshToken = decryptToken(encryptedRefreshToken);
        const tokenData = await refreshAccessToken(refreshToken);
        const accessToken = tokenData.access_token;

        if (!accessToken) {
          throw new Error("Google did not return an access token.");
        }

        // 5. Retrieve the authenticated user's YouTube channel statistics.
        const youtubeResponse = await fetch(
          "https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&mine=true",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          }
        );

        if (!youtubeResponse.ok) {
          const errorText = await youtubeResponse.text();
          throw new Error(
            `YouTube API request failed (${youtubeResponse.status}): ${errorText}`
          );
        }

        const youtubeData = await youtubeResponse.json();
        const channel = youtubeData.items?.[0];

        if (!channel?.id || !channel.statistics) {
          throw new Error("YouTube did not return channel statistics.");
        }

        // Make sure the Google account still matches the saved campaign channel.
        if (channel.id !== savedChannel.youtubeChannelId) {
          throw new Error(
            "The connected Google account does not match the saved campaign channel."
          );
        }

        const statistics = channel.statistics;

        // 6. Save today's snapshot in PostgreSQL through Prisma.
        await prisma.channelAnalytics.upsert({
          where: {
            channelId_snapshotDate: {
              channelId: channel.id,
              snapshotDate,
            },
          },
          create: {
            userId: user.id,
            channelId: channel.id,
            snapshotDate,
            subscriberCount: BigInt(statistics.subscriberCount ?? "0"),
            viewCount: BigInt(statistics.viewCount ?? "0"),
            videoCount: Number(statistics.videoCount ?? "0"),
            // These remain null until YouTube Analytics API data is added.
            watchTimeMinutes: null,
            averageViewDurationSeconds: null,
          },
          update: {
            subscriberCount: BigInt(statistics.subscriberCount ?? "0"),
            viewCount: BigInt(statistics.viewCount ?? "0"),
            videoCount: Number(statistics.videoCount ?? "0"),
          },
        });

        processed++;
      } catch (error) {
        console.error(
          `Daily snapshot failed for user ${user.id}:`,
          error
        );

        errors.push({
          userId: user.id,
          message:
            error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      date: dateString,
      totalUsers: users.length,
      processed,
      skipped,
      failed: errors.length,
      errors,
      database: "Prisma / PostgreSQL",
    });
  } catch (error) {
    console.error("Daily snapshot job failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Daily snapshot failed.",
      },
      { status: 500 }
    );
  }
}
