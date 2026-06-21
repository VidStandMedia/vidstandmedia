import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      channel_id,
      growth_goal,
      monthly_budget,
      niche,
      biggest_challenge,
    } = body;

    const { data, error } = await supabase
      .from("creator_profiles")
      .upsert(
        [
          {
            channel_id,
            growth_goal,
            monthly_budget,
            niche,
            biggest_challenge,
          },
        ],
        {
          onConflict: "channel_id",
        }
      )
      .select();

    if (error) {
      console.error(
        "SAVE PROFILE ERROR:",
        error
      );

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

    return Response.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

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