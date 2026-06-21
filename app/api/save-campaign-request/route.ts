import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      channel_id,
      channel_name,
      email,
      budget,
      goal,
    } = body;

    const { data, error } = await supabase
      .from("campaign_requests")
      .insert([
        {
          channel_id,
          channel_name,
          email,
          budget,
          goal,
          status: "New",
        },
      ])
      .select();

    if (error) {
      console.error(
        "CAMPAIGN REQUEST ERROR:",
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