"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import OnboardingProgress from "@/components/OnboardingProgress";
import { saveCampaignBusiness } from "@/app/actions/campaign";

type BusinessInformationClientProps = {
  initialBusiness: {
    clientType: "business" | "creator";
    companyName: string;
    website: string;
    category: string;
    timeZone: string;
  };
};

type ClientType = "business" | "creator";

export default function BusinessInformationClient({
  initialBusiness,
}: BusinessInformationClientProps) {
  const router = useRouter();

  const [clientType, setClientType] =
    useState<ClientType>(
      initialBusiness.clientType
    );

  const [companyName, setCompanyName] = useState(
    initialBusiness.companyName
  );

  const [website, setWebsite] = useState(
    initialBusiness.website
  );

  const [category, setCategory] = useState(
    initialBusiness.category
  );

  const [timeZone, setTimeZone] = useState(
    initialBusiness.timeZone
  );

  const [loading, setLoading] = useState(false);

  function handleClientTypeChange(type: ClientType) {
    setClientType(type);
  }

  async function handleContinue() {
    const name = companyName.trim();
    const site = website.trim();
    const clientCategory = category.trim();
    const zone = timeZone.trim();

    if (
      name === "" ||
      clientCategory === "" ||
      zone === ""
    ) {
      return;
    }

    if (clientType === "business" && site === "") {
      return;
    }

    setLoading(true);

    try {
      await saveCampaignBusiness({
        clientType,
        companyName: name,
        website: site,
        category: clientCategory,
        timeZone: zone,
      });

      router.push("/onboarding/goals");
    } catch (error) {
      console.error(
        "Failed to save business information:",
        error
      );

      setLoading(false);
    }
  }

  const nameLabel =
    clientType === "business"
      ? "Company Name"
      : "Your Name";

  const nameDescription =
    clientType === "business"
      ? "Enter the name of your business or organization."
      : "Enter your name or the name you use as a creator.";

  const namePlaceholder =
    clientType === "business"
      ? "Your Company Name"
      : "Your Name";

  const websiteLabel =
    clientType === "business"
      ? "Business Website"
      : "Website (Optional)";

  const websiteDescription =
    clientType === "business"
      ? "Enter the website customers use to learn more about your business."
      : "If you have a website, enter the website where viewers can learn more about you or your channel.";

  const categoryLabel =
    clientType === "business"
      ? "Business Category"
      : "Creator Category / Niche";

  const categoryDescription =
    clientType === "business"
      ? "What type of business or organization do you operate?"
      : "What type of content do you create?";

  const categoryPlaceholder =
    clientType === "business"
      ? "e.g. Healthcare, Retail, Education"
      : "e.g. Gaming, Finance, Education, Entertainment";

  const timeZoneDescription =
    clientType === "business"
      ? "Select the time zone your business operates in."
      : "Select the time zone you operate in.";

  const isContinueDisabled =
    loading ||
    companyName.trim() === "" ||
    category.trim() === "" ||
    timeZone.trim() === "" ||
    (clientType === "business" &&
      website.trim() === "");

  return (
    <main className="bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl">

        <OnboardingProgress
          currentStep="business-information"
        />

        {/* PAGE HEADER */}

        <h1 className="mt-10 text-center text-5xl font-bold text-black">
          Tell Us About You
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-gray-700">
          Whether you represent a business or run a YouTube
          channel as an individual creator, this information
          helps us understand your audience and build the right
          advertising campaign for you.
        </p>

        {/* CLIENT TYPE */}

        <div className="mt-12 rounded-2xl border border-gray-300 bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-black">
            What Best Describes You?
          </h2>

          <p className="mt-2 text-gray-600">
            Select the option that best describes who you are.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            {/* BUSINESS */}

            <button
              type="button"
              onClick={() =>
                handleClientTypeChange("business")
              }
              className={`rounded-xl border-2 p-6 text-left transition ${
                clientType === "business"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-300 bg-white hover:border-green-400 hover:bg-green-50"
              }`}
            >
              <div className="flex items-start gap-4">

                <div
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    clientType === "business"
                      ? "border-green-600"
                      : "border-gray-400"
                  }`}
                >
                  {clientType === "business" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-black">
                    I represent a business or organization
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    I am advertising a business, organization,
                    product, or service.
                  </p>
                </div>

              </div>
            </button>

            {/* CREATOR */}

            <button
              type="button"
              onClick={() =>
                handleClientTypeChange("creator")
              }
              className={`rounded-xl border-2 p-6 text-left transition ${
                clientType === "creator"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-300 bg-white hover:border-green-400 hover:bg-green-50"
              }`}
            >
              <div className="flex items-start gap-4">

                <div
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    clientType === "creator"
                      ? "border-green-600"
                      : "border-gray-400"
                  }`}
                >
                  {clientType === "creator" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-black">
                    I am a YouTube creator
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    I am an individual creator promoting my
                    YouTube channel and videos.
                  </p>
                </div>

              </div>
            </button>

          </div>
        </div>

        {/* INFORMATION FORM */}

        <div className="mt-8 rounded-2xl border border-gray-300 bg-white p-8 shadow-sm">

          <div className="space-y-8">

            {/* NAME */}

            <div>
              <label
                htmlFor="companyName"
                className="block text-lg font-semibold text-black"
              >
                {nameLabel}
              </label>

              <p className="mt-2 text-sm text-gray-600">
                {nameDescription}
              </p>

              <input
                id="companyName"
                type="text"
                value={companyName}
                maxLength={150}
                onChange={(e) =>
                  setCompanyName(e.target.value)
                }
                placeholder={namePlaceholder}
                autoComplete={
                  clientType === "business"
                    ? "organization"
                    : "name"
                }
                className="mt-4 w-full rounded-xl border border-gray-300 px-5 py-4 text-black outline-none focus:border-green-600"
              />

              <p className="mt-2 text-right text-sm text-gray-500">
                {companyName.length}/150
              </p>
            </div>

            {/* WEBSITE */}

            <div>
              <label
                htmlFor="website"
                className="block text-lg font-semibold text-black"
              >
                {websiteLabel}
              </label>

              <p className="mt-2 text-sm text-gray-600">
                {websiteDescription}
              </p>

              <input
                id="website"
                type="url"
                value={website}
                maxLength={150}
                onChange={(e) =>
                  setWebsite(e.target.value)
                }
                placeholder="https://www.example.com"
                autoComplete="url"
                className="mt-4 w-full rounded-xl border border-gray-300 px-5 py-4 text-black outline-none focus:border-green-600"
              />

              <p className="mt-2 text-right text-sm text-gray-500">
                {website.length}/150
              </p>
            </div>

            {/* CATEGORY / NICHE */}

            <div>
              <label
                htmlFor="category"
                className="block text-lg font-semibold text-black"
              >
                {categoryLabel}
              </label>

              <p className="mt-2 text-sm text-gray-600">
                {categoryDescription}
              </p>

              <input
                id="category"
                type="text"
                value={category}
                maxLength={150}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                placeholder={categoryPlaceholder}
                className="mt-4 w-full rounded-xl border border-gray-300 px-5 py-4 text-black outline-none focus:border-green-600"
              />

              <p className="mt-2 text-right text-sm text-gray-500">
                {category.length}/150
              </p>
            </div>

            {/* TIME ZONE */}

            <div>
              <label
                htmlFor="timeZone"
                className="block text-lg font-semibold text-black"
              >
                Time Zone
              </label>

              <p className="mt-2 text-sm text-gray-600">
                {timeZoneDescription}
              </p>

              <select
                id="timeZone"
                value={timeZone}
                onChange={(e) =>
                  setTimeZone(e.target.value)
                }
                className="mt-4 w-full rounded-xl border border-gray-300 bg-white px-5 py-4 text-black outline-none focus:border-green-600"
              >
                <option value="">
                  Select a time zone
                </option>

                <option value="America/New_York">
                  Eastern Time
                </option>

                <option value="America/Chicago">
                  Central Time
                </option>

                <option value="America/Denver">
                  Mountain Time
                </option>

                <option value="America/Los_Angeles">
                  Pacific Time
                </option>

                <option value="America/Anchorage">
                  Alaska Time
                </option>

                <option value="Pacific/Honolulu">
                  Hawaii Time
                </option>
              </select>
            </div>

          </div>

          {/* NAVIGATION */}

          <div className="mt-14 flex items-center justify-between">

            <Link
              href="/onboarding/manager-access"
              className="rounded-xl border border-gray-300 px-8 py-4 font-semibold text-black transition hover:border-green-400 hover:bg-green-50"
            >
              Back
            </Link>

            <button
              type="button"
              onClick={handleContinue}
              disabled={isContinueDisabled}
              className="rounded-xl bg-red-600 px-10 py-4 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Continue"}
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}