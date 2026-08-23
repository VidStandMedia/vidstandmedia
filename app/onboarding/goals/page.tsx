"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import OnboardingProgress from "@/components/OnboardingProgress";
import { saveCampaignGoal } from "@/app/actions/campaign";

const goals = [
  {
    title: "Increase Views",
    description:
      "Promote your video to viewers who are most likely to watch it.",
  },
  {
    title: "Grow My Channel",
    description:
      "Help attract new subscribers by promoting your content.",
  },
  {
    title: "Promote a Product or Service",
    description:
      "Drive traffic and awareness for your business or brand.",
  },
];

export default function GoalsPage() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const router = useRouter();

  return (
    <main className="bg-white py-24 px-6">
      <div className="mx-auto max-w-4xl">

        <OnboardingProgress currentStep="goals" />

        <h1 className="text-center text-5xl font-bold text-black">
          Choose Your Promotion Goal
        </h1>

        <p className="mt-6 text-center text-lg text-gray-700">
          Select the goal that best matches what you'd like to achieve.
          We'll use this information to build the most effective Google Ads
          campaign for your video.
        </p>

        <div className="mt-14 grid gap-8">

          {goals.map((goal) => (

            <button
              key={goal.title}
              type="button"
              onClick={() => setSelectedGoal(goal.title)}
              className={`rounded-2xl border p-8 text-left transition
                ${
                  selectedGoal === goal.title
                    ? "border-green-600 bg-green-50 shadow-lg"
                    : "border-gray-300 hover:border-green-600 hover:bg-green-50 hover:shadow-lg"
                }
              `}
            >

              <h2 className="text-2xl font-bold text-black">
                {goal.title}
              </h2>

              <p className="mt-3 text-gray-700">
                {goal.description}
              </p>

            </button>

          ))}

        </div>


        <div className="mt-14 flex justify-between">

          <Link
            href="/onboarding"
            className="rounded-xl border border-gray-300 px-8 py-4 font-semibold text-black hover:bg-gray-100"
          >
            Back
          </Link>


          <button
            type="button"
            disabled={!selectedGoal}
            onClick={async () => {

              if (!selectedGoal) return;

              await saveCampaignGoal(selectedGoal);

              router.push("/onboarding/budget");

            }}
            className={`rounded-xl px-10 py-4 font-semibold transition
              ${
                selectedGoal
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "cursor-not-allowed bg-gray-300 text-white"
              }
            `}
          >
            Continue
          </button>


        </div>

      </div>
    </main>
  );
}