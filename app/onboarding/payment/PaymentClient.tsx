"use client";

import { useState } from "react";
import Link from "next/link";
import OnboardingProgress from "@/components/OnboardingProgress";

type Campaign = {
  goal: string;
  budget: string;

  channel: {
    id: string;
    title: string;
    thumbnail: string;
    email: string;
  };

  googleAds: {
    hasAccount: boolean | null;
    customerId: string;
    accountName: string;
    currency: string;
    timeZone: string;
    verified: boolean;
    managerInvitationSent: boolean;
    managerAccessAccepted: boolean;
  };

  business: {
    companyName: string;
    website: string;
    category: string;
    timeZone: string;
  };

  video: {
    id: string;
    title: string;
    thumbnail: string;
    publishedAt: string;
    viewCount: number;
    duration: string;
    privacyStatus: string;
  };

  audience: {
    country: string;
    language: string;
    gender: string;
    ageGroups: string[];
    interests: string[];
  };

  agreement: {
    termsAccepted: boolean;
    privacyAccepted: boolean;
    advertisingAuthorized: boolean;
    acceptedAt: string;
  };

  payment: {
    managementFee: number;
    managementPlan: string;
    stripeCheckoutSessionId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    paymentStatus: string;
    paidAt: string;
  };
};

type PaymentClientProps = {
  campaign: Campaign;
};

