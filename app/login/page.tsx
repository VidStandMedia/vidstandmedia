"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-xl">

        <h1 className="text-center text-5xl font-bold text-black">
          Login to VidStandMedia
        </h1>

        <p className="mt-6 text-center text-lg text-gray-700">
          Sign in with your Google account to begin setting up your
          YouTube promotion.
        </p>

        <div className="mt-12 rounded-2xl border border-gray-300 p-8">

          <h2 className="text-2xl font-semibold text-black">
            Before You Continue
          </h2>

          <p className="mt-4 leading-7 text-gray-700">
            By signing in, you agree to the VidStandMedia Terms of
            Service and authorize us to help manage your Google Ads
            campaigns using Google's official advertising platform.
          </p>

          <div className="mt-8 flex items-start gap-3">

            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) =>
                setAcceptedTerms(e.target.checked)
              }
              className="mt-1 h-5 w-5"
            />

            <label
              htmlFor="terms"
              className="text-black"
            >
              I have read and agree to the{" "}
              <Link
                href="/terms"
                className="font-semibold text-red-600 hover:underline"
              >
                Terms of Service
              </Link>.
            </label>

          </div>

          <button
            onClick={() =>
              signIn("google", {
                callbackUrl: "/onboarding",
              })
            }
            disabled={!acceptedTerms}
            className={`mt-10 w-full rounded-xl py-4 text-lg font-semibold transition ${
              acceptedTerms
                ? "bg-red-600 text-white hover:bg-red-700"
                : "cursor-not-allowed bg-gray-300 text-gray-500"
            }`}
          >
            Sign in with Google
          </button>

        </div>

      </div>
    </main>
  );
}