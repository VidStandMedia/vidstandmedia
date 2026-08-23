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
              We could not find the Stripe payment
              session.
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

        body: JSON.stringify({
          sessionId,
        }),

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
              Your Stripe payment may have been
              successful, but we were unable to
              verify the payment at this time.
            </p>

            <p className="mt-3 text-gray-700">
              Please do not submit another payment.
              Contact VidStandMedia if you need
              assistance.
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
        <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <span className="text-4xl text-green-600">
                ✓
              </span>
            </div>

            <h1 className="mt-8 text-4xl font-bold text-black">
              Payment Successful
            </h1>

            <p className="mt-5 text-lg text-gray-700">
              Thank you. Your VidStandMedia campaign
              management subscription has been
              successfully activated.
            </p>

          </div>

          <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">

            <h2 className="text-xl font-bold text-black">
              Your Management Subscription
            </h2>

            <div className="mt-5 space-y-4">

              <div className="flex justify-between gap-4">
                <span className="text-gray-600">
                  Service
                </span>

                <span className="font-semibold text-black">
                  Campaign Management
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-600">
                  Management Fee
                </span>

                <span className="font-semibold text-black">
                  $99.00/month
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-600">
                  Payment Status
                </span>

                <span className="font-semibold text-green-600">
                  Paid
                </span>
              </div>

            </div>

          </div>

          <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">

            <h2 className="text-xl font-bold text-black">
              What happens next?
            </h2>

            <div className="mt-4 space-y-3 text-gray-700">

              <p>
                ✓ Your VidStandMedia management
                subscription is active.
              </p>

              <p>
                ✓ Your Google Ads advertising budget
                remains separate from this payment.
              </p>

              <p>
                ✓ Google will continue to bill your
                Google Ads account directly for
                advertising charges.
              </p>

              <p>
                ✓ Your campaign setup is complete.
              </p>

              <p>
                ✓ You can now manage your campaign
                from your VidStandMedia dashboard.
              </p>

            </div>

          </div>

          <div className="mt-10 text-center">

            <Link
  href="/dashboard"
  className="inline-flex rounded-xl bg-red-600 px-10 py-4 font-semibold text-white transition hover:bg-red-700"
>
  Continue to Dashboard
</Link>

          </div>

        </div>
      </div>
    </main>
  );
}