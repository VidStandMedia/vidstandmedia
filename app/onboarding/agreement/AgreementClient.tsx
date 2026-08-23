"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import OnboardingProgress from "@/components/OnboardingProgress";
import { saveCampaignAgreement } from "@/app/actions/campaign";

type Agreement = {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  advertisingAuthorized: boolean;
  acceptedAt: string;
};

type AgreementClientProps = {
  initialAgreement: Agreement;
};

export default function AgreementClient({
  initialAgreement,
}: AgreementClientProps) {
  const router = useRouter();

  const [termsAccepted, setTermsAccepted] = useState(
    initialAgreement.termsAccepted
  );

  const [privacyAccepted, setPrivacyAccepted] = useState(
    initialAgreement.privacyAccepted
  );

  const [advertisingAuthorized, setAdvertisingAuthorized] = useState(
    initialAgreement.advertisingAuthorized
  );

  const [loading, setLoading] = useState(false);

  const canContinue =
    termsAccepted &&
    privacyAccepted &&
    advertisingAuthorized;

  async function handleContinue() {
    if (!canContinue || loading) {
      return;
    }

    try {
      setLoading(true);

      await saveCampaignAgreement({
        termsAccepted: true,
        privacyAccepted: true,
        advertisingAuthorized: true,
        acceptedAt: new Date().toISOString(),
      });

      router.push("/onboarding/payment");
    } catch (error) {
      console.error("Failed to save campaign agreement:", error);
      setLoading(false);
    }
  }

  return (
    <main className="bg-white py-24 px-6">
      <div className="mx-auto max-w-3xl">

        <OnboardingProgress currentStep="agreement" />

        <h1 className="mt-10 text-center text-5xl font-bold text-black">
          Service Agreement
        </h1>

        <p className="mt-6 text-center text-lg leading-8 text-gray-700">
          Before continuing to payment, please review and acknowledge
          the following information about your advertising campaign
          and VidStandMedia's management services.
        </p>

        {/* Important Information */}

        <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-8">

          <h2 className="text-2xl font-bold text-black">
            Important Information
          </h2>

          <div className="mt-6 space-y-4 text-lg text-gray-700">

            <p>
              <span className="font-bold text-green-600">✓</span>{" "}
              You own your Google Ads account.
            </p>

            <p>
              <span className="font-bold text-green-600">✓</span>{" "}
              Google bills you directly for your advertising costs.
            </p>

            <p>
              <span className="font-bold text-green-600">✓</span>{" "}
              VidStandMedia manages your campaigns through
              authorized Google Ads manager access.
            </p>

            <p>
              <span className="font-bold text-green-600">✓</span>{" "}
              Your advertising budget is not charged by VidStandMedia.
            </p>

            <p>
              <span className="font-bold text-green-600">✓</span>{" "}
              VidStandMedia charges a separate management fee
              through Stripe.
            </p>

          </div>

        </div>

        {/* Agreement */}

        <div className="mt-10 rounded-2xl border border-gray-300 bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-black">
            Please Confirm
          </h2>

          <p className="mt-4 text-gray-700">
            You must acknowledge each item below before continuing
            to payment.
          </p>

          <div className="mt-8 space-y-6">

            {/* Advertising Authorization */}

            <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-gray-200 p-5 transition hover:bg-gray-50">

              <input
                type="checkbox"
                checked={advertisingAuthorized}
                onChange={(event) =>
                  setAdvertisingAuthorized(event.target.checked)
                }
                className="mt-1 h-5 w-5 shrink-0"
              />

              <span className="text-gray-800">
                I authorize VidStandMedia to create, manage,
                and optimize advertising campaigns in my
                Google Ads account on my behalf.
              </span>

            </label>

            {/* Google Billing */}

            <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-gray-200 p-5 transition hover:bg-gray-50">

              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) =>
                  setTermsAccepted(event.target.checked)
                }
                className="mt-1 h-5 w-5 shrink-0"
              />

              <span className="text-gray-800">
                I understand that Google will charge my Google
                Ads payment method directly for advertising
                costs and that my advertising budget is separate
                from VidStandMedia's management fee.
              </span>

            </label>

            {/* Management Fee */}

            <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-gray-200 p-5 transition hover:bg-gray-50">

              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(event) =>
                  setPrivacyAccepted(event.target.checked)
                }
                className="mt-1 h-5 w-5 shrink-0"
              />

              <span className="text-gray-800">
                I understand that VidStandMedia charges a
                separate management fee for its campaign
                management services and that this fee is paid
                through Stripe.
              </span>

            </label>

          </div>

          {/* Terms and Privacy */}

          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5">

            <p className="text-gray-800">
              By continuing, you also acknowledge that you have
              read and agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                className="font-semibold text-red-600 underline hover:text-red-700"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                target="_blank"
                className="font-semibold text-red-600 underline hover:text-red-700"
              >
                Privacy Policy
              </Link>
              .
            </p>

          </div>

        </div>

        {/* Navigation */}

        <div className="mt-14 flex items-center justify-between">

          <Link
            href="/onboarding/review"
            className="rounded-xl border border-gray-300 px-8 py-4 font-semibold text-black transition hover:bg-gray-100"
          >
            Back
          </Link>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue || loading}
            className={`rounded-xl px-10 py-4 font-semibold text-white transition ${
              canContinue && !loading
                ? "bg-red-600 hover:bg-red-700"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            {loading ? "Saving..." : "Continue to Payment"}
          </button>

        </div>

      </div>
    </main>
  );
}