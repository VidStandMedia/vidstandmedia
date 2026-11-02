
import Link from "next/link";

import { getCampaign } from "@/app/actions/campaign";

function formatCustomerId(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 10) {
    return value || "Not provided";
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function StatusBadge({
  children,
  color = "gray",
}: {
  children: React.ReactNode;
  color?: "green" | "yellow" | "gray" | "red";
}) {
  const colors = {
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    gray: "bg-gray-100 text-gray-700",
    red: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colors[color]}`}
    >
      {children}
    </span>
  );
}

function DashboardCard({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
          {icon}
        </div>

        <h2 className="text-xl font-bold text-black">
          {title}
        </h2>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 py-3 last:border-0">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="break-words font-semibold text-gray-900">
        {value || "Not provided"}
      </span>
    </div>
  );
}

export default async function DashboardPage() {
  const campaign = await getCampaign();

  const hasChannel = Boolean(campaign.channel.id);
  const hasVideo = Boolean(campaign.video.id);
  const hasGoal = Boolean(campaign.goal);
  const hasBudget = Boolean(campaign.budget);
  const hasCustomerId = Boolean(campaign.googleAds.customerId);

  const managerAccessAccepted =
    campaign.googleAds.managerAccessAccepted;

  const paymentStatus =
    campaign.payment.paymentStatus;

  const subscriptionPaid =
    paymentStatus?.toLowerCase() === "paid" ||
    paymentStatus?.toLowerCase() === "active";

  const setupComplete =
    hasChannel &&
    hasVideo &&
    hasGoal &&
    hasBudget &&
    hasCustomerId;

  const campaignReady =
    setupComplete && managerAccessAccepted;

  const videoUrl = hasVideo
    ? `https://www.youtube.com/watch?v=${campaign.video.id}`
    : "";

  return (
    <main className="min-h-screen bg-[#071B35] px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">

        {/* Client Portal Header */}

        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">

          <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
            Client Portal
          </h2>

          <h1 className="mt-3 text-2xl font-bold text-gray-800 sm:text-3xl">
            VidStandMedia Dashboard
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Welcome to your campaign dashboard. Here you
            can review your campaign information and
            monitor your campaign management progress.
          </p>

        </div>

        {/* Campaign Management Progress */}

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <h2 className="text-2xl font-bold text-black">
            Campaign Management Progress
          </h2>

          <p className="mt-2 text-gray-600">
            Follow your campaign's progress as we work
            toward getting your promotion underway.
          </p>

          <div className="mt-8 space-y-6">

            {/* Step 1 */}

            <div className="flex items-start gap-4">

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  setupComplete
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {setupComplete ? "✓" : "1"}
              </div>

              <div>
                <h3 className="font-bold text-black">
                  Campaign Information Submitted
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Your YouTube channel, promotion goal,
                  budget, video, and audience settings
                  have been saved.
                </p>

                <div className="mt-2">
                  <StatusBadge color={setupComplete ? "green" : "yellow"}>
                    {setupComplete ? "Completed" : "Incomplete"}
                  </StatusBadge>
                </div>
              </div>

            </div>

            {/* Step 2 */}

            <div className="flex items-start gap-4">

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  managerAccessAccepted
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {managerAccessAccepted ? "✓" : "2"}
              </div>

              <div>
                <h3 className="font-bold text-black">
                  Google Ads Manager Access
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  VidStandMedia will send a manager access
                  invitation within 48 hours of payment.
                  You will need to approve the invitation
                  to grant us access to your Google Ads account.
                </p>

                <div className="mt-2">
                  {managerAccessAccepted ? (
                    <StatusBadge color="green">
                      Access Approved
                    </StatusBadge>
                  ) : (
                    <StatusBadge color="yellow">
                      Invitation Not Yet Sent
                    </StatusBadge>
                  )}
                </div>
              </div>

            </div>

            {/* Step 3 */}

            <div className="flex items-start gap-4">

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  campaignReady
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {campaignReady ? "✓" : "3"}
              </div>

              <div>
                <h3 className="font-bold text-black">
                  Campaign Management
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Once the required Google Ads access is
                  approved, VidStandMedia can proceed
                  with managing your campaign.
                </p>

                <div className="mt-2">
                  <StatusBadge color={campaignReady ? "green" : "gray"}>
                    {campaignReady
                      ? "Ready for Management"
                      : "Awaiting Access"}
                  </StatusBadge>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* YouTube Channel */}

        <div className="mt-8">

          <DashboardCard
            title="YouTube Channel"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
              </svg>
            }
          >

            <Detail
              label="Channel Name"
              value={
                hasChannel
                  ? campaign.channel.title
                  : "No channel connected"
              }
            />

            <Detail
              label="YouTube Channel ID"
              value={campaign.channel.id}
            />

            <div className="mt-5">
              {hasChannel ? (
                <StatusBadge color="green">
                  YouTube Channel Connected
                </StatusBadge>
              ) : (
                <StatusBadge color="yellow">
                  Channel Not Connected
                </StatusBadge>
              )}
            </div>

            {/* Selected Video */}

            <div className="mt-8 border-t border-gray-200 pt-6">

              <h3 className="text-lg font-bold text-black">
                Selected Video
              </h3>

              {hasVideo ? (

                <div className="mt-4 flex flex-col gap-4 sm:flex-row">

                  {campaign.video.thumbnail && (
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block shrink-0"
                    >
                      <img
                        src={campaign.video.thumbnail}
                        alt={campaign.video.title || "Selected YouTube video"}
                        className="aspect-video w-full rounded-xl object-cover sm:w-56"
                      />
                    </a>
                  )}

                  <div className="flex flex-col justify-center">

                    <h4 className="font-bold leading-6 text-black">
                      {campaign.video.title || "Selected YouTube video"}
                    </h4>

                    <p className="mt-2 text-sm text-gray-500">
                      Video ID: {campaign.video.id}
                    </p>

                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex font-semibold text-red-600 hover:text-red-700"
                    >
                      Watch Selected Video →
                    </a>

                  </div>

                </div>

              ) : (

                <p className="mt-3 text-sm text-gray-600">
                  No YouTube video has been selected.
                </p>

              )}

            </div>

          </DashboardCard>

        </div>

        {/* Campaign Overview */}

        <div className="mt-8">

          <DashboardCard
            title="Campaign Overview"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            }
          >

            <Detail
              label="Promotion Goal"
              value={campaign.goal}
            />

            <Detail
              label="Weekly Advertising Budget"
              value={campaign.budget}
            />

            <Detail
              label="Target Country"
              value={campaign.audience.country}
            />

            <Detail
              label="Target Language"
              value={campaign.audience.language}
            />

          </DashboardCard>

        </div>

        {/* Google Ads Account */}

        <div className="mt-8">

          <DashboardCard
            title="Google Ads Account"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M8 9h8M8 13h5" />
                <path d="m15 17 2 2 4-4" />
              </svg>
            }
          >

            <Detail
              label="Google Ads Customer ID"
              value={formatCustomerId(
                campaign.googleAds.customerId || ""
              )}
            />

            <div className="border-b border-gray-100 py-3">

              <span className="text-sm text-gray-500">
                Manager Invitation
              </span>

              <div className="mt-2">
                {managerAccessAccepted ? (
                  <StatusBadge color="green">
                    Access Approved
                  </StatusBadge>
                ) : (
                  <StatusBadge color="yellow">
                    Not Yet Sent
                  </StatusBadge>
                )}
              </div>

            </div>

            <div className="py-3">

              <span className="text-sm text-gray-500">
                Manager Access
              </span>

              <div className="mt-2">
                {managerAccessAccepted ? (
                  <StatusBadge color="green">
                    Access Approved
                  </StatusBadge>
                ) : (
                  <StatusBadge color="yellow">
                    Awaiting Approval
                  </StatusBadge>
                )}
              </div>

            </div>

            {!managerAccessAccepted && (
              <p className="mt-3 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-gray-700">
                VidStandMedia will send your Google Ads
                manager access invitation within 48 hours
                of payment. Please follow the invitation
                instructions to approve access.
              </p>
            )}

          </DashboardCard>

        </div>

        {/* Management Subscription */}

        <div className="mt-8">

          <DashboardCard
            title="Management Subscription"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
            }
          >

            <Detail
              label="Service"
              value="Campaign Management"
            />

            <Detail
              label="Monthly Management Fee"
              value={`$${campaign.payment.managementFee || 99}/month`}
            />

            <div className="border-b border-gray-100 py-3">

              <span className="text-sm text-gray-500">
                Payment Status
              </span>

              <div className="mt-2">
                {subscriptionPaid ? (
                  <StatusBadge color="green">
                    Paid
                  </StatusBadge>
                ) : (
                  <StatusBadge color="yellow">
                    {paymentStatus || "Payment Pending"}
                  </StatusBadge>
                )}
              </div>

            </div>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              Your management subscription is separate
              from your Google Ads advertising budget.
              Google bills your advertising account
              directly for advertising charges.
            </p>

          </DashboardCard>

        </div>

        {/* Support */}

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">

          <h2 className="text-xl font-bold text-black">
            Need Help?
          </h2>

          <p className="mt-3 text-gray-600">
            Have questions about your campaign or Google Ads
            manager access? We're here to help.
          </p>

          <a
            href="mailto:support@vidstandmedia.com"
            className="mt-5 inline-flex rounded-xl border border-gray-300 px-6 py-3 font-semibold text-black transition hover:bg-gray-100"
          >
            Contact Support
          </a>

        </section>

        {/* Footer */}

        <div className="mt-10 text-center text-sm text-gray-300">
          © {new Date().getFullYear()} VidStandMedia. All rights reserved.
        </div>

      </div>
    </main>
  );
}
