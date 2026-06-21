"use client";

import { useEffect, useState } from "react";

export default function CampaignRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);

const statuses = [
  "New",
  "Contacted",
  "Proposal Sent",
  "Active Client",
  "Completed",
];

  useEffect(() => {
    fetch("/api/campaign-requests")
      .then((res) => res.json())
      .then((data) => {
        console.log(
          "CAMPAIGN REQUESTS:",
          data
        );

        if (data.success) {
          setRequests(data.data);
        }
      })
      .catch((error) => {
        console.error(
          "CAMPAIGN REQUESTS ERROR:",
          error
        );
      });
  }, []);

async function updateStatus(
  id: string,
  status: string
) {
  try {
    const response =
      await fetch(
        "/api/update-campaign-status",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id,
            status,
          }),
        }
      );

    const data =
      await response.json();

    console.log(
      "STATUS UPDATE:",
      data
    );

    if (data.success) {
      setRequests(
        requests.map(
          (request) =>
            request.id === id
              ? {
                  ...request,
                  status,
                }
              : request
        )
      );
    }
  } catch (error) {
    console.error(error);
  }
}

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        Campaign Requests
      </h1>

      <p className="mb-6">
        Total Requests: {requests.length}
      </p>

      {requests.length === 0 && (
        <p>No campaign requests found.</p>
      )}

      {requests.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border p-3">
                  Channel
                </th>

                <th className="border p-3">
                  Email
                </th>

                <th className="border p-3">
                  Goal
                </th>

                <th className="border p-3">
                  Budget
                </th>

                <th className="border p-3">
                  Status
                </th>

                <th className="border p-3">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="border p-3">
  <select
    value={request.status}
    onChange={(e) =>
      updateStatus(
        request.id,
        e.target.value
      )
    }
    className="border p-2 rounded"
  >
    {statuses.map(
      (status) => (
        <option
          key={status}
          value={status}
        >
          {status}
        </option>
      )
    )}
  </select>
</td>

                  <td className="border p-3">
                    {request.email}
                  </td>

                  <td className="border p-3">
                    {request.goal}
                  </td>

                  <td className="border p-3">
                    {request.budget}
                  </td>

                  <td className="border p-3">
                    {request.status}
                  </td>

                  <td className="border p-3">
                    {new Date(
                      request.created_at
                    ).toLocaleDateString()}
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