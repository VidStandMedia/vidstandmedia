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

return Response.json({
  success: true,
  channelData,
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