export default function PaymentClient({
  campaign,
}: PaymentClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const managementFee =
    campaign.payment?.managementFee || 99;

  const managementPlan =
    campaign.payment?.managementPlan || "monthly";

  const budget =
    campaign.budget || "Not selected";

  const goal =
    campaign.goal || "Not selected";

  const videoTitle =
    campaign.video?.title || "No video selected";

  const country =
    campaign.audience?.country || "Not selected";

  const language =
    campaign.audience?.language || "Not selected";

  const gender =
    campaign.audience?.gender || "All";

  const ageGroups =
    campaign.audience?.ageGroups?.length > 0
      ? campaign.audience.ageGroups.join(", ")
      : "None selected";

  const interests =
    campaign.audience?.interests?.length > 0
      ? campaign.audience.interests.join(", ")
      : "None selected";

  const googleAdsCustomerId =
    campaign.googleAds?.customerId || "Not provided";

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            managementFee,
            managementPlan,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to create Stripe checkout session."
        );
      }

      if (!data?.url) {
        throw new Error(
          "Stripe checkout URL was not returned."
        );
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Stripe checkout error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while starting payment."
      );

      setLoading(false);
    }
  };

  return (
    <main className="bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl">

        <OnboardingProgress currentStep="payment" />

        <h1 className="mt-10 text-center text-5xl font-bold text-black">
          Payment
        </h1>

        <p className="mt-6 text-center text-lg leading-8 text-gray-700">
          Your Google Ads advertising budget is paid directly
          to Google. Your VidStandMedia campaign management
          fee is paid separately through Stripe.
        </p>

        {/* Payment Summary */}

        <div className="mt-12 grid gap-8 md:grid-cols-2">

          {/* VidStandMedia Management Fee */}

          <div className="rounded-2xl border border-gray-300 bg-white p-8 shadow-sm">

            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              VidStandMedia
            </p>

            <h2 className="mt-3 text-2xl font-bold text-black">
              Campaign Management
            </h2>

            <div className="mt-8">

              <p className="text-sm font-semibold text-gray-500">
                Management Fee
              </p>

              <p className="mt-2 text-5xl font-bold text-black">
                ${managementFee.toFixed(2)}
              </p>

              <p className="mt-2 text-gray-600">
                per{" "}
                {managementPlan === "monthly"
                  ? "month"
                  : managementPlan}
              </p>

            </div>

            <div className="mt-8 rounded-xl bg-gray-50 p-5">

              <p className="font-semibold text-black">
                Paid to:
              </p>

              <p className="mt-1 text-gray-700">
                VidStandMedia
              </p>

            </div>

          </div>

          {/* Google Ads Budget */}

          <div className="rounded-2xl border border-gray-300 bg-white p-8 shadow-sm">

            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Google Ads
            </p>

            <h2 className="mt-3 text-2xl font-bold text-black">
              Advertising Budget
            </h2>

            <div className="mt-8">

              <p className="text-sm font-semibold text-gray-500">
                Weekly Advertising Budget
              </p>

              <p className="mt-2 text-5xl font-bold text-black">
                {budget}
              </p>

              <p className="mt-2 text-gray-600">
                Paid separately to Google Ads
              </p>

            </div>

            <div className="mt-8 rounded-xl bg-gray-50 p-5">

              <p className="font-semibold text-black">
                Paid to:
              </p>

              <p className="mt-1 text-gray-700">
                Google Ads
              </p>

            </div>

          </div>

        </div>

        {/* Billing Explanation */}

        <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-8">

          <h2 className="text-2xl font-bold text-black">
            How billing works
          </h2>

          <div className="mt-6 space-y-5 text-gray-700">

            <div>

              <p className="font-bold text-black">
                Google Ads advertising
              </p>

              <p className="mt-1">
                Google charges your Google Ads payment
                method directly for your advertising costs.
                VidStandMedia does not collect or hold your
                Google Ads advertising budget.
              </p>

            </div>

            <div>

              <p className="font-bold text-black">
                VidStandMedia management
              </p>

              <p className="mt-1">
                VidStandMedia charges a separate management
                fee through Stripe for managing and optimizing
                your advertising campaigns.
              </p>

            </div>

          </div>

        </div>

        {/* Campaign Summary */}

        <div className="mt-10 rounded-2xl border border-gray-300 bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-black">
            Campaign Summary
          </h2>

          <div className="mt-8 divide-y divide-gray-200">

            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:justify-between">
              <span className="font-semibold text-gray-600">
                Promotion Goal
              </span>

              <span className="text-black sm:text-right">
                {goal}
              </span>
            </div>

            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:justify-between">
              <span className="font-semibold text-gray-600">
                Weekly Ad Budget
              </span>

              <span className="text-black sm:text-right">
                {budget}
              </span>
            </div>

            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:justify-between">
              <span className="font-semibold text-gray-600">
                Selected Video
              </span>

              <span className="text-black sm:max-w-md sm:text-right">
                {videoTitle}
              </span>
            </div>

            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:justify-between">
              <span className="font-semibold text-gray-600">
                Country
              </span>

              <span className="text-black sm:text-right">
                {country}
              </span>
            </div>

            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:justify-between">
              <span className="font-semibold text-gray-600">
                Language
              </span>

              <span className="text-black sm:text-right">
                {language}
              </span>
            </div>

            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:justify-between">
              <span className="font-semibold text-gray-600">
                Gender
              </span>

              <span className="text-black sm:text-right">
                {gender}
              </span>
            </div>

            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:justify-between">
              <span className="font-semibold text-gray-600">
                Age Groups
              </span>

              <span className="text-black sm:max-w-md sm:text-right">
                {ageGroups}
              </span>
            </div>

            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:justify-between">
              <span className="font-semibold text-gray-600">
                Interests
              </span>

              <span className="text-black sm:max-w-md sm:text-right">
                {interests}
              </span>
            </div>

            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:justify-between">
              <span className="font-semibold text-gray-600">
                Google Ads Customer ID
              </span>

              <span className="text-black sm:text-right">
                {googleAdsCustomerId}
              </span>
            </div>

          </div>

        </div>

        {/* Important Billing Notice */}

        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-8">

          <h2 className="text-xl font-bold text-black">
            Before you continue
          </h2>

          <div className="mt-4 space-y-3 text-gray-700">

            <p>
              Your ${managementFee.toFixed(2)} management fee
              is separate from your Google Ads advertising
              budget.
            </p>

            <p>
              Google will continue billing your Google Ads
              account directly for advertising charges.
            </p>

            <p>
              Your Google Ads payment method is managed
              directly through your Google Ads account.
            </p>

            <p>
              VidStandMedia does not receive or process your
              Google Ads advertising budget.
            </p>

            <p>
              The management fee is paid securely through
              Stripe.
            </p>

          </div>

        </div>

        {/* Payment Status */}

        {campaign.payment?.paymentStatus === "paid" && (

          <div className="mt-10 rounded-2xl border border-green-200 bg-green-50 p-8">

            <div className="flex items-start gap-4">

              <div className="text-2xl text-green-600">
                ✓
              </div>

              <div>

                <h2 className="text-xl font-bold text-black">
                  Management fee paid
                </h2>

                <p className="mt-2 text-gray-700">
                  Your VidStandMedia management payment has
                  been received.
                </p>

              </div>

            </div>

          </div>

        )}

        {/* Checkout Error */}

        {error && (

          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5">

            <p className="font-semibold text-red-800">
              Payment could not be started
            </p>

            <p className="mt-2 text-red-700">
              {error}
            </p>

          </div>

        )}

        {/* Navigation */}

        <div className="mt-14 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">

          <Link
            href="/onboarding/agreement"
            className="rounded-xl border border-gray-300 px-8 py-4 text-center font-semibold text-black transition hover:bg-gray-100"
          >
            Back
          </Link>

          {campaign.payment?.paymentStatus === "paid" ? (

            <Link
              href="/onboarding"
              className="rounded-xl bg-green-600 px-10 py-4 text-center font-semibold text-white transition hover:bg-green-700"
            >
              Continue
            </Link>

          ) : (

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className={`rounded-xl px-10 py-4 font-semibold transition ${
                loading
                  ? "cursor-not-allowed bg-gray-400 text-white"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {loading
                ? "Redirecting to Stripe..."
                : `Pay $${managementFee.toFixed(2)}/month`}
            </button>

          )}

        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Secure payment processing will be provided by Stripe.
        </p>

      </div>
    </main>
  );
}