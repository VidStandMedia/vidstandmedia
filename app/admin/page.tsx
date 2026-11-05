"use client";

import { useEffect, useState } from "react";

type Creator = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  youtube_channel_name: string;
  youtube_channel_id: string | null;
  youtube_profile_image: string | null;
};

export default function AdminPage() {
  const [users, setUsers] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Unable to load creators."
          );
        }

        setUsers(data.data);
      } catch (error) {
        console.error("USERS ERROR:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load creators."
        );
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        Agency Dashboard
      </h1>

      <p className="mb-6">
        Total Creators: {users.length}
      </p>

      {loading && (
        <p>Loading creators...</p>
      )}

      {error && (
        <p className="text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && users.length === 0 && (
        <p>No creators found.</p>
      )}

      {!loading && users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">
                  Profile
                </th>

                <th className="text-left p-3">
                  Channel Name
                </th>

                <th className="text-left p-3">
                  Email
                </th>

                <th className="text-left p-3">
                  Channel ID
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b"
                >
                  <td className="p-3">
                    {user.youtube_profile_image ? (
                      <img
                        src={user.youtube_profile_image}
                        alt="Creator profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600">
                          {user.email
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="p-3">
                    {user.youtube_channel_name}
                  </td>

                  <td className="p-3">
                    {user.email}
                  </td>

                  <td className="p-3">
                    {user.youtube_channel_id ?? "Not connected"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}