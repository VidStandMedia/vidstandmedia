import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("SAVE USER BODY:", body);

    const {
  email,
  youtube_channel_id,
  youtube_channel_name,
  youtube_profile_image,
  access_token,
  refresh_token,
} = body;

    const { data, error } = await supabase
      .from("users")
      .upsert(
        [
          {
  email,
  youtube_channel_id,
  youtube_channel_name,
  youtube_profile_image,
  access_token,
  refresh_token,
},
        ],
        {
          onConflict: "youtube_channel_id",
        }
      )
      .select();

    if (error) {
  console.error(
    "SAVE USER SUPABASE ERROR:",
    error
  );

      return Response.json(
        { success: false, error },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      data,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}