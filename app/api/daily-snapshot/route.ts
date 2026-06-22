import { supabase } from "@/lib/supabase";

import {
  refreshAccessToken,
} from "@/lib/google";

export async function GET() {
  try {
    const { data: users, error } =
      await supabase
        .from("users")
        .select("*");

    if (error) {
      return Response.json(
        {
          success: false,
          error,
        },
        {
          status: 500,
        }
      );
    }

const firstUser = users[0];

const tokenResponse =
  await refreshAccessToken(
    firstUser.refresh_token
  );

console.log(
  "REFRESH TOKEN RESPONSE:",
  tokenResponse
);

const channelResponse =
  await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true",
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    }
  );

const channelData =
  await channelResponse.json();

console.log(
  "CHANNEL DATA:",
  JSON.stringify(channelData, null, 2)
);

console.log(
  "CHANNEL DATA:",
  channelData
);

const channel =
  channelData.items?.[0];

if (!channel) {
  return Response.json(
    {
      success: false,
      error:
        "No channel returned",
    },
    {
      status: 500,
    }
  );
}

const { error: saveError } =
  await supabase
    .from("channel_analytics")
    .upsert(
      [
        {
          channel_id:
            channel.id,

          snapshot_date:
            new Date()
              .toISOString()
              .split("T")[0],

          subscriber_count:
            Number(
              channel.statistics
                .subscriberCount
            ),

          view_count:
            Number(
              channel.statistics
                .viewCount
            ),

          watch_time: 0,

          avg_view_duration: 0,
        },
      ],
      {
        onConflict:
          "channel_id,snapshot_date",
      }
    );

if (saveError) {
  console.error(
    "SNAPSHOT SAVE ERROR:",
    saveError
  );
}

    return Response.json({
  success: true,
  totalUsers:
    users.length,
  channelSaved:
    channel.id,
});

  } catch (error) {
    return Response.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}