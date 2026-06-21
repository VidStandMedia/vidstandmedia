"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CreatorProfile() {
  const params = useParams();
  const channelId = params.channel_id as string;

  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!channelId) return;

    async function loadData() {
      setLoading(true);

      try {
        // GET USER INFO
        const userRes = await fetch("/api/users");
        const userData = await userRes.json();

        if (userData.success) {
          const foundUser = userData.data.find(
            (u: any) =>
              u.youtube_channel_id === channelId
          );

          setUser(foundUser);
        }

        // GET ANALYTICS HISTORY
        const analyticsRes = await fetch(
          "/api/channel-analytics"
        );
        const analyticsData =
          await analyticsRes.json();

        if (analyticsData.success) {
          const filtered =
            analyticsData.data.filter(
              (item: any) =>
                item.channel_id === channelId
            );

          setHistory(filtered);
        }
      } catch (error) {
        console.error("PROFILE ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [channelId]);

  if (loading) {
    return (
      <div className="p-10">
        Loading creator profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-10">
        Creator not found
      </div>
    );
  }

  // Chart data
  const chartData = history.map((item) => ({
    date: item.snapshot_date,
    views: item.view_count,
    subscribers: item.subscriber_count,
    watchTime: item.watch_time,
  }));

  return (
    <div className="p-10 space-y-10">
      {/* HEADER */}
      <div className="flex items-center gap-6">
        <img
          src={user.youtube_profile_image}
          className="w-20 h-20 rounded-full"
        />

        <div>
          <h1 className="text-3xl font-bold">
            {user.youtube_channel_name}
          </h1>

          <p className="text-gray-500">
            {user.email}
          </p>

          <p className="text-sm text-gray-400">
            {user.youtube_channel_id}
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6">
        <div className="border p-4 rounded-xl">
          <h3 className="font-bold">Latest Views</h3>
          <p className="text-2xl">
            {history.at(-1)?.view_count || 0}
          </p>
        </div>

        <div className="border p-4 rounded-xl">
          <h3 className="font-bold">
            Latest Subscribers
          </h3>
          <p className="text-2xl">
            {history.at(-1)?.subscriber_count || 0}
          </p>
        </div>

        <div className="border p-4 rounded-xl">
          <h3 className="font-bold">
            Watch Time
          </h3>
          <p className="text-2xl">
            {history.at(-1)?.watch_time || 0}
          </p>
        </div>
      </div>

      {/* CHART */}
      <div className="border rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">
          Performance Trends
        </h2>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
              />

              <Line
                type="monotone"
                dataKey="subscribers"
                stroke="#10b981"
              />

              <Line
                type="monotone"
                dataKey="watchTime"
                stroke="#f59e0b"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}