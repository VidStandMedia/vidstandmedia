import { supabase } from "@/lib/supabase";
import { refreshAccessToken } from "@/lib/google";

export async function GET() {
  try {
    // 1. Get users
    const { data: users, error } = await supabase
      .from("users")
      .select("*");

    if (error) {
      return Response.json(
        { success: false, error },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      return Response.json(
        { success: false, error: "No users found" },
        { status: 500 }
      );
    }

    const user = users[0];

    // 2. Refresh access token
    const tokenResponse = await refreshAccessToken(
      user.refresh_token
    );

    // 3. Get YouTube channel stats ONLY
    const channelResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&mine=true",
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      }
    );

    const channelData = await channelResponse.json();
    const channel = channelData.items?.[0];

    if (!channel) {
      return Response.json(
        { success: false, error: "No channel returned" },
        { status: 500 }
      );
    }

    // 4. Save to Supabase (clean + stable)
    const { error: saveError } = await supabase
      .from("channel_analytics")
      .upsert(
        [
          {
            channel_id: channel.id,
            snapshot_date: new Date()
              .toISOString()
              .split("T")[0],

            subscriber_count: Number(
              channel.statistics.subscriberCount
            ),

            view_count: Number(
              channel.statistics.viewCount
            ),

            video_count: Number(
              channel.statistics.videoCount
            ),
          },
        ],
        {
          onConflict: "channel_id,snapshot_date",
        }
      );

    if (saveError) {
      return Response.json(
        { success: false, error: saveError },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      channelId: channel.id,
      stats: {
        subscribers: channel.statistics.subscriberCount,
        views: channel.statistics.viewCount,
        videos: channel.statistics.videoCount,
      },
    });
  } catch (error) {
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}