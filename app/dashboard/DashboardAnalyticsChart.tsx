"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type AnalyticsRecord = {
  date: string;
  views: number;
  subscribers: number;
  videoCount: number;
  watchTimeMinutes: number | null;
  averageViewDurationSeconds: number | null;
};

export default function DashboardAnalyticsChart({
  data,
}: {
  data: AnalyticsRecord[];
}) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No YouTube performance history is available yet.
      </p>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => Number(value).toLocaleString()}
          />
          <Tooltip
            formatter={(value) => [
              Number(value).toLocaleString(),
              "Total Views",
            ]}
          />
          <Line
            type="monotone"
            dataKey="views"
            name="Total Views"
            stroke="#16a34a"
            strokeWidth={2}
            dot={true}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}