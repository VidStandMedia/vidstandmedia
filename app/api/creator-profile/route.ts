import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("creator_profiles")
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