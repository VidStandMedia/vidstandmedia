import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      channel_id,
      snapshot_date,
      subscriber_count,
      view_count,
      watch_time,
      avg_view_duration,
    } = body;

    const { data, error } = await supabase
      .from("channel_analytics")
      .upsert(
        [
          {
            channel_id,
            snapshot_date,
            subscriber_count,
            view_count,
            watch_time,
            avg_view_duration,
          },
        ],
        {
          onConflict: "channel_id,snapshot_date",
        }
      )
      .select();

    if (error) {
      console.error("SUPABASE ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          error,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "SAVE ANALYTICS ERROR:",
      error
    );

    return NextResponse.json(
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