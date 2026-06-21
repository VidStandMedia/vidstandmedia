import { supabase } from "@/lib/supabase";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      id,
      status,
    } = body;

    const { data, error } =
      await supabase
        .from(
          "campaign_requests"
        )
        .update({
          status,
        })
        .eq("id", id)
        .select();

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

    return Response.json({
      success: true,
      data,
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