"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function OnboardingPage() {
  const { data: session } = useSession();

  const [growthGoal, setGrowthGoal] =
    useState("");

  const [monthlyBudget, setMonthlyBudget] =
    useState("");

  const [niche, setNiche] = useState("");

  const [biggestChallenge, setBiggestChallenge] =
    useState("");

  const [saving, setSaving] = useState(false);

  const [channelId, setChannelId] =
  useState("");

useEffect(() => {
  fetch("/api/user-profile")
    .then((res) => res.json())
    .then((data) => {
      if (
        data.success &&
        data.data.length > 0
      ) {
        setChannelId(
          data.data[0].youtube_channel_id
        );
      }
    })
    .catch((error) => {
      console.error(error);
    });
}, []);

  async function saveProfile() {
    if (!session) return;

    setSaving(true);

    try {
      const response = await fetch(
        "/api/save-profile",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            channel_id: channelId,

            growth_goal:
              growthGoal,

            monthly_budget:
              monthlyBudget,

            niche,

            biggest_challenge:
              biggestChallenge,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "PROFILE SAVED:",
        data
      );

      if (data.success) {
        window.location.href =
          "/dashboard";
      }
    } catch (error) {
      console.error(error);
    }

    setSaving(false);
  }

  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">
        Creator Onboarding
      </h1>

      <div className="space-y-6">

        {/* GOAL */}

        <div>
          <label className="block mb-2 font-bold">
            Growth Goal
          </label>

          <select
            className="border p-3 rounded w-full"
            value={growthGoal}
            onChange={(e) =>
              setGrowthGoal(
                e.target.value
              )
            }
          >
            <option value="">
              Select Goal
            </option>

            <option>
              More Views
            </option>

            <option>
              More Subscribers
            </option>

            <option>
              More Watch Time
            </option>

            <option>
              More Leads
            </option>
          </select>
        </div>

        {/* BUDGET */}

        <div>
          <label className="block mb-2 font-bold">
            Monthly Budget
          </label>

          <select
            className="border p-3 rounded w-full"
            value={monthlyBudget}
            onChange={(e) =>
              setMonthlyBudget(
                e.target.value
              )
            }
          >
            <option value="">
              Select Budget
            </option>

            <option>
              Under $100
            </option>

            <option>
              $100-$500
            </option>

            <option>
              $500-$1000
            </option>

            <option>
              $1000+
            </option>
          </select>
        </div>

        {/* NICHE */}

        <div>
          <label className="block mb-2 font-bold">
            Channel Niche
          </label>

          <select
            className="border p-3 rounded w-full"
            value={niche}
            onChange={(e) =>
              setNiche(
                e.target.value
              )
            }
          >
            <option value="">
              Select Niche
            </option>

            <option>
              Gaming
            </option>

            <option>
              Business
            </option>

            <option>
              Education
            </option>

            <option>
              Entertainment
            </option>

            <option>
              Other
            </option>
          </select>
        </div>

        {/* CHALLENGE */}

        <div>
          <label className="block mb-2 font-bold">
            Biggest Challenge
          </label>

          <select
            className="border p-3 rounded w-full"
            value={
              biggestChallenge
            }
            onChange={(e) =>
              setBiggestChallenge(
                e.target.value
              )
            }
          >
            <option value="">
              Select Challenge
            </option>

            <option>
              Getting Views
            </option>

            <option>
              Getting Subscribers
            </option>

            <option>
              Low CTR
            </option>

            <option>
              Low Watch Time
            </option>
          </select>
        </div>

<p>
  Channel ID: {channelId}
</p>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="border px-6 py-3 rounded"
        >
          {saving
            ? "Saving..."
            : "Complete Setup"}
        </button>
      </div>
    </main>
  );
}