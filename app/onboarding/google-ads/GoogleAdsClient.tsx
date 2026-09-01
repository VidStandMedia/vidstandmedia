"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OnboardingProgress from "@/components/OnboardingProgress";
import { saveCampaignGoogleAds } from "@/app/actions/campaign";

type GoogleAdsClientProps = {
initialGoogleAds: {
hasAccount: boolean | null;
customerId: string;
accountName: string;
currency: string;
timeZone: string;
verified: boolean;
managerInvitationSent: boolean;
managerAccessAccepted: boolean;
};
};

export default function GoogleAdsClient({
initialGoogleAds,
}: GoogleAdsClientProps) {
const router = useRouter();

const [hasAccount, setHasAccount] = useState<boolean | null>(
initialGoogleAds.hasAccount
);

const [customerId, setCustomerId] = useState(
initialGoogleAds.customerId.replace(/\D/g, "").slice(0, 10)
);

const [loading, setLoading] = useState(false);

const customerIdDigits = customerId.replace(/\D/g, "");

const customerIdIsValid =
customerIdDigits.length === 10;

function handleCustomerIdChange(
value: string
) {
const digitsOnly = value
.replace(/\D/g, "")
.slice(0, 10);


setCustomerId(digitsOnly);


}

function formatCustomerId(
value: string
) {
const digits = value
.replace(/\D/g, "")
.slice(0, 10);


if (digits.length <= 3) {
  return digits;
}

if (digits.length <= 6) {
  return `${digits.slice(0, 3)}-${digits.slice(3)}`;
}

return `${digits.slice(0, 3)}-${digits.slice(
  3,
  6
)}-${digits.slice(6)}`;


}

async function handleContinue() {
if (hasAccount === null) {
return;
}


if (
  hasAccount === true &&
  !customerIdIsValid
) {
  return;
}

setLoading(true);

await saveCampaignGoogleAds({
  hasAccount,

  customerId: customerIdDigits,

  accountName:
    initialGoogleAds.accountName || "",

  currency:
    initialGoogleAds.currency || "",

  timeZone:
    initialGoogleAds.timeZone || "",

  verified:
    initialGoogleAds.verified,

  managerInvitationSent:
    initialGoogleAds.managerInvitationSent,

  managerAccessAccepted:
    initialGoogleAds.managerAccessAccepted,
});

router.push(
  "/onboarding/manager-access"
);


}

const continueDisabled =
loading ||
hasAccount === null ||
(hasAccount === true &&
!customerIdIsValid);

return ( <main className="bg-white py-24 px-6">


  <div className="mx-auto max-w-4xl">

    <OnboardingProgress
      currentStep="google-ads"
    />

    <h1 className="mt-10 text-center text-5xl font-bold text-black">
      Connect Google Ads
    </h1>

    <p className="mt-6 text-center text-lg text-gray-700">
      Your Google Ads account remains yours.
      Google charges you directly for advertising,
      while VidStandMedia manages your campaigns
      through manager access.
    </p>

    <div className="mt-14 rounded-2xl border border-gray-300 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold text-black">
        Do you already have a Google Ads account?
      </h2>

      <p className="mt-4 text-gray-700">
        Choose the option that best describes your situation.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        {/* YES */}

        <button
          type="button"
          onClick={() =>
            setHasAccount(true)
          }
          className={`rounded-2xl border-2 p-8 text-left transition ${
            hasAccount === true
              ? "border-green-600 bg-green-50"
              : "border-gray-300 hover:border-green-400"
          }`}
        >

          <h3 className="text-xl font-bold text-black">
            Yes
          </h3>

          <p className="mt-3 text-gray-700">
            I already have a Google Ads account
            and know my Customer ID.
          </p>

        </button>

        {/* NO */}

        <button
          type="button"
          onClick={() =>
            setHasAccount(false)
          }
          className={`rounded-2xl border-2 p-8 text-left transition ${
            hasAccount === false
              ? "border-green-600 bg-green-50"
              : "border-gray-300 hover:border-green-400"
          }`}
        >

          <h3 className="text-xl font-bold text-black">
            No
          </h3>

          <p className="mt-3 text-gray-700">
            I need help creating a Google Ads account.
          </p>

        </button>

      </div>

      {/* EXISTING GOOGLE ADS ACCOUNT */}

      {hasAccount === true && (

        <div className="mt-10">

          <label
            htmlFor="customerId"
            className="block text-lg font-semibold text-black"
          >
            Google Ads Customer ID
          </label>

          <p className="mt-2 text-sm text-gray-600">
            Enter the 10-digit Customer ID found
            in your Google Ads account.
          </p>

          <input
            id="customerId"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={12}
            value={formatCustomerId(customerId)}
            onChange={(e) =>
              handleCustomerIdChange(
                e.target.value
              )
            }
            placeholder="123-456-7890"
            className={`mt-4 w-full rounded-xl border px-5 py-4 text-black outline-none transition focus:border-green-600 ${
              customerId.length > 0 &&
              !customerIdIsValid
                ? "border-red-400"
                : "border-gray-300"
            }`}
          />

          <div className="mt-3 flex justify-between text-sm">

            <span
              className={
                customerId.length === 10
                  ? "text-green-600"
                  : "text-gray-600"
              }
            >
              {customerId.length === 10
                ? "✓ Customer ID is valid"
                : `${customerId.length}/10 digits`}
            </span>

            {customerId.length > 0 &&
              !customerIdIsValid && (
                <span className="text-red-600">
                  Enter exactly 10 digits
                </span>
              )}

          </div>

        </div>

      )}

      {/* NO GOOGLE ADS ACCOUNT */}

      {hasAccount === false && (

        <div className="mt-10 rounded-xl bg-gray-50 p-6">

          <h3 className="text-xl font-bold text-black">
            Create a Google Ads Account
          </h3>

          <p className="mt-3 text-gray-700">
            If you do not already have a Google Ads account,
            you will need to create one directly with Google
            before VidStandMedia can manage your advertising
            campaigns. Your Google Ads account will belong to
            you, and you will set up your billing and payment
            information directly with Google.
          </p>

          <p className="mt-4 text-gray-700">
            When creating your account, follow Google's setup
            instructions and complete the required account
            and billing information. After your account has
            been created, return to VidStandMedia and enter
            your 10-digit Google Ads Customer ID so we can
            connect your account and continue setting up
            your campaign.
          </p>

          <a
            href="https://ads.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-lg border border-red-600 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
          >
            Create Google Ads Account ↗
          </a>

          <p className="mt-4 text-sm leading-6 text-gray-600">
            Your Customer ID is a unique 10-digit number
            associated with your Google Ads account. You will
            need it to continue the VidStandMedia onboarding
            process.
          </p>

        </div>

      )}

      {/* NAVIGATION */}

      <div className="mt-14 flex justify-between">

        <Link
          href="/onboarding"
          className="rounded-xl border border-gray-300 px-8 py-4 font-semibold text-black transition hover:bg-gray-100"
        >
          Back
        </Link>

        <button
          type="button"
          onClick={handleContinue}
          disabled={continueDisabled}
          className="rounded-xl bg-red-600 px-10 py-4 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {loading
            ? "Saving..."
            : "Continue"}

        </button>

      </div>

    </div>

  </div>

</main>

);
}
