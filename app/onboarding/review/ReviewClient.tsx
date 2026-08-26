"use client";

import Image from "next/image";
import Link from "next/link";
import OnboardingProgress from "@/components/OnboardingProgress";
import type { Campaign } from "@/lib/session/campaign";

type ReviewClientProps = {
  campaign: Campaign;
};

export default function ReviewClient({
  campaign,
}: ReviewClientProps) {
  return (
    <main className="bg-white py-24 px-6">
      <div className="mx-auto max-w-5xl">

        <OnboardingProgress currentStep="review" />

        <h1 className="mt-10 text-center text-5xl font-bold text-black">
          Review Your Campaign
        </h1>

        <p className="mt-6 text-center text-lg text-gray-700">
          Review your campaign details before continuing to the
          service agreement. You can edit any section if you'd
          like to make changes.
        </p>


        {/* Your YouTube Channel */}

        <div className="mt-14 rounded-2xl border border-gray-300 bg-white p-8 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold text-black">
              Your YouTube Channel
            </h2>

            <Link
              href="/onboarding?from=review"
              className="font-semibold text-green-600 transition hover:text-green-700"
            >
              Edit →
            </Link>

          </div>

          <div className="mt-8 flex items-center gap-6">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">

              {campaign.channel.thumbnail ? (

                <Image
                  src={campaign.channel.thumbnail}
                  alt={campaign.channel.title}
                  width={80}
                  height={80}
                  className="rounded-full"
                />

              ) : (

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  No Image
                </div>

              )}

            </div>

            <div>

              <p className="text-lg font-semibold text-black">
                {campaign.channel.title || "No channel selected"}
              </p>

              <p className="mt-2 text-gray-700">
                {campaign.channel.email || "No email connected"}
              </p>

              <p className="mt-2 text-gray-700">
                Your connected YouTube account will be used to create your
                advertising campaign.
              </p>

            </div>

          </div>

        </div>


        {/* Promotion Goal */}

        <div className="mt-8 rounded-2xl border border-gray-300 bg-white p-8 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold text-black">
              Promotion Goal
            </h2>

            <Link
              href="/onboarding/goals?from=review"
              className="font-semibold text-green-600 transition hover:text-green-700"
            >
              Edit →
            </Link>

          </div>

          <div className="mt-6">

            <p className="text-lg text-black">

              <span className="font-semibold">
                Selected Goal:
              </span>{" "}

              {campaign.goal ? (
                campaign.goal
              ) : (
                <span className="font-semibold text-red-600">
                  None selected
                </span>
              )}

            </p>

          </div>

        </div>


        {/* Weekly Budget */}

        <div className="mt-8 rounded-2xl border border-gray-300 bg-white p-8 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold text-black">
              Weekly Budget
            </h2>

            <Link
              href="/onboarding/budget?from=review"
              className="font-semibold text-green-600 transition hover:text-green-700"
            >
              Edit →
            </Link>

          </div>

          <div className="mt-6">

            <p className="text-lg text-black">

              <span className="font-semibold">
                Selected Budget:
              </span>{" "}

              {campaign.budget ? (
                campaign.budget
              ) : (
                <span className="font-semibold text-red-600">
                  None selected
                </span>
              )}

            </p>

          </div>

        </div>


        {/* Selected Video */}

        <div className="mt-8 rounded-2xl border border-gray-300 bg-white p-8 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold text-black">
              Selected Video
            </h2>

            <Link
              href="/onboarding/video?from=review"
              className="font-semibold text-green-600 transition hover:text-green-700"
            >
              Edit →
            </Link>

          </div>

          <div className="mt-6">

            {campaign.video.id ? (

              <div>

                <Image
                  src={campaign.video.thumbnail}
                  alt={campaign.video.title}
                  width={480}
                  height={270}
                  className="rounded-xl"
                />

                <h3 className="mt-6 text-xl font-bold text-black">
                  {campaign.video.title}
                </h3>

                <div className="mt-4 space-y-2 text-gray-700">

                  <p>
                    <span className="font-semibold text-black">
                      Published:
                    </span>{" "}
                    {new Date(
                      campaign.video.publishedAt
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <span className="font-semibold text-black">
                      Views:
                    </span>{" "}
                    {new Intl.NumberFormat().format(
                      campaign.video.viewCount
                    )}
                  </p>

                  <p>
                    <span className="font-semibold text-black">
                      Duration:
                    </span>{" "}
                    {campaign.video.duration}
                  </p>

                  <p>
                    <span className="font-semibold text-black">
                      Privacy:
                    </span>{" "}
                    {campaign.video.privacyStatus}
                  </p>

                </div>

                <a
                  href={`https://www.youtube.com/watch?v=${campaign.video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center rounded-lg border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                >
                  Watch on YouTube ↗
                </a>

              </div>

            ) : (

              <p className="font-semibold text-red-600">
                None selected
              </p>

            )}

          </div>

        </div>


        {/* Target Audience */}

        <div className="mt-8 rounded-2xl border border-gray-300 bg-white p-8 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold text-black">
              Target Audience
            </h2>

            <Link
              href="/onboarding/audience?from=review"
              className="font-semibold text-green-600 transition hover:text-green-700"
            >
              Edit →
            </Link>

          </div>

          <div className="mt-6 space-y-4">

            <p className="text-black">
              <span className="font-semibold">
                Country:
              </span>{" "}
              {campaign.audience.country || (
                <span className="font-semibold text-red-600">
                  None selected
                </span>
              )}
            </p>

            <p className="text-black">
              <span className="font-semibold">
                Language:
              </span>{" "}
              {campaign.audience.language || (
                <span className="font-semibold text-red-600">
                  None selected
                </span>
              )}
            </p>

            <p className="text-black">
              <span className="font-semibold">
                Gender:
              </span>{" "}
              {campaign.audience.gender || (
                <span className="font-semibold text-red-600">
                  None selected
                </span>
              )}
            </p>

            <p className="text-black">
              <span className="font-semibold">
                Age Groups:
              </span>{" "}
              {campaign.audience.ageGroups.length > 0 ? (
                campaign.audience.ageGroups.join(", ")
              ) : (
                <span className="font-semibold text-red-600">
                  None selected
                </span>
              )}
            </p>

            <p className="text-black">
              <span className="font-semibold">
                Interests:
              </span>{" "}
              {campaign.audience.interests.length > 0 ? (
                campaign.audience.interests.join(", ")
              ) : (
                <span className="font-semibold text-red-600">
                  None selected
                </span>
              )}
            </p>

          </div>

        </div>


        {/* Campaign Ready */}

        <div className="mt-8 rounded-2xl border border-green-300 bg-green-50 p-8">

          <h2 className="text-2xl font-bold text-green-700">
            ✓ Campaign Ready
          </h2>

          <p className="mt-4 text-gray-700">
            Everything required for your campaign has been completed.
            Review your selections above, then continue to the service
            agreement when you're ready.
          </p>

        </div>


        {/* Navigation */}

        <div className="mt-14 flex justify-between">

          <Link
            href="/onboarding/audience"
            className="rounded-xl border border-gray-300 px-8 py-4 font-semibold text-black transition hover:bg-gray-100"
          >
            Back
          </Link>

          <Link
            href="/onboarding/agreement"
            className="rounded-xl bg-red-600 px-10 py-4 font-semibold text-white transition hover:bg-red-700"
          >
            Continue to Service Agreement
          </Link>

        </div>

      </div>
    </main>
  );
}