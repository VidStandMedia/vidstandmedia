
"use client";

import { useEffect, useState } from "react";

type Campaign = {
  id: string;
  goal: string;
  budget: string;
  createdAt: string;
  updatedAt: string;

  channel: {
    youtubeChannelId: string;
    title: string;
    thumbnail: string | null;
    email: string | null;
  } | null;

  googleAds: {
    hasAccount: boolean | null;
    customerId: string | null;
    accountName: string | null;
    currency: string | null;
    timeZone: string | null;
    verified: boolean;
    managerInvitationSent: boolean;
    managerAccessAccepted: boolean;
  } | null;

  business: {
    clientType: string;
    companyName: string | null;
    website: string | null;
    category: string | null;
    timeZone: string | null;
  } | null;

  video: {
    youtubeVideoId: string;
    title: string;
    thumbnail: string | null;
    publishedAt: string | null;
    viewCount: number | null;
    duration: string | null;
    privacyStatus: string | null;
  } | null;

  audience: {
    country: string | null;
    language: string | null;
    gender: string | null;
    ageGroups: string[];
    interests: string[];
  } | null;

  agreement: {
    termsAccepted: boolean;
    privacyAccepted: boolean;
    advertisingAuthorized: boolean;
    acceptedAt: string | null;
  } | null;

  payment: {
    managementFee: string;
    managementPlan: string;
    paymentStatus: string;
    paidAt: string | null;
    createdAt: string;
  } | null;
};

type Creator = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: string;
  youtube_channel_name: string;
  youtube_channel_id: string | null;
  youtube_profile_image: string | null;
  campaign: Campaign | null;
};

function Info({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-gray-950">
        {value === null || value === undefined || value === ""
          ? "Not provided"
          : value}
      </p>
    </div>
  );
}

function Status({
  label,
  value,
}: {
  label: string;
  value: boolean | null | undefined;
}) {
  const text =
    value === null || value === undefined
      ? "Not provided"
      : value
        ? "Yes"
        : "No";

  return <Info label={label} value={text} />;
}

