"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import OnboardingProgress from "@/components/OnboardingProgress";
import Image from "next/image";
import { Session } from "next-auth";
import { saveCampaignChannel } from "@/app/actions/campaign";

type OnboardingClientProps = {
  session: Session;
  channel: any;
};

export default function OnboardingClient({
  session,
  channel,
}: OnboardingClientProps) {
  const searchParams = useSearchParams();

  const fromReview =
    searchParams.get("from") === "review";

  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const youtubeConnected =
    !!channel?.snippet?.title &&
    !!channel?.snippet?.thumbnails?.high?.url;

  async function handleContinue() {
    if (!channel || !youtubeConnected || saving) {
      return;
    }

    setSaving(true);

    try {
      await saveCampaignChannel({
        id: channel.id,
        title: channel.snippet.title,
        thumbnail:
          channel.snippet.thumbnails.high.url,
        email: session.user?.email ?? "",
      });

      if (fromReview) {
        window.location.href =
          "/onboarding/review";
      } else {
        window.location.href =
          "/onboarding/google-ads";
      }
    } catch (error) {
      console.error(
        "Failed to save YouTube channel:",
        error
      );

      setSaving(false);
    }
  }

  async function handleChangeChannel() {
    if (signingOut) {
      return;
    }

    setSigningOut(true);

    await signOut({
      callbackUrl: "/login",
    });
  }

  function handleBackToGoogleSignIn() {
    window.location.href = "/login";
  }

  return (
    <main className="bg-white px-6 py-24">

      <div className="mx-auto max-w-3xl text-center">

        <OnboardingProgress currentStep="login" />

        <h1 className="text-5xl font-bold text-black">
          Welcome to VidStandMedia
        </h1>

        <p className="mt-8 text-lg leading-8 text-black">
          You're just a few steps away from launching
          your YouTube promotion. We'll help you choose
          your campaign goals, advertising budget,
          videos, and audience before reviewing
          everything together.
        </p>


        {/* Google / YouTube connection warning */}

        {!youtubeConnected && (
          <div className="mt-10 rounded-2xl border-2 border-yellow-300 bg-yellow-50 p-8 text-left">

            <h2 className="text-2xl font-bold text-black">
              YouTube Access Is Required
            </h2>

            <p className="mt-4 text-lg leading-7 text-gray-800">
              VidStandMedia needs permission to access
              your YouTube account before you can continue
              with your campaign setup.
            </p>

            <div className="mt-6 rounded-xl border border-yellow-200 bg-white p-6">

              <p className="font-semibold text-black">
                When Google asks what VidStandMedia can
                access, make sure this permission is checked:
              </p>

              <p className="mt-4 rounded-lg bg-gray-100 p-4 font-semibold text-black">
                ✓ View your YouTube account
              </p>

              <p className="mt-4 text-gray-700">
                If this permission was not selected,
                Google will not provide your YouTube
                channel information to VidStandMedia.
              </p>

            </div>

            <p className="mt-6 text-gray-800">
              Click the button below to return to Google
              Sign-In and review the permissions again.
            </p>

            <div className="mt-6 text-center">

              <button
                type="button"
                onClick={handleBackToGoogleSignIn}
                className="rounded-xl bg-red-600 px-8 py-4 font-semibold text-white transition hover:bg-red-700"
              >
                Back to Google Sign-In
              </button>

            </div>

          </div>
        )}


        {/* Connected Account */}

        <div className="mt-12 rounded-2xl border border-gray-300 p-8">

          <h2 className="text-2xl font-bold text-black">
            Your Connected Account
          </h2>

          <div className="mt-8 flex flex-col items-center">

            {channel?.snippet?.thumbnails?.high?.url ? (
              <Image
                src={
                  channel.snippet.thumbnails.high.url
                }
                alt={
                  channel.snippet.title ||
                  "YouTube Channel"
                }
                width={96}
                height={96}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                <span className="text-3xl text-gray-500">
                  ?
                </span>
              </div>
            )}

            <p className="mt-6 text-lg text-black">

              <span className="font-semibold">
                Signed in as:
              </span>

              <br />

              {session.user?.email}

            </p>

            <p className="mt-4 text-lg text-black">

              <span className="font-semibold">
                YouTube Channel:
              </span>

              <br />

              {youtubeConnected
                ? channel.snippet.title
                : "Unknown Channel"}

            </p>

          </div>


          {/* Connection Status */}

          <div className="mt-8 flex flex-col items-center space-y-3 text-center text-lg">

            <p>
              <span className="font-bold text-green-600">
                ✓
              </span>{" "}

              <span className="text-black">
                Google account connected
              </span>
            </p>

            <p>
              {youtubeConnected ? (
                <>
                  <span className="font-bold text-green-600">
                    ✓
                  </span>{" "}

                  <span className="text-black">
                    YouTube channel connected
                  </span>
                </>
              ) : (
                <>
                  <span className="font-bold text-red-600">
                    !
                  </span>{" "}

                  <span className="text-black">
                    YouTube channel access is required
                  </span>
                </>
              )}
            </p>

          </div>


          {/* Change YouTube Channel */}

          {fromReview && youtubeConnected && (
            <div className="mt-10 border-t border-gray-200 pt-8">

              <h3 className="text-xl font-bold text-black">
                Want to use a different YouTube channel?
              </h3>

              <p className="mt-3 text-gray-700">
                Sign out of your current Google account and
                sign in with the Google account connected to
                the YouTube channel you'd like to use.
              </p>

              <button
                type="button"
                onClick={handleChangeChannel}
                disabled={signingOut}
                className={`mt-6 rounded-xl border border-gray-400 px-8 py-3 font-semibold text-black transition ${
                  signingOut
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : "hover:bg-gray-100"
                }`}
              >
                {signingOut
                  ? "Signing Out..."
                  : "Sign Out & Change YouTube Channel"}
              </button>

            </div>
          )}

        </div>


        {/* Continue / Back to Review Button */}

        <div className="mt-16">

          <button
            type="button"
            onClick={handleContinue}
            disabled={
              saving || !youtubeConnected
            }
            className={`inline-block rounded-xl px-10 py-4 text-lg font-semibold text-white transition ${
              saving || !youtubeConnected
                ? "cursor-not-allowed bg-gray-400"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {saving
              ? "Saving..."
              : fromReview
                ? "Back to Review"
                : "Continue"}
          </button>

        </div>

      </div>

    </main>
  );
}