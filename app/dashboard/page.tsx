export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">

        <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">

          <h1 className="text-4xl font-bold text-black">
            VidStandMedia Dashboard
          </h1>

          <p className="mt-4 text-lg text-gray-700">
            Welcome to your VidStandMedia campaign dashboard.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-xl font-bold text-black">
                Campaign
              </h2>

              <p className="mt-3 text-gray-600">
                Your campaign setup and management information will appear here.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-xl font-bold text-black">
                Google Ads
              </h2>

              <p className="mt-3 text-gray-600">
                Your Google Ads account and campaign information will appear here.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-xl font-bold text-black">
                Subscription
              </h2>

              <p className="mt-3 text-gray-600">
                Your VidStandMedia management subscription information will appear here.
              </p>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}