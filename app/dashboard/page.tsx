"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { data: session } = useSession();

  console.log("SESSION:", session);

  const [channel, setChannel] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [growth, setGrowth] = useState<any>(null);
  const [creatorProfile, setCreatorProfile] =
  useState<any>(null);
  const chartData = history.map((item) => ({
  date: item.snapshot_date,
  views: item.view_count,
  subscribers: item.subscriber_count,
  watchTime: item.watch_time,
}));

const [requestingCampaign, setRequestingCampaign] =
  useState(false);

  useEffect(() => {
    if (!session?.accessToken) return;

    fetch("/api/channel-analytics")
  .then((res) => res.json())
  .then((data) => {
    console.log(
      "ANALYTICS HISTORY:",
      data
    );

fetch("/api/creator-profile")
  .then((res) => res.json())
  .then((data) => {
    console.log(
      "CREATOR PROFILE:",
      data
    );

    if (
      data.success &&
      data.data.length > 0
    ) {
      setCreatorProfile(
        data.data[0]
      );
    }
  })
  .catch((error) => {
    console.error(
      "CREATOR PROFILE ERROR:",
      error
    );
  });

    if (data.success) {
      setHistory(data.data);

      if (data.data.length >= 2) {
        const first = data.data[0];

        const last =
          data.data[data.data.length - 1];

        setGrowth({
          subscriberGrowth:
            last.subscriber_count -
            first.subscriber_count,

          viewGrowth:
            last.view_count -
            first.view_count,

          watchTimeGrowth:
            last.watch_time -
            first.watch_time,
        });
      }
    }
  })
  .catch((error) => {
    console.error(
      "ANALYTICS HISTORY ERROR:",
      error
    );
  });

    // FETCH CHANNEL INFO
    fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("CHANNEL RESPONSE:", data);

        if (data.items && data.items.length > 0) {
          const channelData = data.items[0];

          setChannel(channelData);

          // SAVE USER TO SUPABASE
          fetch("/api/save-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
  email: session?.user?.email,

  youtube_channel_id:
    channelData.id,

  youtube_channel_name:
    channelData.snippet.title,

  youtube_profile_image:
    channelData.snippet.thumbnails.high.url,

  access_token:
    session?.accessToken,

  refresh_token:
    session?.refreshToken,
}),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log("USER SAVED:", result);
            })
            .catch((error) => {
              console.error("SAVE USER ERROR:", error);
            });

          // GET UPLOADS PLAYLIST ID
          const uploadsPlaylistId =
            channelData.contentDetails.relatedPlaylists.uploads;

          // FETCH VIDEOS
          fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=10`,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            }
          )
            .then((res) => res.json())
            .then((videoData) => {
              console.log("VIDEOS RESPONSE:", videoData);

              if (videoData.items) {
                setVideos(videoData.items);
              }
            })
            .catch((error) => {
              console.error("VIDEOS ERROR:", error);
            });

          // FETCH ANALYTICS
          fetch(
            "https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&startDate=2024-01-01&endDate=2026-12-31&metrics=views,estimatedMinutesWatched,subscribersGained,subscribersLost,averageViewDuration",
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            }
          )
            .then((res) => res.json())
            .then((analyticsData) => {
  console.log(
    "ANALYTICS RESPONSE:",
    analyticsData
  );

  if (
    analyticsData.rows &&
    analyticsData.rows.length > 0
  ) {
    const analyticsRow =
      analyticsData.rows[0];

    setAnalytics(analyticsRow);

    fetch("/api/save-analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel_id: channelData.id,

        snapshot_date:
          new Date()
            .toISOString()
            .split("T")[0],

        subscriber_count:
          Number(
            channelData.statistics
              .subscriberCount
          ),

        view_count:
          Number(
            channelData.statistics
              .viewCount
          ),

        watch_time:
          Number(analyticsRow[1]),

        avg_view_duration:
          Number(analyticsRow[4]),
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(
          "ANALYTICS SAVED:",
          result
        );
      })
      .catch((error) => {
        console.error(
          "SAVE ANALYTICS ERROR:",
          error
        );
      });
  }
})
            .catch((error) => {
              console.error(
                "ANALYTICS ERROR:",
                error
              );
            });
        }
      })
      .catch((error) => {
        console.error("CHANNEL ERROR:", error);
      });
  }, [session]);

async function requestCampaign() {
  if (!channel) return;

  setRequestingCampaign(true);

  try {
    const response = await fetch(
      "/api/save-campaign-request",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          channel_id: channel.id,

          channel_name:
            channel.snippet.title,

          email:
            session?.user?.email,

          budget:
            creatorProfile?.monthly_budget,

          goal:
            creatorProfile?.growth_goal,
        }),
      }
    );

    const data =
      await response.json();

    console.log(
      "CAMPAIGN REQUEST:",
      data
    );

    if (data.success) {
      alert(
        "Campaign request submitted!"
      );
    }
  } catch (error) {
    console.error(error);
  }

  setRequestingCampaign(false);
}

  if (!session) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold">
          Please sign in
        </h1>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        YouTube Dashboard
      </h1>

      {!channel && (
        <p className="text-lg">
          Loading channel data...
        </p>
      )}

      {channel && (
        <div className="space-y-6 mb-12">
          <img
            src={
              channel?.snippet?.thumbnails?.high?.url ||
              channel?.snippet?.thumbnails?.default?.url
            }
            alt="Channel"
            className="w-32 h-32 rounded-full"
          />

          <div>
            <h2 className="text-3xl font-bold">
              {channel?.snippet?.title}
            </h2>

            <p className="text-gray-600 mt-2">
              Connected YouTube Channel
            </p>

            <div className="mt-6 border rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4">
                Channel Stats
              </h3>

              <div className="space-y-2">
                <p>
                  <strong>Subscribers:</strong>{" "}
                  {channel.statistics.subscriberCount}
                </p>

                <p>
                  <strong>Total Views:</strong>{" "}
                  {channel.statistics.viewCount}
                </p>

                <p>
                  <strong>Total Videos:</strong>{" "}
                  {channel.statistics.videoCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

{creatorProfile && (
  <div className="mb-12 border rounded-2xl p-6">
    <h2 className="text-3xl font-bold mb-6">
      Creator Profile
    </h2>

    <div className="space-y-3">
      <p>
        <strong>
          Growth Goal:
        </strong>{" "}
        {
          creatorProfile.growth_goal
        }
      </p>

      <p>
        <strong>
          Monthly Budget:
        </strong>{" "}
        {
          creatorProfile.monthly_budget
        }
      </p>

      <p>
        <strong>Niche:</strong>{" "}
        {creatorProfile.niche}
      </p>

      <p>
        <strong>
          Biggest Challenge:
        </strong>{" "}
        {
          creatorProfile.biggest_challenge
        }
      </p>
    </div>
  </div>
)}

<div className="mb-12">
  <button
    onClick={requestCampaign}
    disabled={requestingCampaign}
    className="border rounded-xl px-6 py-3"
  >
    {requestingCampaign
      ? "Submitting..."
      : "Request Growth Campaign"}
  </button>
</div>

{growth && (
  <div className="mb-12 border rounded-2xl p-6">
    <h2 className="text-3xl font-bold mb-6">
      Growth Summary
    </h2>

    <div className="space-y-3">
      <p>
        <strong>
          Subscriber Growth:
        </strong>{" "}
        {growth.subscriberGrowth}
      </p>

      <p>
        <strong>
          View Growth:
        </strong>{" "}
        {growth.viewGrowth}
      </p>

      <p>
        <strong>
          Watch Time Growth:
        </strong>{" "}
        {growth.watchTimeGrowth}
      </p>
    </div>
  </div>
)}

      {analytics && (
        <div className="mb-12 border rounded-2xl p-6">
          <h2 className="text-3xl font-bold mb-6">
            Channel Analytics
          </h2>

          <div className="space-y-3">
            <p>
              <strong>Total Views:</strong>{" "}
              {analytics[0]}
            </p>

            <p>
              <strong>Watch Time (Minutes):</strong>{" "}
              {analytics[1]}
            </p>

            <p>
              <strong>Subscribers Gained:</strong>{" "}
              {analytics[2]}
            </p>

            <p>
              <strong>Subscribers Lost:</strong>{" "}
              {analytics[3]}
            </p>

            <p>
              <strong>
                Average View Duration (Seconds):
              </strong>{" "}
              {analytics[4]}
            </p>
          </div>
        </div>
      )}

{history.length > 0 && (
  <div className="mb-12 border rounded-2xl p-6">
    <h2 className="text-3xl font-bold mb-6">
      Analytics History
    </h2>

    <div className="space-y-4">
      {history.map((item, index) => (
        <div
          key={index}
          className="border rounded-xl p-4"
        >
          <p>
            <strong>Date:</strong>{" "}
            {item.snapshot_date}
          </p>

          <p>
            <strong>Subscribers:</strong>{" "}
            {item.subscriber_count}
          </p>

          <p>
            <strong>Views:</strong>{" "}
            {item.view_count}
          </p>

          <p>
            <strong>Watch Time:</strong>{" "}
            {item.watch_time}
          </p>

          <p>
            <strong>Avg View Duration:</strong>{" "}
            {item.avg_view_duration}
          </p>
        </div>
      ))}
    </div>
  </div>
)}

{history.length > 1 && (
  <div className="mb-12 border rounded-2xl p-6">
    <h2 className="text-3xl font-bold mb-6">
      Views Trend
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="date" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="views"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}

{history.length > 1 && (
  <div className="mb-12 border rounded-2xl p-6">
    <h2 className="text-3xl font-bold mb-6">
      Subscriber Trend
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="date" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="subscribers"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}

{history.length > 1 && (
  <div className="mb-12 border rounded-2xl p-6">
    <h2 className="text-3xl font-bold mb-6">
      Watch Time Trend
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="date" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="watchTime"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">
          Your Videos
        </h2>

        {videos.length === 0 && (
          <p>No videos found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="border rounded-2xl p-4"
            >
              <img
                src={video.snippet.thumbnails.high.url}
                alt={video.snippet.title}
                className="rounded-xl mb-4"
              />

              <h3 className="font-bold text-lg">
                {video.snippet.title}
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Published{" "}
                {new Date(
                  video.snippet.publishedAt
                ).toLocaleDateString()}
              </p>

              <a
                href={`https://youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 underline"
              >
                Watch Video
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}