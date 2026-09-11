import Link from "next/link";
import { redirect } from "next/navigation";

import OnboardingProgress from "@/components/OnboardingProgress";

import {
  getCampaign,
  saveCampaignGoogleAds,
} from "@/app/actions/campaign";

export default async function ManagerAccessPage() {
  const campaign = await getCampaign();

  const googleAds = campaign.googleAds;

  async function continueToBusinessInformation() {
    "use server";

    await saveCampaignGoogleAds({
      ...googleAds,
      managerInvitationSent: true,
      managerAccessAccepted: false,
    });

    redirect("/onboarding/business-information");
  }

  return (
    <main className="bg-white px-6 py-24">
      <div className="mx-auto max-w-3xl">

        <OnboardingProgress currentStep="manager-access" />

        {/* PAGE HEADER */}

        <div className="mt-10 text-center">
          <h1 className="text-5xl font-bold leading-tight text-black">
            Connect VidStandMedia to Your Google Ads Account
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-700">
            VidStandMedia will manage your advertising campaigns
            through our Google Ads Manager Account. You will still
            own your Google Ads account and remain in control of
            your billing and payment information.
          </p>
        </div>

        {/* GOOGLE ADS ACCOUNT */}

        <div className="mt-12 rounded-2xl border border-gray-300 bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-black">
            Your Google Ads Account
          </h2>

          <div className="mt-5 rounded-xl bg-gray-100 p-5">
            <p className="text-lg text-black">
              <span className="font-semibold">
                Customer ID:
              </span>{" "}
              {googleAds.customerId
                ? googleAds.customerId.replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    "$1-$2-$3"
                  )
                : "Not entered"}
            </p>
          </div>

          {/* HOW MANAGER ACCESS WORKS */}

          <div className="mt-8">
            <h3 className="text-xl font-bold text-black">
              How Manager Access Works
            </h3>

            <p className="mt-4 leading-7 text-gray-700">
              VidStandMedia will manage your Google Ads campaigns through our Google Ads Manager Account. You keep ownership of your Google Ads account and remain in control of your payment information.
            </p>

            <p className="mt-4 leading-7 text-gray-700">
              Your Campaign Management Fee is paid to VidStandMedia and is separate from your Advertising Budget, which is paid directly to Google. Your advertising budget does not pass through VidStandMedia.
            </p>

            <p className="mt-4 leading-7 text-gray-700">
              After your Campaign Management Fee is paid, we will send a manager access invitation to the Google Ads Customer ID you provided. Once access is approved, VidStandMedia can set up, manage, monitor, and optimize your campaigns based on your goals and budget.
            </p>

          </div>

          {/* WHAT YOU NEED TO DO */}

          <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">
            <h3 className="text-lg font-bold text-black">
              What You Need to Do
            </h3>

            <ol className="mt-4 space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="font-bold text-black">1.</span>
                <span>
                  Complete the Campaign Setup and pay your Campaign Management Fee. VidStandMedia will send your manager access invitation within 48 hours of payment.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="font-bold text-black">2.</span>
                <span>
                  Check your Google Ads account. Sign in using the Google account that has access to the Customer ID you provided.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="font-bold text-black">3.</span>
                <span>
                  Approve manager access. Follow the instructions in the invitation to give VidStandMedia access to manage your campaigns.
                </span>
              </li>
            </ol>
          </div>

        </div>

        {/* NAVIGATION */}

        <div className="mt-14 flex items-center justify-between">

          <Link
            href="/onboarding/google-ads"
            className="rounded-xl border border-gray-300 px-8 py-4 font-semibold text-black transition hover:bg-gray-100"
          >
            Back
          </Link>

          <form action={continueToBusinessInformation}>
            <button
              type="submit"
              className="rounded-xl bg-red-600 px-10 py-4 font-semibold text-white transition hover:bg-red-700"
            >
              Continue
            </button>
          </form>

        </div>

      </div>
    </main>
  );
}