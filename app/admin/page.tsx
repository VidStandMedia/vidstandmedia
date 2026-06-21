"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        console.log("USERS:", data);

        if (data.success) {
          setUsers(data.data);
        }
      })
      .catch((error) => {
        console.error(
          "USERS ERROR:",
          error
        );
      });
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        Agency Dashboard
      </h1>

      <p className="mb-6">
        Total Creators: {users.length}
      </p>

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
            {users.map((user, index) => (
              <tr
                key={index}
                className="border-b"
              >
                <td className="p-3">
                  <img
                    src={
                      user.youtube_profile_image
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                  />
                </td>

                <td className="p-3">
  <a
    href={`/admin/${user.youtube_channel_id}`}
    className="text-blue-600 underline"
  >
    {user.youtube_channel_name}
  </a>
</td>

                <td className="p-3">
                  {user.email}
                </td>

                <td className="p-3">
                  {
                    user.youtube_channel_id
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}