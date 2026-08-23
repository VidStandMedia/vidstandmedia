import Link from "next/link";
import { revalidatePath } from "next/cache";

import OnboardingProgress from "@/components/OnboardingProgress";

import {
  getCampaignSession,
} from "@/lib/session/campaign";

import {
  saveCampaignGoogleAds,
} from "@/app/actions/campaign";

export default async function ManagerAccessPage() {
  const session = await getCampaignSession();

  const googleAds = session.campaign.googleAds;

  async function sendManagerRequest() {
    "use server";

    await saveCampaignGoogleAds({
      ...googleAds,
      managerInvitationSent: true,
      managerAccessAccepted: false,
    });

    revalidatePath("/onboarding/manager-access");
  }

  return (
    <main className="bg-white py-24 px-6">
      <div className="mx-auto max-w-3xl">

        <OnboardingProgress currentStep="manager-access" />

        <h1 className="mt-10 text-center text-5xl font-bold text-black">
          Connect VidStandMedia to Your Google Ads Account
        </h1>

        <p className="mt-6 text-center text-lg text-gray-700">
          Your Google Ads account remains yours. You keep ownership
          and billing control while VidStandMedia manages your
          campaigns through manager access.
        </p>

        <div className="mt-14 rounded-2xl border border-gray-300 bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-black">
            Your Google Ads Account
          </h2>

          <div className="mt-6 space-y-4">

            <p className="text-lg text-black">
              <span className="font-semibold">
                Customer ID:
              </span>{" "}
              {googleAds.customerId || "Not entered"}
            </p>

            {googleAds.managerInvitationSent ? (
              <div className="rounded-xl border border-green-300 bg-green-50 p-5">

                <p className="font-semibold text-green-700">
                  ✓ Manager invitation requested
                </p>

                <p className="mt-3 text-gray-700">
                  VidStandMedia will send a manager access
                  invitation to your Google Ads account.
                  Accept the invitation in Google Ads to
                  continue.
                </p>

              </div>
            ) : (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">

                <p className="font-semibold text-black">
                  Next step:
                </p>

                <p className="mt-3 text-gray-700">
                  Request manager access so VidStandMedia
                  can create and manage your advertising
                  campaigns.
                </p>

              </div>
            )}

          </div>

          {!googleAds.managerInvitationSent && (
            <form
              action={sendManagerRequest}
              className="mt-8"
            >
              <button
                type="submit"
                className="w-full rounded-xl bg-red-600 px-8 py-4 font-semibold text-white transition hover:bg-red-700"
              >
                Request Manager Access
              </button>
            </form>
          )}

        </div>

        <div className="mt-8 rounded-2xl border border-gray-300 bg-white p-8">

          <h2 className="text-2xl font-bold text-black">
            What happens next?
          </h2>

          <div className="mt-5 space-y-3 text-gray-700">

            <p>
              ✓ You remain the owner of your Google Ads account.
            </p>

            <p>
              ✓ Google continues billing you directly.
            </p>

            <p>
              ✓ VidStandMedia manages campaign setup and optimization.
            </p>

            <p>
              ✓ Your advertising budget never passes through VidStandMedia.
            </p>

          </div>

        </div>

        <div className="mt-14 flex justify-between">

          <Link
            href="/onboarding/google-ads"
            className="rounded-xl border border-gray-300 px-8 py-4 font-semibold text-black transition hover:bg-gray-100"
          >
            Back
          </Link>

          <Link
            href="/onboarding/business-information"
            className={`rounded-xl px-10 py-4 font-semibold text-white transition ${
              googleAds.managerInvitationSent
                ? "bg-red-600 hover:bg-red-700"
                : "pointer-events-none bg-gray-300"
            }`}
          >
            Continue
          </Link>

        </div>

      </div>
    </main>
  );
}