import Link from "next/link";

type PaymentSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-3xl font-bold text-black">
              Payment Confirmation
            </h1>

            <p className="mt-4 text-gray-700">
              We could not find the Stripe payment session.
            </p>

            <Link
              href="/onboarding/payment"
              className="mt-8 inline-flex rounded-xl bg-red-600 px-8 py-4 font-semibold text-white transition hover:bg-red-700"
            >
              Return to Payment
            </Link>
          </div>
        </div>
      </main>
    );
  }

  let verificationError = "";

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/stripe/verify-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      verificationError =
        result?.error ||
        "Unable to verify your payment.";
    }
  } catch (error) {
    console.error(
      "Payment success verification request failed:",
      error
    );

    verificationError =
      "Unable to verify your payment at this time.";
  }

  if (verificationError) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-3xl font-bold text-black">
              We Couldn't Confirm Your Payment
            </h1>

            <p className="mt-4 text-gray-700">
              Your Stripe payment may have been successful,
              but we were unable to verify it at this time.
            </p>

            <p className="mt-3 text-gray-700">
              Please do not submit another payment.
              Contact VidStandMedia if you need assistance.
            </p>

            <Link
              href="/onboarding/payment"
              className="mt-8 inline-flex rounded-xl border border-gray-300 px-8 py-4 font-semibold text-black transition hover:bg-gray-100"
            >
              Return to Payment
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">

          {/* Payment Confirmation */}

          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <span className="text-4xl font-bold text-green-600">
                ✓
              </span>
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-green-700">
              Payment Confirmed
            </p>

            <h1 className="mt-2 text-3xl font-bold text-black sm:text-4xl">
              Welcome to VidStandMedia!
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-700">
              Thank you for choosing VidStandMedia.
              Your campaign management subscription payment
              has been confirmed. We will guide you through
              the final step needed to get your campaign
              management underway.
            </p>
          </div>

          {/* Subscription Summary */}

          <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-bold text-black">
              Your Subscription Summary
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <span className="text-gray-600">
                  Service
                </span>
                <span className="text-right font-semibold text-black">
                  Campaign Management
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-gray-600">
                  Management Fee
                </span>
                <span className="text-right font-semibold text-black">
                  $99.00/month
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-gray-600">
                  Payment Status
                </span>
                <span className="font-semibold text-green-700">
                  Paid
                </span>
              </div>
            </div>

            <p className="mt-5 border-t border-gray-200 pt-4 text-sm leading-6 text-gray-600">
              Your management fee is separate from your
              Google Ads advertising budget. Google bills
              your Google Ads account directly for
              advertising charges.
            </p>
          </div>

          {/* What Happens Next */}

          <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-black">
              What happens next?
            </h2>

            <p className="mt-3 leading-7 text-gray-700">
              There is just one important step remaining
              before we can manage your Google Ads campaigns:
              approving our manager access invitation.
            </p>

            <div className="mt-6 space-y-6">

              {/* Step 1 */}

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                  1
                </div>

                <div>
                  <h3 className="font-bold text-black">
                    Watch for your manager access invitation
                  </h3>

                  <p className="mt-2 leading-7 text-gray-700">
                    VidStandMedia will send a Google Ads
                    manager access invitation within 48 hours
                    of your payment.
                  </p>
                </div>
              </div>

              {/* Step 2 */}

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                  2
                </div>

                <div>
                  <h3 className="font-bold text-black">
                    Approve manager access
                  </h3>

                  <p className="mt-2 leading-7 text-gray-700">
                    Follow the instructions in the Google Ads
                    invitation to approve VidStandMedia's
                    request to manage your campaigns.
                  </p>
                </div>
              </div>

              {/* Step 3 */}

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                  3
                </div>

                <div>
                  <h3 className="font-bold text-black">
                    We'll prepare to manage your campaign
                  </h3>

                  <p className="mt-2 leading-7 text-gray-700">
                    Once the required access is approved,
                    VidStandMedia can proceed with your campaign
                    management according to your selected
                    campaign settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 rounded-xl border border-blue-200 bg-white p-4">
              <p className="text-sm leading-6 text-gray-700">
                <strong>Important:</strong> Please keep your
                Google Ads account active and check your email
                for the invitation. Your advertising budget
                continues to be billed directly by Google,
                separately from your VidStandMedia management fee.
              </p>
            </div>
          </div>

          {/* Dashboard Navigation */}

          <div className="mt-10 text-center">
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-10 py-4 font-semibold text-white transition hover:bg-red-700 sm:w-auto"
            >
              Continue to Dashboard
            </Link>

            <p className="mt-4 text-sm text-gray-500">
              Thank you for trusting VidStandMedia with your
              campaign management.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