export default function AdminPage() {
  const [users, setUsers] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch("/api/users", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Unable to load creators.");
        }

        setUsers(data.data);
      } catch (error) {
        console.error("USERS ERROR:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load creators."
        );
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const campaigns = users.filter((user) => user.campaign).length;

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-gray-950 md:p-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-950 md:text-4xl">
          Agency Dashboard
        </h1>

        <p className="mb-8 text-gray-700">
          Manage creator accounts and review their advertising campaign
          information.
        </p>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-700">
              Total Creators
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-950">
              {users.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-700">
              Creators With Campaigns
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-950">
              {campaigns}
            </p>
          </div>
        </div>

        {loading && (
          <p className="font-medium text-gray-800">
            Loading creators...
          </p>
        )}

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 p-4 font-medium text-red-800">
            {error}
          </p>
        )}

        {!loading && !error && users.length === 0 && (
          <p className="font-medium text-gray-800">
            No creators found.
          </p>
        )}

        {!loading && users.length > 0 && (
          <div className="space-y-5">
            {users.map((user) => {
              const campaign = user.campaign;
              const isExpanded = expandedUser === user.id;

              return (
                <section
                  key={user.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      {user.youtube_profile_image ? (
                        <img
                          src={user.youtube_profile_image}
                          alt="Creator profile"
                          className="h-14 w-14 rounded-full border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-xl font-bold text-gray-800">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h2 className="text-lg font-bold text-gray-950">
                          {user.youtube_channel_name}
                        </h2>

                        <p className="text-sm font-medium text-gray-700">
                          {user.name || "Name not provided"}
                        </p>

                        <p className="text-sm text-gray-700">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:items-end">
                      <p className="text-sm font-semibold text-gray-800">
                        {campaign
                          ? `${campaign.goal} · ${campaign.budget}`
                          : "No campaign started"}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedUser(
                            isExpanded ? null : user.id
                          )
                        }
                        className="rounded-lg bg-green-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
                      >
                        {isExpanded
                          ? "Hide Campaign Details"
                          : "View Campaign Details"}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-white p-5 md:p-7">
                      {!campaign ? (
                        <p className="font-medium text-gray-700">
                          This creator has not completed campaign onboarding.
                        </p>
                      ) : (
                        <div className="space-y-8">
                          <section>
                            <h3 className="mb-4 text-xl font-bold text-gray-950">
                              Campaign Overview
                            </h3>

                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              <Info
                                label="Campaign Goal"
                                value={campaign.goal}
                              />

                              <Info
                                label="Weekly Budget"
                                value={campaign.budget}
                              />

                              <Info
                                label="Campaign Created"
                                value={new Date(
                                  campaign.createdAt
                                ).toLocaleDateString()}
                              />
                            </div>
                          </section>

                          <section>
                            <h3 className="mb-4 text-xl font-bold text-gray-950">
                              Creator & YouTube Channel
                            </h3>

                            <div className="grid gap-3 sm:grid-cols-2">
                              <Info
                                label="Creator Name"
                                value={user.name}
                              />

                              <Info
                                label="Email"
                                value={user.email}
                              />

                              <Info
                                label="Channel Name"
                                value={campaign.channel?.title}
                              />

                              <Info
                                label="Channel ID"
                                value={campaign.channel?.youtubeChannelId}
                              />
                            </div>
                          </section>

                          <section>
                            <h3 className="mb-4 text-xl font-bold text-gray-950">
                              Google Ads Account
                            </h3>

                            {campaign.googleAds ? (
                              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                <Status
                                  label="Has Google Ads Account"
                                  value={campaign.googleAds.hasAccount}
                                />

                                <Info
                                  label="Google Ads Customer ID"
                                  value={campaign.googleAds.customerId}
                                />

                                <Info
                                  label="Account Name"
                                  value={campaign.googleAds.accountName}
                                />

                                <Info
                                  label="Currency"
                                  value={campaign.googleAds.currency}
                                />

                                <Info
                                  label="Time Zone"
                                  value={campaign.googleAds.timeZone}
                                />

                                <Status
                                  label="Account Verified"
                                  value={campaign.googleAds.verified}
                                />

                                <Status
                                  label="Manager Invitation Sent"
                                  value={campaign.googleAds.managerInvitationSent}
                                />

                                <Status
                                  label="Manager Access Accepted"
                                  value={campaign.googleAds.managerAccessAccepted}
                                />
                              </div>
                            ) : (
                              <p className="font-medium text-gray-700">
                                Google Ads information not provided.
                              </p>
                            )}
                          </section>

                          <section>
                            <h3 className="mb-4 text-xl font-bold text-gray-950">
                              Selected YouTube Video
                            </h3>

                            {campaign.video ? (
                              <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row">
                                {campaign.video.thumbnail && (
                                  <img
                                    src={campaign.video.thumbnail}
                                    alt={campaign.video.title}
                                    className="w-full rounded-lg object-cover sm:w-56"
                                  />
                                )}

                                <div className="space-y-3">
                                  <p className="font-bold text-gray-950">
                                    {campaign.video.title}
                                  </p>

                                  <Info
                                    label="Video ID"
                                    value={campaign.video.youtubeVideoId}
                                  />

                                  <Info
                                    label="Views When Selected"
                                    value={campaign.video.viewCount}
                                  />

                                  <Info
                                    label="Privacy"
                                    value={campaign.video.privacyStatus}
                                  />

                                  <a
                                    href={`https://www.youtube.com/watch?v=${campaign.video.youtubeVideoId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block text-sm font-bold text-green-800 hover:text-green-950 hover:underline"
                                  >
                                    Open YouTube Video
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <p className="font-medium text-gray-700">
                                No video selected.
                              </p>
                            )}
                          </section>

                          <section>
                            <h3 className="mb-4 text-xl font-bold text-gray-950">
                              Target Audience
                            </h3>

                            {campaign.audience ? (
                              <>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                  <Info
                                    label="Country"
                                    value={campaign.audience.country}
                                  />

                                  <Info
                                    label="Language"
                                    value={campaign.audience.language}
                                  />

                                  <Info
                                    label="Gender"
                                    value={campaign.audience.gender}
                                  />
                                </div>

                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                  <Info
                                    label="Age Groups"
                                    value={campaign.audience.ageGroups.join(", ")}
                                  />

                                  <Info
                                    label="Interests"
                                    value={campaign.audience.interests.join(", ")}
                                  />
                                </div>
                              </>
                            ) : (
                              <p className="font-medium text-gray-700">
                                Audience information not provided.
                              </p>
                            )}
                          </section>

                          <section>
                            <h3 className="mb-4 text-xl font-bold text-gray-950">
                              Business Information
                            </h3>

                            {campaign.business ? (
                              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                <Info
                                  label="Client Type"
                                  value={campaign.business.clientType}
                                />

                                <Info
                                  label="Business Name"
                                  value={campaign.business.companyName}
                                />

                                <Info
                                  label="Website"
                                  value={campaign.business.website}
                                />

                                <Info
                                  label="Category"
                                  value={campaign.business.category}
                                />

                                <Info
                                  label="Time Zone"
                                  value={campaign.business.timeZone}
                                />
                              </div>
                            ) : (
                              <p className="font-medium text-gray-700">
                                Business information not provided.
                              </p>
                            )}
                          </section>

                          <section>
                            <h3 className="mb-4 text-xl font-bold text-gray-950">
                              Agreement & Authorization
                            </h3>

                            {campaign.agreement ? (
                              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                <Status
                                  label="Terms Accepted"
                                  value={campaign.agreement.termsAccepted}
                                />

                                <Status
                                  label="Privacy Policy Accepted"
                                  value={campaign.agreement.privacyAccepted}
                                />

                                <Status
                                  label="Advertising Authorized"
                                  value={campaign.agreement.advertisingAuthorized}
                                />

                                <Info
                                  label="Accepted Date"
                                  value={
                                    campaign.agreement.acceptedAt
                                      ? new Date(
                                          campaign.agreement.acceptedAt
                                        ).toLocaleString()
                                      : null
                                  }
                                />
                              </div>
                            ) : (
                              <p className="font-medium text-gray-700">
                                Agreement information not available.
                              </p>
                            )}
                          </section>

                          <section>
                            <h3 className="mb-4 text-xl font-bold text-gray-950">
                              Payment & Management Plan
                            </h3>

                            {campaign.payment ? (
                              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                <Info
                                  label="Management Fee"
                                  value={`$${campaign.payment.managementFee}`}
                                />

                                <Info
                                  label="Management Plan"
                                  value={campaign.payment.managementPlan}
                                />

                                <Info
                                  label="Payment Status"
                                  value={campaign.payment.paymentStatus}
                                />

                                <Info
                                  label="Paid Date"
                                  value={
                                    campaign.payment.paidAt
                                      ? new Date(
                                          campaign.payment.paidAt
                                        ).toLocaleString()
                                      : "Not paid"
                                  }
                                />
                              </div>
                            ) : (
                              <p className="font-medium text-gray-700">
                                No payment record found.
                              </p>
                            )}
                          </section>

                          <div className="border-t border-gray-200 pt-5">
                            <p className="text-xs font-medium text-gray-700">
                              Campaign ID: {campaign.id}
                            </p>

                            <p className="mt-1 text-xs font-medium text-gray-700">
                              Last Updated:{" "}
                              {new Date(
                                campaign.updatedAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
